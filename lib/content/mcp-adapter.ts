import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'mcp-adapter',
  title: 'MCP Adapter & Okta MCP Server',
  description:
    'Two distinct Okta capabilities for MCP: the shipped Okta MCP Server (tenant management via AI), and the upcoming MCP Adapter (enterprise auth layer for agent tool calls).',
  tags: ['products', 'MCP', 'GA', 'Upcoming'],
  icon: '🔌',
  hasDiagram: true,
  diagramPrompt:
    'Simple technical flow diagram: five boxes in a row labeled Agent, Client, Adapter, Server, API. Amber-highlighted center box. Three process labels below the center box: Token, Decision, Log. Warm cream background, flat minimal illustration style.',
  cards: [
    {
      heading: 'Two Products — Know the Difference',
      paragraphs: [
        'Okta has two distinct MCP-related offerings, and SEs must distinguish them in customer conversations. The Okta MCP Server is shipped and open source (github.com/okta/okta-mcp-server, Apache 2.0). It is an MCP server that exposes Okta Admin Management APIs to LLMs — enabling AI agents to manage the Okta tenant itself (create users, manage groups, pull system logs) via natural language through Claude Desktop, VS Code, or any MCP-compatible client. This is a tenant management tool.',
        'The MCP Adapter is a separate, upcoming capability: an enterprise authentication and authorization layer that sits between any MCP client and any MCP server, injecting Okta identity into every tool call. The Adapter is not shipped yet and has no public product page — it is roadmap. Do not promise it as available. When discussing MCP auth for tool calls, position it as the strategic direction and use XAA/OBO Token Exchange as the currently shipping mechanism for securing agent-to-app access.',
        'The distinction matters because prospects asking about "MCP and Okta" may mean either: "I want my AI to manage my Okta tenant" (point them to the Okta MCP Server) or "I want to secure the MCP tool calls my AI agents make to protected APIs" (discuss XAA + OBO for today, MCP Adapter for the roadmap conversation).',
      ],
    },
    {
      heading: 'Okta MCP Server (Shipped)',
      paragraphs: [
        'The Okta MCP Server connects AI agents directly to Okta Admin Management APIs. Available tools include: user management (create, list, retrieve, update, deactivate), group management (create, list, update, delete), group operations (view members, view assigned apps, add/remove users), system information (retrieve system logs), and application and policy management. Complex multi-step operations are possible — an agent can "generate a security audit report for the last 30 days highlighting all user and group membership changes."',
        'Authentication supports two modes. Device Authorization Grant (recommended for interactive use): the agent triggers a browser login, the user authenticates, and the server exchanges the browser session for a secure token. Private Key JWT (recommended for headless/production): uses an RSA 2048-bit key pair with no browser interaction — required for private cloud tenants where Device Auth is not supported. For Docker deployments, device auth token persistence uses the Python keyring library (Docker requires PYTHON_KEYRING_BACKEND=keyrings.alt.file.PlaintextKeyring and a mounted volume).',
        'For destructive operations (deactivating users, deleting groups), the Okta MCP Server implements the MCP Elicitation API. Clients that support elicitation (Claude Desktop with MCP SDK >= 1.26) get an explicit confirmation dialog before the action executes. Older clients receive a JSON payload the LLM can relay as a text confirmation request.',
      ],
    },
    {
      heading: 'MCP Adapter (Upcoming) and the MCP Auth Gap',
      paragraphs: [
        'The MCP protocol (spec version 2025-11-25) is deliberately auth-agnostic. For STDIO transport (used by Claude Desktop, VS Code, Cursor — the majority of current MCP deployments), the spec explicitly says implementations SHOULD NOT use OAuth. Auth relies on environment variables and filesystem-level trust. For Streamable HTTP transport (remote MCP servers), OAuth 2.1 is supported but optional — and the MCP server doubles as its own authorization server by default, creating a circular trust problem.',
        'The auth gap is concrete: once an MCP client authenticates to a server, it can call all tools — there is no tool-level RBAC in the protocol. Tool annotations (descriptions that tell the LLM what a tool does) are explicitly untrusted per the spec. There is no centralized revocation mechanism. The spec also explicitly prohibits forwarding the client token to upstream APIs (the confused deputy problem), but enforcement is left to server implementors.',
        'The upcoming MCP Adapter addresses this by serving as the external authorization server that the MCP spec architecturally separates from the resource server. Using RFC 9728 Protected Resource Metadata, an MCP server can point clients to Okta as the auth server. Okta handles authentication, consent, token issuance, per-tool authorization (via Auth0 FGA), and centralized revocation — filling every gap the spec leaves open. This is the enterprise production readiness layer for MCP. Position it as roadmap today; point to XAA and OBO Token Exchange as the currently shipping mechanisms for agent-to-app auth.',
      ],
    },
  ],
};
