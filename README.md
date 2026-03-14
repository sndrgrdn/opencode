# OpenCode Global Config

Global (user-level) configuration for [OpenCode](https://opencode.ai) — lives at `~/.config/opencode/`.

For full documentation see [opencode.ai/docs](https://opencode.ai/docs).

## Structure

| Path | Purpose |
|---|---|
| `opencode.json` | Main config — permissions, MCP servers, plugins |
| `AGENTS.md` | System-wide agent instructions (coding style, git safety, etc.) |
| `agents/` | Custom subagent definitions (oracle, librarian, review, opencode-expert) |
| `skills/` | Reusable skill modules (autoresearch, build-skill, librarian, review, sidequest) |
| `commands/` | Slash commands (build-skill, review, sidequest) |
| `plugins/` | Plugin assets |
| `.opencode/` | Internal state (plans, sessions) |
| `tui.json` | TUI preferences |

## Config Highlights

- **Permissions** — granular read/write/bash controls; SSH keys denied, git push requires confirmation
- **MCP Servers** — [Context7](https://context7.com), [grep.app](https://grep.app), and [opensrc](https://www.npmjs.com/package/opensrc-mcp) for code search and library exploration
- **Plugins** — `opencode-anthropic-auth` for authentication
- **Auto-update** enabled; snapshots enabled; sharing set to manual

## Links

- [OpenCode Docs](https://opencode.ai/docs)
- [OpenCode GitHub](https://github.com/sst/opencode)
