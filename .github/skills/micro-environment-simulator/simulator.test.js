"use strict";

const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const test = require("node:test");

const simulator = require("./simulator");

const populationModel = JSON.parse(
  fs.readFileSync(path.join(__dirname, "workshop-student-population.json"), "utf8")
);

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
  assert.deepEqual(freshState.learner.mastery, experiencedState.learner.mastery);
});
