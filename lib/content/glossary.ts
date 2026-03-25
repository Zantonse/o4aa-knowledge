import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'glossary',
  title: 'Glossary',
  description:
    'Definitions for the key terms, protocols, and concepts used across the O4AA Knowledge Hub — organized by category for quick reference.',
  tags: ['reference', 'definitions', 'protocols', 'concepts', 'se-enablement'],
  icon: '📖',
  hasDiagram: false,
  diagramPrompt: '',
  cards: [
    {
      heading: 'Protocol Terms',
      paragraphs: [
        'MCP (Model Context Protocol): An open standard for AI agents to discover and call tools. Defines how an AI client connects to an MCP server, enumerates available tools, and invokes them. Transports include STDIO (local, no auth) and Streamable HTTP (remote, optional OAuth 2.1). Auth is deliberately optional in the spec.',
        'OAuth 2.0 Token Exchange (RFC 8693): A standard grant type that allows a client to exchange one token for another — used by Okta to implement On-Behalf-Of delegation. The exchanged token carries the user\'s identity (sub claim) and the service app\'s client ID (cid claim). Note: Okta\'s implementation does not emit the RFC 8693 act (actor) claim as a structured JWT claim.',
        'On-Behalf-Of (OBO): The pattern in which an AI agent obtains a token to act on behalf of a specific user, rather than acting as itself. Implemented via RFC 8693 token exchange in Okta. GA in Okta Workforce Identity Cloud.',
        'ID-JAG (Identity Assertion JWT Authorization Grant): An adopted IETF OAuth Working Group draft (draft-ietf-oauth-identity-assertion-authz-grant-02). The token type used by Cross App Access (XAA). A short-lived JWT signed by Okta that asserts a user\'s identity and that a requesting app has been trusted by the enterprise. System Log event app.oauth2.token.grant.id_jag is EA in Preview since August 2025.',
        '!! Cross App Access (XAA): Okta\'s protocol for enterprise-governed agent-to-app and app-to-app access. Replaces scattered integrations with centralized IT admin control over which apps connect and what they can access. Self-service Early Access. Test at xaa.dev.',
      ],
    },
    {
      heading: 'Okta Product Terms',
      paragraphs: [
        'O4AA (Okta for AI Agents): The umbrella term for Okta\'s identity capabilities designed for AI and agentic systems — including XAA, OBO Token Exchange, Auth0 FGA, Token Vault, and the Okta MCP Server.',
        'Auth0 Fine Grained Authorization (FGA): Relationship-based access control, branded under Auth0 (not Okta WIC). Managed service at dashboard.fga.dev. Built on OpenFGA (CNCF incubating). Answers "does THIS agent have permission to access THIS specific resource on behalf of THIS user?"',
        'Token Vault: Okta\'s secure credential storage and lifecycle management for agent tokens. Centralizes third-party OAuth tokens and API keys — agents hold reference pointers, not raw credentials. Handles refresh, rotation, and revocation. A capability within O4AA, not a separately named SKU.',
        'Okta MCP Server: An open-source MCP server (github.com/okta/okta-mcp-server) that exposes Okta Admin Management APIs to LLMs. Enables AI agents to manage the Okta tenant via natural language (user/group management, system logs, policies). Shipped and GA.',
        'MCP Adapter: An upcoming Okta capability to serve as the external OAuth authorization server for MCP tool calls — filling the auth gap in the MCP protocol. Not yet shipped. For current agent-to-app auth, use XAA + OBO Token Exchange.',
      ],
    },
    {
      heading: 'Security Concepts',
      paragraphs: [
        'Confused Deputy: A security vulnerability in which a trusted intermediary (like an AI agent) is manipulated into misusing its privileges on behalf of an attacker. The MCP spec explicitly prohibits token passthrough (forwarding client tokens to upstream APIs) to prevent this. Mitigated by minimal-scope tokens and Auth0 FGA.',
        'Minimal Privilege: The principle that every entity (including AI agents) should have only the permissions needed for the current task — not blanket permissions for all possible tasks. In agentic systems, this means per-call token narrowing via RFC 8693 Token Exchange.',
        'Workload Identity: The identity of a non-human service or agent — distinct from user identity. Workload identities authenticate as themselves; Okta extends this with OBO to allow workloads to also act on behalf of users.',
        'Principal Hierarchy: The chain of entities involved in an agentic transaction — typically Human User → Orchestrator Agent → Sub-Agent → Tool. Each level in the hierarchy must have appropriate authorization, and no level can exceed what the level above it was authorized to do.',
      ],
    },
    {
      heading: 'Agent Architecture Concepts',
      paragraphs: [
        'Agentic Workflow: A multi-step automated process in which an AI agent reasons, plans, and takes actions across multiple systems to accomplish a goal — rather than responding to a single request.',
        'Tool Call (Function Calling): The mechanism by which an AI agent invokes an external capability — a search API, a database, a calendar service. Each tool call is a real API request that requires authorization.',
        'Orchestrator Agent: An AI agent responsible for decomposing a high-level goal into subtasks and coordinating specialized sub-agents to execute them. The orchestrator holds the user\'s delegation and issues further delegations to sub-agents.',
        'Sub-Agent: A specialized AI agent that executes a specific class of tasks (e.g., web search, code execution, email). Receives delegated authorization from an orchestrator — scoped to its specific capabilities.',
        'Stateless Authorization: The principle that each API call is independently authorized against current credentials, rather than relying on session state from a previous step. Enables per-call auditing and honors revocations immediately.',
      ],
    },
  ],
};
