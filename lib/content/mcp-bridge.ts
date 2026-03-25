import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'mcp-bridge',
  title: 'MCP Bridge',
  description:
    'How the MCP Adapter handles transport, client discovery, and the BFF pattern — connecting AI agents to backend MCP servers via Streamable HTTP with Okta identity brokering.',
  tags: ['products', 'MCP', 'Transport', 'Streamable-HTTP', 'BFF'],
  icon: '🌉',
  hasDiagram: true,
  diagramPrompt:
    'Network architecture diagram: AI agents on left (Claude Code, Cursor, Copilot), connecting via Streamable HTTP to a central gateway. The gateway shows BFF pattern: intercepts OAuth discovery, proxies tokens, stores refresh tokens. On right: multiple backend MCP servers. Blue and white palette, clean professional technical style.',
  cards: [
    {
      heading: 'Transport: Streamable HTTP',
      paragraphs: [
        'The MCP Adapter handles transport at Layer 1 of its 7-layer pipeline using Streamable HTTP — the current MCP spec transport for remote servers (replacing the deprecated HTTP+SSE transport from 2024). Streamable HTTP uses a single endpoint that accepts HTTP POST for client-to-server messages and HTTP GET for server-to-client SSE streaming. Sessions are tracked via the Mcp-Session-Id header.',
        'From the MCP client\'s perspective (Claude Code, Cursor, etc.), the Adapter looks like a standard MCP server endpoint. The client connects to the Adapter\'s URL, performs OAuth discovery via the .well-known/oauth-protected-resource endpoint, authenticates, and then makes tool calls as normal JSON-RPC over HTTP POST. The Adapter transparently routes each call through the 7-layer pipeline to the correct backend MCP server.',
        'The key architectural insight is that the Adapter is NOT a separate component from the transport — it IS the transport endpoint for MCP clients. Clients connect to the Adapter, not to individual backend MCP servers. This gives the Adapter full control over every message: authentication, authorization, routing, token exchange, caching, and audit all happen inline before any message reaches a backend.',
      ],
    },
    {
      heading: 'The BFF Pattern: OAuth Proxy',
      paragraphs: [
        'The Adapter operates as a Backend-for-Frontend (BFF) OAuth proxy. MCP clients never communicate directly with Okta. This is critical because third-party AI agents (Claude Code, Cursor, Copilot) do not integrate with enterprise IdPs — they have no mechanism to participate in Okta XAA flows natively. The Adapter bridges this gap by acting as the OAuth intermediary.',
        '!! When an MCP client initiates OAuth discovery, the Adapter intercepts the .well-known/oauth-protected-resource response and rewrites it to point at itself as both the authorization server and the token endpoint. The client authenticates through the Adapter, which proxies the flow to Okta. The Adapter rewrites access_token = id_token in the response (the id_token is what the Adapter needs for downstream ID-JAG exchange). Refresh tokens are stored server-side in the UserTokenStore — the MCP client only ever holds an id_token. This minimizes credential exposure: if a client is compromised, the attacker gets a short-lived id_token, not a refresh_token or any downstream access tokens.',
        'TT For SE conversations: the BFF pattern is the answer to "how do we get Okta auth into Claude Code / Cursor / Copilot without those vendors integrating with Okta?" The Adapter handles it transparently — no changes required from the AI agent vendor.',
      ],
    },
    {
      heading: 'Client Registration Strategies',
      paragraphs: [
        'The Adapter supports a 4-strategy priority chain for client registration, which determines how an MCP client is identified and authorized. Priority 1 — Pre-Registration: the admin imports an agent from Okta via the Admin UI. The agent record maps directly to an Okta OIDC app with its client credentials. This is the highest-trust method and is recommended for known enterprise agents.',
        'Priority 2 — CIMD (Client ID Metadata Documents): the MCP client presents a URL-based client_id per the MCP spec. The Adapter fetches the metadata document (with SSRF protections: 5s timeout, 50KB max), validates the schema and trust policy, matches to an imported agent via the client registry, and proxies OAuth using that agent\'s Okta credentials. Priority 3 — DCR (Dynamic Client Registration, RFC 7591): new, unknown MCP clients register dynamically. The Adapter presents an agent selection page where the admin links the new client to an existing imported agent, inheriting that agent\'s Okta app credentials and resource ACLs.',
        '>> Priority 4 — Fallback: if no registration strategy matches, the Adapter returns 401 with WWW-Authenticate and a resource_metadata URI pointing back to itself. This allows the client to retry the OAuth discovery flow. For SEs: the registration priority chain is important because it shows the Adapter works with the full range of MCP clients — from pre-registered enterprise agents (Priority 1) to completely unknown agents that show up via DCR (Priority 3). The admin always maintains control over which agents can access which resources.',
      ],
    },
    {
      heading: 'Deployment and Observability',
      paragraphs: [
        'The Adapter deploys as a Docker bundle with 5 services: the Gateway (FastAPI on port 8000), PostgreSQL (config, agents, audit log — all credentials AES-256-GCM encrypted at rest), Redis (token cache with two-tier L1 memory + L2 Redis, session cache, pub/sub event bus), the Admin UI (Next.js on port 3001 for agent management, resource configuration, and audit log viewing), and an observability stack (Grafana + Loki + Promtail on port 3000).',
        'Current deployment target is AWS EC2 with ALB + HTTPS. The demo package (okta-mcp-aws-0.12.1.tar.gz) includes everything needed for a standalone deployment. Observability is built in: the Adapter emits 50+ structured audit event types covering authentication, authorization, token exchange, routing, and proxy operations. Every tool call generates an audit event with: agent identity, user identity, target resource, tool name, auth method used, token exchange result, and response status.',
        'For demo/POC environments: the Admin UI at port 3001 provides a web interface for managing agents (import from Okta, view resource access), configuring backend resources (set auth method, connection details), viewing the audit log (searchable, filterable), and managing client registrations. This is the primary interface for showing customers how the Adapter works in practice.',
      ],
    },
  ],
};
