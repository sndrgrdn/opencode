# Edge Cases

## Abort Protocol

If the user says "abort", "cancel", or "nevermind" during a side-quest:

1. Discard uncommitted changes in worktree:
   ```bash
   git -C <WORKTREE_PATH> checkout -- .
   ```
2. Remove worktree:
   ```bash
   git worktree remove --force <WORKTREE_PATH>
   ```
3. Delete the side-quest branch (if no commits worth keeping):
   ```bash
   git branch -D <BRANCH_NAME>
   ```
4. Confirm: "Side-quest aborted. Branch deleted. Main worktree untouched."

## Branch Name Collision

If `fix/<name>` already exists:

```
Branch exists?
├─ Append timestamp: fix/<name>-<YYYYMMDD-HHMM>
└─ Still exists? Ask user for alternative name
```

## Worktree Path Collision

The preflight script uses a timestamp, making collision near-impossible.
If it happens, append a random 4-char suffix.

## No Remote

If `git remote` returns empty:
- Branch from local default: `git worktree add -b <BRANCH> <PATH> <DEFAULT_BRANCH>`
- Skip fetch, push, and PR steps
- Inform: "No remote configured. Committed locally only."

## gh CLI Not Available

If `gh` is not installed or not authenticated:
- Skip PR creation
- Print: "gh CLI not available. Push manually: `git push -u origin <BRANCH>`"

## Detached HEAD (original branch)

If the original worktree was on detached HEAD:
- Record the SHA before starting
- Doesn't affect the side-quest (worktree branches from default)
- On summary, note the user was on detached HEAD

## Worktree Cleanup Fails

```
git worktree remove fails?
├─ Uncommitted changes → git worktree remove --force <PATH>
├─ Still fails → inform user: "Worktree at <PATH> needs manual cleanup"
└─ Locked → git worktree unlock <PATH>, then retry remove
```

## mise trust Fails

If `mise trust` fails or `mise` is not installed:
- Warn: "mise not available — tool versions may not match. Lint/test results could differ."
- Continue with the fix (don't block on this)

## Scope Creep

If the fix grows beyond a small change:
- Warn: "This is getting bigger than a side-quest. Consider a dedicated branch."
- Offer to commit what's done so far and stop
- The worktree and branch persist — user can continue manually
