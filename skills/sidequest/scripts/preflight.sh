#!/usr/bin/env bash
set -euo pipefail

# side-quest preflight — validate git state and generate worktree config
# Outputs key=value pairs for the agent to capture.

# --- Ensure we're in a git repo ---
if ! git rev-parse --is-inside-work-tree &>/dev/null; then
    echo "BLOCKED=not-a-git-repo"
    exit 1
fi

# --- Check for blocking operations ---
GIT_DIR=$(git rev-parse --git-dir)

if [ -d "${GIT_DIR}/rebase-merge" ] || [ -d "${GIT_DIR}/rebase-apply" ]; then
    echo "BLOCKED=rebase"
    exit 1
fi
if [ -f "${GIT_DIR}/MERGE_HEAD" ]; then
    echo "BLOCKED=merge"
    exit 1
fi
if [ -f "${GIT_DIR}/CHERRY_PICK_HEAD" ]; then
    echo "BLOCKED=cherry-pick"
    exit 1
fi

# --- Detect branches ---
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "detached")
DEFAULT_BRANCH=$(git remote show origin 2>/dev/null | sed -n 's/.*HEAD branch: //p' || true)
DEFAULT_BRANCH=${DEFAULT_BRANCH:-main}

# --- Generate worktree path ---
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
WORKTREE_PATH="/tmp/side-quest-${TIMESTAMP}"

# --- Repo root (for reference) ---
REPO_ROOT=$(git rev-parse --show-toplevel)

# --- Output ---
echo "BLOCKED=none"
echo "CURRENT_BRANCH=${CURRENT_BRANCH}"
echo "DEFAULT_BRANCH=${DEFAULT_BRANCH}"
echo "WORKTREE_PATH=${WORKTREE_PATH}"
echo "REPO_ROOT=${REPO_ROOT}"
echo "TIMESTAMP=${TIMESTAMP}"
