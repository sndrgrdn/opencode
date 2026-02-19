# OpenCode Global Config

Global (user-level) configuration for [OpenCode](https://opencode.ai) — lives at `~/.config/opencode/`.

For full documentation see [opencode.ai/docs](https://opencode.ai/docs).

## Structure

| Path | Purpose |
|---|---|
| `opencode.json` | Main config — permissions, MCP servers, plugins, theme |
| `AGENTS.md` | System-wide agent instructions (coding style, git safety, etc.) |
| `agents/` | Custom subagent definitions (oracle, librarian, review, opencode-expert) |
| `skills/` | Reusable skill modules (commit, create-pr, review, side-quest, build-skill, librarian) |
| `commands/` | Slash commands (brainstorm, discovery, review, sidequest, build-skill) |
| `plugins/` | Plugin assets |

## Config Highlights

- **Permissions** — granular read/write/bash controls; SSH keys denied, git push requires confirmation
- **MCP Servers** — [Context7](https://context7.com), [grep.app](https://grep.app), and [opensrc](https://www.npmjs.com/package/opensrc-mcp) for code search and library exploration
- **Theme** — `kanagawa`
- **Auto-update** enabled; snapshots enabled; sharing set to manual

## Links

- [OpenCode Docs](https://opencode.ai/docs)
- [OpenCode GitHub](https://github.com/sst/opencode)
