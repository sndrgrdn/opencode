# Review Targets

How to acquire diffs for different review targets.

## Target Detection (Auto)

```bash
# 1. Check for uncommitted changes
if [ -n "$(git status --porcelain)" ]; then
  echo "uncommitted"
  exit 0
fi

# 2. Check if on feature branch
current=$(git branch --show-current)
default=$(git symbolic-ref refs/remotes/origin/HEAD --short 2>/dev/null | sed 's|origin/||')
default=${default:-main}

if [ "$current" != "$default" ]; then
  echo "branch:$default"
  exit 0
fi

# 3. Default to recent commit
echo "commit:HEAD"
```

## PR Review

### Option A: Direct diff (no checkout)

```bash
gh pr diff <number>
```

Best when: clean working tree not guaranteed, quick review.

### Option B: Checkout with merge-base

```bash
# Get PR info
gh pr view <number> --json baseRefName,title,number

# Checkout PR branch
gh pr checkout <number>

# Find merge base for accurate diff
merge_base=$(git merge-base HEAD origin/<base_branch>)

# Get diff
git diff $merge_base
```

**Always use merge-base.** Direct `git diff origin/main` includes changes merged into main after PR creation.

## Branch Diff

```bash
# Find merge base with target branch
merge_base=$(git merge-base HEAD <target_branch>)

# If target has upstream, prefer that
upstream=$(git rev-parse --abbrev-ref "<target_branch>@{upstream}" 2>/dev/null)
[ -n "$upstream" ] && merge_base=$(git merge-base HEAD $upstream)

# Get diff
git diff $merge_base
```

## Uncommitted Changes

```bash
# Staged changes
git diff --cached

# Unstaged changes to tracked files
git diff

# Untracked files
git status --porcelain | grep '^??' | cut -c4-

# Summary view
git status -sb
```

## Commit Review

```bash
# Single commit diff
git show <sha>

# With file stats
git show --stat <sha>

# Context (surrounding commits)
git log --oneline -5 <sha>
```

## Folder Snapshot

Not a diff - read files directly:

```bash
# List files by type
find <folder> -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" \)

# Read specific file
cat <folder>/file.ts
```

Focus: code quality, patterns, security, test coverage.

## Merge-Base Explained

```
main:     A---B---C---D---E  (current main)
               \
feature:        F---G---H    (your branch)
```

- `git merge-base HEAD main` returns `B` (common ancestor)
- `git diff B` shows only F, G, H changes
- `git diff main` would include C, D, E (wrong!)

## Useful Commands

| Task | Command |
|------|---------|
| Current branch | `git branch --show-current` |
| Default branch | `git symbolic-ref refs/remotes/origin/HEAD --short` |
| Has uncommitted? | `git status --porcelain` |
| Diffstat | `git diff --stat <ref>` |
| Changed files | `git diff --name-only <ref>` |
| PR base branch | `gh pr view <num> --json baseRefName -q .baseRefName` |
