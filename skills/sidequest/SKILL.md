---
name: side-quest
description: "Branch off default branch in a git worktree, fix something small over multiple turns, commit, optionally PR, and clean up without touching in-progress work. Use when spotting a typo, minor bug, or lint issue while on a feature branch."
compatibility: Requires git (with worktree support). Optional gh CLI for PR creation.
metadata:
  version: "1.0"
---

# Side Quest

Quick detour to fix something small without touching your current branch's work.

Uses `git worktree` to create a parallel working directory — your main worktree
(with any uncommitted changes) is never modified.

## References

| File | Purpose |
|------|---------|
| [edge-cases.md](./references/edge-cases.md) | Abort protocol, conflicts, recovery |

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/preflight.sh` | Validate git state, detect default branch, generate paths |

## Input

Fix description from user: $ARGUMENTS

## Context

Current branch: !`git rev-parse --abbrev-ref HEAD 2>/dev/null || echo detached`
Default branch: !`git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p' || echo main`
Repo root: !`git rev-parse --show-toplevel 2>/dev/null`

## Workflow

### Step 1: Preflight

Run `scripts/preflight.sh` from the skill directory (paths shown in skill_files).

The script outputs key=value pairs. Capture:
- `DEFAULT_BRANCH` — base for the side-quest branch
- `WORKTREE_PATH` — temp directory path (under `/tmp/`)
- `BRANCH_NAME` — derived from the fix description (e.g. `fix/readme-typo`)
- `BLOCKED` — if not `none`, abort with the reason

If the user specified a base branch (e.g. "branch from develop"), override `DEFAULT_BRANCH`.

If the generated branch name already exists, append a timestamp suffix.

### Step 2: Create Worktree

```bash
git fetch origin <DEFAULT_BRANCH>
git worktree add -b <BRANCH_NAME> <WORKTREE_PATH> origin/<DEFAULT_BRANCH>
```

Confirm to user:
> Side-quest started on branch `<BRANCH_NAME>`.
> Working in: `<WORKTREE_PATH>`

### Step 3: Setup Worktree Environment

Before doing any work, set up the worktree for development:

```bash
ln -s <REPO_ROOT>/node_modules <WORKTREE_PATH>/node_modules
cd <WORKTREE_PATH> && mise trust
```

- **Symlink `node_modules`** from the original repo so dependencies are available
  instantly without a fresh install.
- **`mise trust`** so tool versions (node, python, etc.) resolve correctly.

### Step 4: Work on the Fix (multi-turn)

**CRITICAL: All file operations (read, edit, write, bash) must use paths
under `<WORKTREE_PATH>`. Never modify files in the original worktree.**

- Make the changes the user described
- This is a conversation — iterate with the user over multiple turns
- Run tests, lint, or build in the worktree if relevant (use `workdir` param)
- Do NOT auto-commit. Wait for the user to signal they're satisfied.

Cues that the user is done: "looks good", "wrap it up", "commit", "done",
"ship it", "that's it", "quest complete".

### Step 5: Commit

When the user is satisfied:

Load the `commit` skill first to format/validate the commit message convention.

```bash
# In the worktree directory
git -C <WORKTREE_PATH> add -A
git -C <WORKTREE_PATH> commit -m "<type>: <description>"
```

Use conventional commit format. Single atomic commit. Verify no secrets staged.

Record the commit SHA:
```bash
git -C <WORKTREE_PATH> rev-parse --short HEAD
```

### Step 6: Push + PR (optional)

If the user requested a PR (said "PR", "pull request", "and PR", or similar):

Load the `create-pr` skill first for PR title/body structure.

```bash
git -C <WORKTREE_PATH> push -u origin <BRANCH_NAME>
cd <WORKTREE_PATH> && gh pr create --draft --title "<type>: <description>" --body "Side-quest fix."
```

If `gh` is not available or not authenticated, skip PR and inform user.
If user didn't mention PR, ask: "Want me to push and create a PR?"

### Step 7: Cleanup + Handoff

Remove the worktree (the branch and commits persist in the repo):

```bash
git worktree remove <WORKTREE_PATH>
```

Print a summary:

```
Side-quest complete.
  Branch : <BRANCH_NAME>
  Commit : <SHORT_SHA>
  PR     : <URL or "none">

The branch is in your local repo. From your main worktree:
  git cherry-pick <SHA>           # grab the fix
  git merge <BRANCH_NAME>         # merge the branch
  git log <BRANCH_NAME>           # inspect it
  git branch -d <BRANCH_NAME>     # delete when done
```

### Inline Mode (rare)

If invoked mid-task in an existing session (not a fresh session), delegate
the fix work to a **subtask** to keep the main conversation context clean:

1. Run preflight + create worktree in the main context
2. Use the `task` tool to delegate the fix:
   - Prompt: the fix description + worktree path + instructions to work only in that path
   - Include: "Run `mise trust` in the worktree before any lint/test/build commands"
   - The subtask handles steps 3-5
3. Back in main context: handle step 6-7, then resume the original task

## Key Rules

1. **Never touch the main worktree** — all edits in the side-quest worktree only
2. **One atomic commit** — side-quests are small and focused
3. **Always clean up** — remove worktree even if the fix fails
4. **Don't auto-commit** — wait for user confirmation
5. **Resist scope creep** — if it's big, it's not a side-quest
6. **Branch persists after cleanup** — remind user it's available for cherry-pick
7. **`mise trust` before tooling** — always run in worktree before lint/test/build
