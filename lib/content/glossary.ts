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
        'MCP (Model Context Protocol): An open standard for AI agents to discover and call tools. Defines how an AI client connects to an MCP server, enumerates available tools, and invokes them via a structured protocol over HTTP/SSE.',
        'OAuth 2.0 Token Exchange (RFC 8693): A standard grant type that allows a client to exchange one token for another — used by Okta to implement On-Behalf-Of delegation. The exchanged token carries both the original user\'s identity and the agent\'s identity.',
        'On-Behalf-Of (OBO): The pattern in which an AI agent obtains a token scoped to act on behalf of a specific user, rather than acting as itself. Implemented via RFC 8693 token exchange in Okta.',
        'ID-JAG (Identity for Agents and Governance): An emerging standard for structured agent identity assertions in tokens. Adds provenance chain, principal type, and agent attribution to standard OAuth tokens — enabling APIs to distinguish agent actions from human actions.',
      ],
    },
    {
      heading: 'Okta Product Terms',
      paragraphs: [
        'Auth for GenAI: Okta\'s suite of identity capabilities designed specifically for AI and generative AI systems — including OBO token exchange, FGA, token vault, and MCP Adapter.',
        'Fine Grained Authorization (FGA): Okta\'s relationship-based access control system. Unlike RBAC (which answers "what role does this user have?"), FGA answers "does THIS agent have permission to access THIS specific resource on behalf of THIS user?"',
        'Token Vault: Okta\'s secure credential storage and lifecycle management for agent tokens. Prevents long-lived tokens from sitting in agent memory — instead, tokens are requested on demand, used, and expired.',
        'Scoped Token: A short-lived access token issued for a specific tool call, with the minimum permissions needed for that call. Issued just-in-time via Token Exchange — not stored or reused across calls.',
        'MCP Adapter: Okta\'s authentication layer for MCP tool calls. Intercepts calls between an MCP client and MCP server, validates the agent and user delegation, and enforces FGA before forwarding to the protected API.',
      ],
    },
    {
      heading: 'Security Concepts',
      paragraphs: [
        'Confused Deputy: A security vulnerability in which a trusted intermediary (like an AI agent) is manipulated into misusing its privileges on behalf of an attacker. Mitigated by minimal-scope tokens and FGA.',
        'Minimal Privilege: The principle that every entity (including AI agents) should have only the permissions needed for the current task — not blanket permissions for all possible tasks. In agentic systems, this means per-call scoped tokens.',
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
