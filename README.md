# Testing [Postman Orbit](https://www.buildwithorbit.ai/) with Harry Potter 🪄 and The Octocats :octocat:

📝 [Read the LinkedIn post](https://lnkd.in/p/gf96eccT)

## MCP config used

```json
{
  "mcpServers": {
    "orbit": {
      "type": "http",
      "url": "https://mcp.buildwithorbit.ai/mcp",
      "tools": ["search", "integrate"]
    }
  }
}
```

This is registered as a repo-level MCP server for the Copilot coding agent under **Settings → Copilot → Coding agent → MCP configuration**. General setup docs:

- [Model Context Protocol (MCP) and GitHub Copilot cloud agent](https://docs.github.com/en/copilot/concepts/agents/coding-agent/mcp-and-coding-agent)
- [Configure MCP servers for your repository](https://docs.github.com/en/copilot/how-tos/copilot-on-github/customize-copilot/configure-mcp-servers)

## Experiment

Same GitHub Copilot coding agent task, run twice in this repo: build a page showing 5 Harry Potter characters and 5 Octocat characters, pulled from free, no-API-key APIs.

### Task 1 — with Orbit MCP

Prompt used:

> Use the Orbit MCP server (configured in this repository's MCP settings at `/settings/copilot/mcp`) to discover and use:
> 1. A free, no-API-key Harry Potter character API — find one via Orbit MCP
> 2. A free, no-API-key Octocat/GitHub character API — find one via Orbit MCP
>
> Then create a beautiful, self-contained `index.html` web page at the root of this repository that fetches and displays 5 Harry Potter characters and 5 Octocat characters, with house/species/patronus badges for HP characters and number/link badges for Octocats, laid out in two responsive columns with a dark GitHub-style theme, loading spinners, and error handling — pure vanilla JS, no dependencies.

Result: **63.4 AI credits, 3m 58s**. Orbit MCP returned both working APIs immediately:

| World | API | Auth |
|---|---|---|
| Harry Potter | `https://hp-api.onrender.com/api/characters` | None |
| Octocats | `https://octodex-rest-api-ccc20c6c9fbf.herokuapp.com/octocats` | None |

One clean file (`index.html`), no rework needed.

PR: [#1 — Add Harry Potter & Octocat showcase page using Orbit MCP-discovered APIs](https://github.com/postman-solutions-eng/jonico-orbit-test/pull/1)

### Task 2 — without Orbit MCP

Prompt used:

> DO NOT use orbit mcp to find a consumable harry potter character and octocat character API that can be used without API key and generate a web page that matches 5 characters of each based on their characteristics

Result: **78.1 AI credits, 6m 12s**. The agent had to find both APIs itself (web search, a few dead ends), then went through several rounds of validation and review fixes before landing on a working page. 3 files touched: `index.html`, `styles.css`, `app.js`, plus a `README.md` update.

PR: [#2 — Add Harry Potter × Octocat matcher page with no-key public APIs](https://github.com/postman-solutions-eng/jonico-orbit-test/pull/2)

### Takeaway

Same deliverable, ~19% fewer AI credits and ~36% less time — the entire gap is the "which API even works without a key" hunt that Orbit skipped. Agentic coding tasks don't spend most of their budget writing code; they spend it discovering the right API to call.
