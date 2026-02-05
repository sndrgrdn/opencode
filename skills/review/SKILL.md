---
name: review
description: Code review rubric with P0-P3 priorities, security focus, target-specific prompts. Use when reviewing PRs, branches, commits, or uncommitted changes.
references:
  - references/rubric.md
  - references/targets.md
  - references/security.md
---

# Code Review

Structured review with priority-tagged findings.

## Quick Reference

| Priority | Meaning | Examples |
|----------|---------|----------|
| **[P0]** | Drop everything | Security breach, data loss, blocking prod |
| **[P1]** | Urgent | Fix next cycle; pattern violation, missing tests |
| **[P2]** | Normal | Fix eventually; minor improvements |
| **[P3]** | Nice to have | Suggestions, alternatives |

## Review Targets

| Target | How to Get Diff |
|--------|-----------------|
| PR | `gh pr diff <num>` or `git diff $(git merge-base HEAD origin/<base>)` |
| Branch | `git diff $(git merge-base HEAD <branch>)` |
| Uncommitted | `git diff` + `git diff --cached` + `git status` |
| Commit | `git show <sha>` |
| Folder | Read files directly (no diff) |

### Target Detection

If no specific target provided, auto-detect:

1. **PR number/URL provided** → Review that PR
   ```bash
   gh pr diff <ref>
   # or for deeper analysis:
   gh pr view <ref> --json baseRefName -q .baseRefName
   merge_base=$(git merge-base HEAD origin/<base>)
   git diff $merge_base
   ```

2. **Uncommitted changes exist** → Review uncommitted
   ```bash
   git status --porcelain  # check if non-empty
   git diff --cached       # staged
   git diff                # unstaged
   ```

3. **On feature branch** → Review against default branch
   ```bash
   current=$(git branch --show-current)
   default=$(git symbolic-ref refs/remotes/origin/HEAD --short 2>/dev/null | sed 's|origin/||')
   merge_base=$(git merge-base HEAD origin/${default:-main})
   git diff $merge_base
   ```

4. **Otherwise** → Ask what to review with the `question` tool

### Examples

- `review` — auto-detect target
- `review pr 123` — review PR #123
- `review https://github.com/org/repo/pull/456` — review PR from URL
- `review uncommitted` — review staged + unstaged changes
- `review branch main` — review current branch against main
- `review commit abc1234` — review specific commit
- `review folder src/api` — snapshot review of folder

## In This Reference

| File | Purpose |
|------|---------|
| [rubric.md](./references/rubric.md) | What to flag, comment guidelines, priorities |
| [targets.md](./references/targets.md) | Target detection, merge-base commands |
| [security.md](./references/security.md) | Security checklist |

## What to Flag

Issues that:
1. Impact accuracy, performance, security, or maintainability
2. Are discrete and actionable
3. Were **introduced in this change** (not pre-existing)
4. Author would fix if aware
5. Have provable impact (not speculation)

## What NOT to Flag

- Pre-existing issues outside the diff
- Style preferences (let linters handle)
- Speculation without provable impact
- Changes clearly intentional

## Project Guidelines

Check for `REVIEW_GUIDELINES.md` in project root:

```bash
[ -f "REVIEW_GUIDELINES.md" ] && cat REVIEW_GUIDELINES.md
```

Project rules override defaults where they conflict.

## Output Contract

```markdown
## Review: <what was reviewed>

### Findings

#### [P1] Missing error handling
**File:** `src/api.ts:45`
**Issue:** Fetch can throw; no try/catch.
**Fix:** Wrap in try/catch, handle network errors.

### Verdict
Needs attention - 1 blocking issue (error handling).
```

## Verdicts

| Verdict | When |
|---------|------|
| **Looks good** | No P0/P1; P2/P3 minor; follows patterns |
| **Needs attention** | Any P0/P1; multiple P2 in same area |
