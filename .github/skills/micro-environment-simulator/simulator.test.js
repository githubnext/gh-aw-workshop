"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const test = require("node:test");

const simulator = require("./simulator");
const journey = require("./workshop-student-journey");

const populationModel = JSON.parse(
  fs.readFileSync(path.join(__dirname, "workshop-student-population.json"), "utf8")
);

test("journey step file mappings match current workshop page setup", () => {
  const workshopDir = path.resolve(__dirname, "..", "..", "..", "workshop");
  const mappedFiles = Object.values(journey.stepFilesById).flat();
  const currentWorkshopFiles = fs
    .readdirSync(workshopDir)
    .filter((file) => file.endsWith(".md") && file !== "README.md" && !file.startsWith("side-quest"))
    .sort();

  assert.equal(new Set(mappedFiles).size, mappedFiles.length, "Workshop pages must not be mapped twice");
  assert.deepEqual([...mappedFiles].sort(), currentWorkshopFiles);
  assert.ok(journey.stepFilesById["02-setup"].includes("02c-setup-browser.md"));
  assert.ok(journey.stepFilesById["06-install-gh-aw"].includes("06c-install-ui.md"));
});

test("seeded random streams are reproducible and non-cyclic over the simulation batch", () => {
  const first = simulator.createSeededRng(42);
  const second = simulator.createSeededRng(42);
  const firstValues = Array.from({ length: 1000 }, () => first());
  const secondValues = Array.from({ length: 1000 }, () => second());

  assert.deepEqual(firstValues, secondValues);
  assert.equal(new Set(firstValues).size, firstValues.length);
  assert.ok(firstValues.every((value) => value >= 0 && value < 1));
});

test("synthetic cohorts are reproducible and follow conditional model support", () => {
  const first = simulator.generateSyntheticStudents(populationModel, "test-seed");
  const second = simulator.generateSyntheticStudents(populationModel, "test-seed");

  assert.deepEqual(first, second);
  assert.equal(first.students.length, populationModel.cohortSize);
  assert.equal(first.population_model_version, populationModel.modelVersion);
  for (const student of first.students) {
    assert.ok(populationModel.distributions.backgroundByLevel[student.level][student.background] > 0);
    assert.ok(populationModel.distributions.toolByLevel[student.level][student.tool] > 0);
    assert.equal(student.runs, 0);
    assert.equal(student.successes, 0);
  }
});

test("population distributions reject invalid weights", () => {
  assert.throws(
    () => simulator.weightedChoice(() => 0.5, { valid: 1, invalid: -1 }, "test"),
    /positive finite numbers/
  );
  assert.throws(
    () => simulator.weightedChoice(() => 0.5, {}, "test"),
    /at least one weighted value/
  );
  assert.throws(
    () => simulator.weightedChoice(() => 0.5, { first: 0.4, second: 0.4 }, "test"),
    /must sum to 1/
  );
});

test("dropout rates use runs reaching each step as the denominator", () => {
  const aggregate = simulator.aggregateDropoutRates(
    [
      {
        failuresByStep: { first: 4, second: 3 },
        attemptsByStep: { first: 10, second: 6 }
      },
      {
        failuresByStep: { first: 2, second: 1 },
        attemptsByStep: { first: 10, second: 8 }
      }
    ],
    ["first", "second"]
  );

  assert.equal(aggregate.dropoutRateByStep.first, 6 / 20);
  assert.equal(aggregate.dropoutRateByStep.second, 4 / 14);
  assert.equal(aggregate.attemptsByStep.second, 14);
  assert.equal(aggregate.failuresByStep.second, 4);
});

test("Wilson intervals contain the observed proportion", () => {
  const interval = simulator.wilsonInterval(50, 100);
  assert.ok(interval.low < 0.5);
  assert.ok(interval.high > 0.5);
  assert.deepEqual(simulator.wilsonInterval(0, 0), { low: null, high: null });
  assert.throws(() => simulator.wilsonInterval(2, 1), /0 <= successes <= attempts/);
});

test("synthetic simulation history does not increase learner confidence", () => {
  const base = {
    id: 7,
    level: "github-basic",
    personality: "curious",
    background: "web-dev",
    goal: "personal-learning",
    tool: "vscode",
    ui_preferred: false,
    runs: 0,
    successes: 0
  };
  const experienced = { ...base, runs: 10000, successes: 10000 };
  const freshState = simulator.defaultEnvironmentForStudent(base, 120, 3);
  const experiencedState = simulator.defaultEnvironmentForStudent(experienced, 120, 3);

  assert.equal(freshState.learner.confidence, experiencedState.learner.confidence);
  assert.equal(freshState.learner.sessionEffect, experiencedState.learner.sessionEffect);
  assert.deepEqual(freshState.learner.mastery, experiencedState.learner.mastery);
});

test("agent assumption evaluations are normalized and stale evaluations are ignored", (t) => {
  const repoRoot = fs.mkdtempSync(path.join(os.tmpdir(), "simulator-evals-"));
  t.after(() => fs.rmSync(repoRoot, { recursive: true, force: true }));
  fs.mkdirSync(path.join(repoRoot, "workshop"));
  fs.writeFileSync(path.join(repoRoot, "workshop", "step.md"), "# Current lesson\n");
  const contentHash = simulator.analyzeStepMarkdown("step", "# Current lesson\n").contentHash;
  const normalized = simulator.normalizeAgentInsightsByStep({
    stepInsightsById: {
      step: {
        evaluatedContentHash: String(contentHash),
        evaluations: {
          valid: { answer: "yes", evidence: ["step.md:1", 2] },
          unknown: { answer: "UNKNOWN" },
          invalid: { answer: "MAYBE" }
        }
      }
    }
  });

  assert.equal(normalized.step.evaluations.valid.answer, "YES");
  assert.deepEqual(normalized.step.evaluations.valid.evidence, ["step.md:1"]);
  assert.equal(normalized.step.evaluations.unknown.answer, "UNKNOWN");
  assert.equal(normalized.step.evaluations.invalid, undefined);

  const current = simulator.buildStepContentById({
    steps: ["step"],
    stepFilesById: { step: ["step.md"] },
    repoRoot,
    agentInsightsByStep: normalized
  });
  assert.equal(current.step.agentInsight.evaluations.valid.answer, "YES");

  fs.writeFileSync(path.join(repoRoot, "workshop", "step.md"), "# Updated lesson\n");
  const updated = simulator.buildStepContentById({
    steps: ["step"],
    stepFilesById: { step: ["step.md"] },
    repoRoot,
    agentInsightsByStep: normalized
  });
  assert.equal(updated.step.agentInsight, null);
});

test("agent adjustments are bounded and unknown adjustment keys are ignored", () => {
  const normalized = simulator.normalizeAgentInsightsByStep({
    stepInsightsById: {
      step: {
        evaluatedContentHash: 1,
        bias: -4,
        semanticScores: {
          stateReadiness: -10,
          pathClarity: 60,
          recoverySupport: 120,
          ignored: "not-a-score"
        },
        signalAdjustments: { complexity: 3, invented: 1 },
        pathAdjustments: { browser: -3, invented: -1 }
      },
      malformed: {
        semanticScores: {
          stateReadiness: null,
          pathClarity: "not-a-score"
        }
      }
    }
  });

  assert.equal(normalized.step.bias, -0.15);
  assert.deepEqual(normalized.step.semanticScores, {
    stateReadiness: 0,
    pathClarity: 60,
    recoverySupport: 100
  });
  assert.deepEqual(normalized.step.signalAdjustments, { complexity: 0.15 });
  assert.deepEqual(normalized.step.pathAdjustments, { browser: -0.15 });
  assert.equal(normalized.malformed.semanticScores, undefined);
});

test("semantic page scores change the statistical readiness outcome", () => {
  const student = {
    id: 9,
    level: "beginner",
    personality: "curious",
    background: "no-coding",
    goal: "personal-learning",
    tool: "cli",
    ui_preferred: false
  };
  const state = simulator.defaultEnvironmentForStudent(student, 120, 0);
  const transition = journey.transitions["04-actions-intro"];
  const context = {
    stepId: "04-actions-intro",
    random: () => 0.65,
    stepContent: {
      agentInsight: {
        semanticScores: {
          stateReadiness: 0,
          pathClarity: 0,
          recoverySupport: 0
        }
      }
    }
  };

  assert.equal(transition(state, { ...context, stepContent: {} }).ok, true);
  assert.equal(transition(state, context).ok, false);
});

function firstWorkflowState(centralizedCopilotBilling) {
  const student = {
    id: 1,
    level: "actions-user",
    personality: "methodical",
    background: "web-dev",
    goal: "personal-learning",
    tool: "CCA",
    ui_preferred: true
  };
  const state = JSON.parse(
    JSON.stringify(simulator.defaultEnvironmentForStudent(student, 120, 0))
  );
  state.auth.hasGithubSession = true;
  state.auth.hasCopilotAccess = true;
  state.github.deployment = "github.com";
  state.flags.hasRepo = true;
  state.flags.repoHasReadme = true;
  state.actions.centralizedCopilotBilling = centralizedCopilotBilling;
  return state;
}

function firstWorkflowContext(evaluations) {
  return {
    stepId: "07-first-workflow",
    random: () => 0,
    stepContent: {
      browserSupport: 1,
      terminalDemand: 0,
      complexity: 0,
      authDemand: 0,
      troubleshootingSupport: 0,
      conceptDemand: 0,
      enterpriseDemand: 0,
      workflowCompileCueCount: 0,
      agentInsight: { evaluations }
    }
  };
}

test("semantic evaluations update compiled workflow and centralized billing state", () => {
  const result = journey.transitions["07-first-workflow"](
    firstWorkflowState(true),
    firstWorkflowContext({
      cca_authoring_guidance: { answer: "YES" },
      workflow_source_created_copilot: { answer: "YES" },
      workflow_compiled_copilot: { answer: "YES" },
      workflow_published_copilot: { answer: "YES" },
      copilot_centralized_billing_configured: { answer: "YES" }
    })
  );

  assert.equal(result.ok, true);
  assert.equal(result.state.flags.workflowReadyToRun, true);
  assert.equal(result.state.actions.permissions.copilotRequestsWrite, true);
  assert.equal(result.state.actions.secrets.COPILOT_GITHUB_TOKEN, false);
});

test("semantic evaluations update personal billing state and fail closed on UNKNOWN", () => {
  const configured = journey.transitions["07-first-workflow"](
    firstWorkflowState(false),
    firstWorkflowContext({
      cca_authoring_guidance: { answer: "YES" },
      workflow_source_created_copilot: { answer: "YES" },
      workflow_compiled_copilot: { answer: "YES" },
      workflow_published_copilot: { answer: "YES" },
      copilot_personal_billing_configured: { answer: "YES" }
    })
  );
  const notPublished = journey.transitions["07-first-workflow"](
    firstWorkflowState(false),
    firstWorkflowContext({
      cca_authoring_guidance: { answer: "YES" },
      workflow_source_created_copilot: { answer: "YES" },
      workflow_compiled_copilot: { answer: "YES" },
      workflow_published_copilot: { answer: "UNKNOWN" },
      copilot_personal_billing_configured: { answer: "UNKNOWN" }
    })
  );

  assert.equal(configured.ok, true);
  assert.equal(configured.state.actions.permissions.copilotRequestsWrite, false);
  assert.equal(configured.state.actions.secrets.COPILOT_GITHUB_TOKEN, true);
  assert.equal(notPublished.state.flags.workflowReadyToRun, false);
  assert.equal(notPublished.state.actions.secrets.COPILOT_GITHUB_TOKEN, false);
});

test("step Greek estimator returns bounded local signal sensitivities", () => {
  const student = {
    id: 12,
    level: "github-basic",
    personality: "methodical",
    background: "web-dev",
    goal: "personal-learning",
    tool: "cli",
    ui_preferred: true,
    runs: 0,
    successes: 0
  };
  const state = simulator.defaultEnvironmentForStudent(student, 120, 0);
  const estimate = journey.stepGreekEstimator(state, {
    stepId: "08-run-your-workflow",
    random: () => 0.5,
    stepContent: {
      complexity: 0.35,
      terminalDemand: 0.6,
      browserSupport: 0.2,
      authDemand: 0.3,
      troubleshootingSupport: 0.4,
      conceptDemand: 0.5,
      enterpriseDemand: 0.1
    }
  });

  assert.ok(estimate.probability > 0.12 && estimate.probability < 0.985);
  assert.deepEqual(Object.keys(estimate.greeks).sort(), [...journey.STEP_SIGNAL_KEYS].sort());
  assert.ok(estimate.greeks.complexity < 0);
  assert.ok(estimate.greeks.terminalDemand < 0);
  assert.ok(estimate.greeks.troubleshootingSupport > 0);
});

test("Monte Carlo Greeks aggregate reached-step sensitivities without bump reruns", () => {
  const students = [
    {
      id: 1,
      name: "Learner 001",
      level: "beginner",
      personality: "curious",
      background: "web-dev",
      goal: "personal-learning",
      tool: "cli",
      ui_preferred: false
    }
  ];
  const steps = ["alpha", "beta", "gamma"];
  const transitions = {
    alpha: (state) => ({ ok: true, state }),
    beta: (state) => ({ ok: true, state })
  };
  const { greeks } = simulator.simulateStudentsMonteCarloWithGreeks(students, "2026-07-21", 2, {
    steps,
    transitions,
    stepContentById: {
      alpha: { complexity: 0.2 },
      beta: { complexity: 0.3 }
    },
    initialStateForStudent: (student) => simulator.defaultEnvironmentForStudent(student, 120, 0),
    stepGreekEstimator: (_state, context) => ({
      greeks:
        context.stepId === "alpha"
          ? { complexity: -0.5, browserSupport: 0.25 }
          : { complexity: -0.25, browserSupport: 0.1 }
    })
  });

  assert.equal(greeks.algorithm, "vandendorpe-reached-state");
  assert.equal(greeks.atRiskRunsByStep.alpha, 2);
  assert.equal(greeks.atRiskRunsByStep.beta, 2);
  assert.equal(greeks.conditionalGreeksByStep.alpha.complexity, -0.5);
  assert.equal(greeks.conditionalGreeksByStep.beta.browserSupport, 0.1);
  assert.equal(greeks.overallGreeksByStep.alpha.complexity, -0.5);
  assert.equal(greeks.overallGreeksByStep.beta.complexity, -0.25);
  assert.equal(greeks.conditionalGreeksByStep.gamma.complexity, null);
});
