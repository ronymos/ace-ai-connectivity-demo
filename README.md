# ACE | AI Connectivity Security — interactive demo

Zero-install HTML demo of the proposed **AI Connectivity Security** module for AlgoSec ACE (with Horizon / AppViz / FireFlow context). Open `index.html` in a browser. No Node, npm, or backend required.

This workspace does not have Node.js, so the demo is a static SPA instead of Vite + React. The visual system, information architecture, and Finance Operations story match the approved plan.

## How to present (about 8 minutes)

1. Open [index.html](index.html). Presenter panel is on by default (press **P** to hide before projecting if you want a cleaner screen).
2. **Overview** — 18 AI-enabled apps, 6 with network risk. Point at Finance Operations.
3. Click **Finance Operations** → **Connectivity & Boundaries**. Click **Internet callers**, then **mcp-finance-prod**.
4. Click **Open F-104** — investigation panel states what the evidence cannot prove.
5. **MCP / A2A** — CIS MCP 55 / not assessed stays separate from pass/fail.
6. **Compliance** — select AWS / Azure / GCP architecture profiles.
7. Click **Simulate remediation** — current `0.0.0.0/0` vs Approved Agent Subnet. Say FireFlow is planned, not live.

## Keys

- `P` presenter panel
- `1`–`7` jump Overview → Apps → Connectivity → Findings → Posture → Architecture → Changes
- `Esc` hide presenter

## Guardrails (do not claim in the room)

- Not an AI-SPM or runtime protection suite.
- No unique MCP discovery, CIS A2A certification, or live unified TSQ/FireFlow workflow.
- Potential ≠ observed. Missing evidence = Not assessed, never secure.
