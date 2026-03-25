import type { SectionContent } from '../types';

const slug = 'demo-playbook';
const title = 'Demo Playbook';
const description = 'Step-by-step guides for demoing O4AA to customers — xaa.dev playground, the Agent0/Todo0 reference app, and the MCP Adapter Docker bundle.';
const tags = ['SE-playbook', 'demo', 'POC', 'setup'];
const icon = '🎬';
const hasDiagram = false;
const diagramPrompt = '';

const cards = [
  {
    heading: 'Quick Demo: xaa.dev Playground',
    paragraphs: [
      '!! xaa.dev is a free, browser-based playground for Cross App Access. No local setup required. Use this for first-call demos or when you need to show the XAA flow in under 5 minutes.',
      '>> Demo flow: (1) Open xaa.dev in browser, (2) Walk through the three-party model: requesting app, IdP, resource app, (3) Show the ID-JAG token being issued, (4) Show the resource app validating the assertion against the IdP\'s JWKS, (5) Point out: "The resource app never trusts the requesting app directly — it trusts Okta."',
      'TT "Let me show you how Cross App Access works in practice. This is a live playground — no slides, real tokens. Watch what happens when the agent app requests access to the resource app through Okta..."',
      'Best for: first-call demos, executive overviews, security architect introductions. Not suitable for: deep technical POCs (use the full reference app for that).',
    ],
  },
  {
    heading: 'Full Demo: Agent0/Todo0 Reference App',
    paragraphs: [
      'The oktadev/okta-secure-ai-agent-example repo is the full XAA reference implementation. It includes Agent0 (an AI agent using Claude via Amazon Bedrock) and Todo0 (a todo management app exposing MCP-protected APIs). The demo shows Agent0 accessing Todo0\'s APIs on behalf of a user via XAA.',
      '>> Setup steps: (1) Clone the repo: git clone github.com/oktadev/okta-secure-ai-agent-example, (2) Ensure prerequisites: VS Code, Python 3.9+, Docker, AWS credentials for Bedrock, (3) Enable XAA: Admin Console > Settings > Features > Early Access > "Cross App Access" toggle, (4) Run bootstrap: pnpm run bootstrap:okta — this creates the custom auth server, custom scopes (mcp:connect, mcp:tools:read, mcp:tools:manage), 2 OIDC apps, agent identity with RSA key pair, managed connection, and access policies, (5) Start the apps: follows Dev Container workflow in VS Code.',
      '!! The bootstrap script (pnpm run bootstrap:okta) automates ALL Okta configuration. You do not need to manually create apps, scopes, or policies. This is critical for demo reliability — manual setup is where demos break.',
      'Demo narrative: show the user logging in to Todo0, then show Agent0 accessing Todo0\'s tasks on the user\'s behalf. Open the Okta System Log and show the XAA/ID-JAG token exchange events. Tie each step to a business outcome: "This is the audit trail your compliance team needs."',
    ],
  },
  {
    heading: 'MCP Adapter Demo (Docker Bundle)',
    paragraphs: [
      'The MCP Adapter Docker bundle (okta-mcp-aws-0.12.1.tar.gz) deploys the full 5-service stack: Gateway, PostgreSQL, Redis, Admin UI, and Grafana observability. Deploy on AWS EC2 with ALB+HTTPS for a customer-facing POC. For internal demos, run locally with Docker Compose.',
      '>> Quick start: (1) Unpack the bundle, (2) Configure .env with Okta org URL, client credentials, and backend MCP server URLs, (3) docker compose up, (4) Open Admin UI at localhost:3001 — show agent registration, resource configuration, audit log, (5) Connect Claude Desktop or VS Code to the Adapter endpoint, (6) Make tool calls and show the audit trail in real-time.',
      '!! The Admin UI at port 3001 is the demo centerpiece for the MCP Adapter. It shows: registered agents with their resource ACLs, configured backends with auth methods, and a searchable audit log of every tool call. This is what makes the demo tangible — customers can see the governance layer, not just hear about it.',
    ],
  },
  {
    heading: 'Pre-Call Checklist',
    paragraphs: [
      '>> Before every demo: (1) Verify your Okta org has XAA enabled (Settings > Features > EA), (2) Confirm xaa.dev is accessible, (3) If using Agent0/Todo0: run the bootstrap, start the apps, verify the login flow works end-to-end, (4) If using MCP Adapter: confirm Docker is running, Admin UI is accessible, at least one backend MCP server is configured and responding, (5) Open the System Log in a browser tab — you\'ll reference it during the demo.',
      '>> Common failure modes and fixes: Token endpoint misconfiguration — re-run bootstrap, Scope mismatch — check custom auth server scopes match the app configuration, Docker port conflict — check nothing else is using 3001/8000, XAA feature flag not enabled — the catalog entries won\'t appear, RSA key mismatch — regenerate via bootstrap script.',
      'TT "Never wing an O4AA demo. Auth flow demos fail unpredictably when setup is approximate. Run through the full flow yourself the morning of the call. If anything breaks, you have time to fix it."',
      'Budget 30 minutes of pre-call setup time for the first demo with a new org. Subsequent demos with the same org take 5 minutes to verify.',
    ],
  },
];

export const content: SectionContent = { slug, title, description, tags, icon, hasDiagram, diagramPrompt, cards };
