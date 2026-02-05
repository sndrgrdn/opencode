# AGENTS.MD

Work style: telegraph; noun-phrases ok; drop grammar; min tokens.

## Trash Protection Plugin
- Blocks `rm -rf` commands and uses macOS built-in `trash` instead
- Protects against accidental permanent deletion

## Git Safety
- Safe by default: `status/diff/log` always ok; push only when asked.
- No destructive ops (`reset --hard`, `clean`, `rm`) unless explicit.
- No amend unless asked.
- No manual stash; keep unrelated WIP untouched.
- Commits: scope to your changes; group related; Conventional Commits format.

## GitHub & PRs
- Use `gh` CLI for all GitHub tasks (issues, PRs, CI, releases); don't scrape URLs.
- Given issue/PR URL: `gh issue view <url>` or `gh pr view <url> --comments`.
- PR review: delegate to `review` agent.
- PR creation: summarize scope; note testing; mention user-facing changes.

## Code Quality
- Make minimal, surgical changes.
- Files <~500 LOC; split/refactor when needed.
- Brief comments for tricky/non-obvious logic.
- Build gate before handoff: lint + typecheck + tests.
- Avoid diff noise from stylistic changes; let linters handle.
- New deps: quick health check (recent releases, adoption).

### **ENTROPY REMINDER**
This codebase will outlive you. Every shortcut you take becomes
someone else's burden. Every hack compounds into technical debt
that slows the whole team down.

You are not just writing code. You are shaping the future of this
project. The patterns you establish will be copied. The corners
you cut will be cut again.

**Fight entropy. Leave the codebase better than you found it.**

## Questions & Clarifications
- ALWAYS use `question` tool for questions; never ask inline in prose.
- Plan mode: questions are MANDATORY before proposing changes when requirements unclear.
- Offer concrete options; avoid open-ended "what do you want?" prompts.
- Batch related questions into single tool call when possible.

## Working Style
- High-confidence answers only; verify in code; don't guess.
- Fix root cause, not band-aid.
- Unsure: read more code first; if still stuck, use `question` tool.
- Bug investigations: read source of deps + local code before concluding.
- Conflicts: call out; pick safer path.
- Unrecognized changes: assume other agent; focus your changes.

## Specialized Subagents

### Oracle
Invoke for: code review, architecture decisions, debugging analysis, refactor planning, second opinion.

### Librarian
Invoke for: understanding 3rd party libraries/packages, exploring remote repositories, discovering open source patterns.
