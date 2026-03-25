import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'mcp-adapter',
  title: 'Agent Gateway & Okta MCP Server',
  description:
    'The Okta Agent Gateway is a self-hosted OAuth 2.1 authorization gateway for MCP — a 7-layer proxy pipeline that brokers token exchange between AI agents and backend MCP servers, with 8 auth methods, per-agent ACLs, and full audit trail.',
  tags: ['products', 'MCP', 'ProServ', 'architecture', 'GA'],
  icon: '🔌',
  hasDiagram: true,
  diagramPrompt:
    'Technical architecture diagram: MCP clients on left (Claude Code, Cursor, Copilot), a central gateway box labeled Adapter with 7 numbered internal layers (Transport, Auth, Authz, Routing, Token Exchange, Cache, Proxy), and backend MCP servers on right (HR, Finance, GitHub, Vault). Arrows flow left to right through the gateway. Clean professional style, blue and white palette.',
  cards: [
    {
      heading: 'What the Agent Gateway Actually Is',
      paragraphs: [
        'The Okta Agent Gateway (GA April 30, 2026) is a self-hosted OAuth 2.1 authorization gateway that sits between AI coding agents (Claude Code, Cursor, GitHub Copilot, Glean, Devin) and backend MCP servers. It solves a specific problem: third-party AI agents cannot participate in Okta Cross App Access (XAA) flows because they do not integrate with enterprise IdPs. They bypass the enterprise identity layer entirely. The Agent Gateway intercepts this gap — it authenticates agents via Okta, brokers token exchange with backend resource servers, enforces per-agent access control lists, and logs every tool call as a structured audit event.',
        '!! The core value proposition in one sentence: "Login once via Okta, call many backend MCP servers — with per-agent access control, cross-app token exchange, and full audit trail." The Agent Gateway transforms a fragmented multi-credential problem (each agent needs separate credentials for each backend) into a single SSO flow through Okta.',
        'The Agent Gateway is a Python/FastAPI application packaged as a Docker bundle. It consists of 5 services: the Gateway (port 8000), PostgreSQL (config, agents, audit log — AES-256-GCM encrypted credentials), Redis (token cache, session cache, pub/sub event bus), an Admin UI (Next.js on port 3001), and an observability stack (Grafana + Loki + Promtail on port 3000). It deploys on AWS EC2 with ALB + HTTPS. The current demo package is okta-mcp-aws-0.12.1.',
      ],
    },
    {
      heading: 'The 7-Layer Proxy Pipeline',
      paragraphs: [
        'Every MCP request passes through a deterministic 7-layer pipeline. Each layer has a single responsibility and can be independently tested. This is the core architecture — understanding it is essential for SE conversations about how the Agent Gateway works.',
        'Layer 1 — Transport: handles Streamable HTTP and MCP JSON-RPC dispatch. Accepts POST requests to the unified handler and routes based on path. Layer 2 — Authentication: validates the agent\'s JWT against Okta JWKS. Supports Client ID Metadata Documents (CIMD) for token lookup via Confidential Relay, and resolves the client through the registry (pre-registered, CIMD, or DCR). Layer 3 — Authorization: resolves the agent identity from the X-MCP-Agent header (or falls back to token aud/cid), then enforces the agent\'s resource_access ACL — the list of backend resources this specific agent is permitted to call.',
        '>> Layer 4 — Routing: parses the tool namespace ({resource}__{tool}) to determine which backend MCP server handles this call. Resolves the resource config from the ResourceStore (merging database config with OktaConnectionSyncer data). Layer 5 — Token Exchange: the ResourceTokenResolver dispatches to one of 8 authentication methods based on the resource\'s configured auth_method. This is where the Agent Gateway obtains the correct outbound credential for the backend.',
        'Layer 6 — Cache: two-tier caching (L1 memory with 30s TTL, L2 Redis with configurable TTL). Cache key is user_id:resource_name. Implements 60-second early refresh to avoid token expiry mid-call. Layer 7 — Proxy: injects the obtained credentials into the outbound request, forwards the JSON-RPC call to the backend MCP server via httpx async, parses SSE responses, handles 401 retry with cache invalidation, and manages MCP session state.',
      ],
    },
    {
      heading: '8 Authentication Methods',
      paragraphs: [
        'The ResourceTokenResolver at Layer 5 is the single entry point for obtaining auth headers for any backend resource. It dispatches to one of 8 methods based on the resource\'s configured auth_method. This is where the Agent Gateway\'s flexibility comes from — it can broker access to XAA-protected resources, Okta STS-brokered ISV apps, Okta Privileged Access vault secrets, and legacy systems with basic auth, all through the same pipeline.',
        'okta-cross-app: the primary method. Uses ID-JAG (RFC 8693 + RFC 7523) via the Okta SDK CrossAppAccessFlow. The Agent Gateway builds a private_key_jwt client assertion, exchanges it at the Okta token endpoint for an ID-JAG assertion, then presents the assertion to the target authorization server for a scoped access token. Agent private keys are stored AES-256-GCM encrypted in PostgreSQL. okta-sts: RFC 8693 token exchange via the Okta ORG authorization server with brokered user consent — designed for ISV app integrations where the user must explicitly consent before the agent can access their data.',
        'vault-secret: RFC 8693 with a special requested_token_type (urn:okta:...:vaulted-secret) that retrieves secrets from Okta Privileged Access (OPA). The Agent Gateway injects the retrieved secret as a Bearer token or X-API-Key header. sts-service-account: same OPA vault flow but returns username/password for systems requiring HTTP Basic Auth. pre-shared-key: static API key stored encrypted in the resource config, injected as an X-API-Key header. service-account: HTTP Basic Auth with encrypted username/password. bearer-passthrough: forwards the user\'s BFF-captured id_token directly to the backend (for resources that trust the Okta id_token natively).',
        'TT For SEs: the 8-method architecture is the key differentiator in conversations about heterogeneous backend environments. Customers rarely have all-OAuth backends. They have a mix of XAA-capable services, legacy APIs with API keys, vault-managed secrets, and ISV SaaS apps requiring user consent. The Agent Gateway handles all of these through a single gateway — the agent authenticates once, and the Gateway translates that identity into whatever credential each backend needs.',
      ],
    },
    {
      heading: 'BFF Pattern and Client Registration',
      paragraphs: [
        'The Agent Gateway operates as a Backend-for-Frontend (BFF) OAuth proxy. MCP clients never talk directly to Okta. The Gateway intercepts the OAuth discovery endpoint (.well-known/oauth-protected-resource) and the token endpoint, rewrites access_token = id_token for downstream ID-JAG exchange, and stores refresh_tokens server-side in the UserTokenStore. This means the MCP client (Claude Code, Cursor, etc.) only ever holds an id_token — never a refresh_token or a downstream access_token. Credential exposure risk is minimized.',
        'Client registration follows a 4-strategy priority chain. Priority 1 — Pre-Registration: the admin imports an agent from Okta via the Admin UI. The agent record maps to an Okta OIDC app. Priority 2 — CIMD (Client ID Metadata Documents): the MCP client presents a URL-based client_id, the Gateway fetches the metadata (SSRF-safe, 5s timeout, 50KB max), validates the schema and trust policy, matches to an imported agent via the client registry, and proxies OAuth using per-agent Okta credentials. Priority 3 — DCR (Dynamic Client Registration, RFC 7591): new MCP clients register dynamically. The admin links the DCR client to an existing imported agent via an agent selection page, inheriting that agent\'s Okta app credentials. Priority 4 — Fallback: 401 with WWW-Authenticate + resource_metadata URI.',
        'The Dual Identity Plane is the architectural key: the Agent Gateway is simultaneously an OAuth Authorization Server (to inbound MCP clients) and an OAuth Client (to outbound backends). The Client Registry resolves inbound identity. The ResourceTokenResolver + outbound auth handlers resolve outbound credentials. This separation means adding a new backend auth method doesn\'t affect how clients authenticate, and adding a new client registration strategy doesn\'t affect how backends are accessed.',
      ],
    },
    {
      heading: 'Okta MCP Server (Tenant Management)',
      paragraphs: [
        'Distinct from the Agent Gateway, the Okta MCP Server (github.com/okta/okta-mcp-server, Apache 2.0) is a shipped, open-source MCP server that exposes Okta Admin Management APIs to LLMs. It lets AI agents manage the Okta tenant itself — create users, manage groups, pull system logs, manage applications and policies — via natural language through Claude Desktop, VS Code, or any MCP-compatible client.',
        'Auth supports two modes: Device Authorization Grant (interactive, browser login) and Private Key JWT (headless, RSA 2048-bit key pair). For destructive operations the server implements the MCP Elicitation API — clients with MCP SDK >= 1.26 get a confirmation dialog; older clients get a JSON payload for the LLM to relay. Docker quick start: docker run -i --rm -e OKTA_ORG_URL="https://your-org.okta.com" -e OKTA_CLIENT_ID="your-id" -e OKTA_SCOPES="okta.users.read okta.groups.read" okta-mcp-server.',
        'SE positioning: "Okta MCP Server" answers "I want AI to manage my Okta tenant." "Agent Gateway" answers "I want to secure the MCP tool calls my agents make to any backend API." Know the difference — they serve completely different use cases and audiences.',
      ],
    },
  ],
};
