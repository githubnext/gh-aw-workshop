# Build a Research-Driven Next Training Node

> _Strong workshop content comes from real product signals, not guesses._

## 🎯 What You'll Do

In this step, you will turn `github/gh-aw` research into a concrete training plan update. You will review current gh-aw documentation signals, identify one meaningful learner gap, and draft a new workshop node proposal that is ready to implement. By the end, you will have a repeatable method for deciding what to teach next with confidence.

## 📋 Before You Start

- You completed [Step 18: Share and Reuse Your Agentic Workflows](18-share-and-reuse.md).
- You can open `workshop/README.md` and identify where new nodes belong in the curriculum table.
- You can run `gh aw compile` for workflow validation from earlier steps.

## Steps

### Review current gh-aw signals

Start by collecting the most current signal from the source repository and its docs references:

```bash
curl -fsSL https://raw.githubusercontent.com/github/gh-aw/main/LLMs.txt | head -n 40
```

This gives you a compact index of what the gh-aw project currently emphasizes for model and documentation consumption.

### Pick one high-value learner gap

Read your existing workshop path and ask one practical question: _what can a learner do now that they could not do before this new node exists?_ Keep your answer narrow. Good gaps are concrete, such as "how to validate workflow constraints before opening a PR" or "how to select safe outputs for automation."

### Draft a node proposal with clear scope

Write a one-paragraph node scope and list the exact artifacts it should change:

- one new `workshop/<step>-<slug>.md` file
- one curriculum row in `workshop/README.md`
- optional wording refresh in `workshop/00-welcome.md` when total step count changes

### Capture research metadata in XML comments

Add XML comments to preserve reasoning without interrupting learner flow:

```markdown
<!--
<research-metadata>
  <focus>safe outputs selection</focus>
  <sources>
    <source>https://raw.githubusercontent.com/github/gh-aw/main/LLMs.txt</source>
    <source>https://github.github.com/gh-aw/reference/safe-outputs/</source>
  </sources>
  <rationale>...</rationale>
</research-metadata>
-->
```

Keep the comment concise and traceable to real sources you used.

### Validate before opening a pull request

Run markdown lint and compile checks so your proposal is production-ready:

```bash
npx --yes markdownlint-cli2 "workshop/**/*.md"
gh aw compile .github/workflows/<your-workflow>.md --validate
```

## ✅ Checkpoint

- [ ] You reviewed current gh-aw direction signals from `LLMs.txt`
- [ ] You identified one concrete learner gap for a new training node
- [ ] You drafted a bounded node scope tied to specific repository files
- [ ] You captured supporting rationale in XML comments
- [ ] You ran lint and compile validation before preparing a PR

**Next:** [Learning GitHub Agentic Workflows](README.md)

## 📚 See Also

- [LLMs reference](https://github.github.com/gh-aw/reference/llms/)
- [Workflow patterns](https://github.github.com/gh-aw/guides/workflow-patterns/)
- [Safe outputs reference](https://github.github.com/gh-aw/reference/safe-outputs/)

<!--
<research-node-metadata>
  <intent>Teach maintainers how to choose and justify the next workshop node using live gh-aw research.</intent>
  <primary-source>https://raw.githubusercontent.com/github/gh-aw/main/LLMs.txt</primary-source>
  <secondary-sources>
    <source>https://github.github.com/gh-aw/reference/llms/</source>
    <source>https://github.github.com/gh-aw/guides/workflow-patterns/</source>
  </secondary-sources>
</research-node-metadata>
-->
