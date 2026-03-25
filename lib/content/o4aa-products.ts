import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'o4aa-products',
  title: 'O4AA Product Suite',
  description:
    'Cross App Access (XAA), Auth0 Fine Grained Authorization, Privileged Credential Management, and the Okta MCP Server: the components of Okta for AI Agents and how they secure agentic systems.',
  tags: ['products', 'XAA', 'Auth0-FGA', 'privileged-credential-management'],
  icon: '🔐',
  hasDiagram: true,
  diagramPrompt:
    'Product architecture diagram: four interconnected component boxes labeled Cross App Access, Authorization, Privileged Credential Management, and MCP Server. AI Agent above, Protected APIs below. Amber/cream palette, flat technical illustration, clean white background.',
  cards: [
    {
      heading: 'The O4AA Product Suite',
      paragraphs: [
        'Okta for AI Agents (O4AA) is a set of integrated identity capabilities that address the authentication and authorization challenges unique to agentic AI systems. The core components are: Cross App Access (XAA) for agent-to-app delegation, Auth0 Fine Grained Authorization (FGA) for per-resource access decisions, Privileged Credential Management for secure credential storage and lifecycle management, and the Okta MCP Server for managing the Okta tenant via AI agents. Each solves a distinct problem — but together they form a coherent identity layer for production agent deployments.',
        '!! Cross App Access (XAA) is the foundation. It is a new protocol developed by Okta (and standardized via the IETF as the Identity Assertion JWT Authorization Grant, or ID-JAG) that enables secure, enterprise-governed communication between applications — including AI agents. XAA replaces ad-hoc integration patterns (shared service accounts, raw token forwarding) with a standards-based delegation model where enterprise IT admins control which apps can connect and what they can access. XAA is currently in self-service Early Access — enable it in Admin Console > Settings > Features > Early Access.',
        'Auth0 Fine Grained Authorization (FGA) adds relationship-based access control. Built on the open-source OpenFGA engine (a CNCF incubating project), Auth0 FGA answers "does THIS agent have permission to access THIS specific resource on behalf of THIS user?" — a fundamentally richer question than role-based access control. The managed service is accessed at dashboard.fga.dev with an Auth0 account. Note: Auth0 FGA is branded under Auth0, not Okta Workforce Identity Cloud. SEs selling into WIC-only accounts should understand that FGA requires the Auth0/OCI product surface.',
        'Privileged Credential Management (GA April 30, 2026) and scoped token issuance close the credential security loop. Credential Management is a secure, centralized store for third-party credentials and refresh tokens that agents need during task execution — moving credentials out of agent memory and into Okta-managed infrastructure. Scoped token issuance (via RFC 8693 Token Exchange) mints short-lived, minimally-permissioned tokens for each tool call. Note: Privileged Credential Management and "Scoped Tokens" are capability descriptions, not named SKUs — they refer to the credential management and token narrowing mechanisms within the broader O4AA platform.',
      ],
    },
    {
      heading: 'Auth0 Fine Grained Authorization (FGA)',
      paragraphs: [
        'Auth0 FGA is relationship-based access control: it models permissions not as flat role assignments but as a graph of relationships between users, resources, groups, and actions. Where RBAC asks "does this user have the editor role?", FGA asks "does this user have edit access to this specific document, given the current state of all ownership, sharing, and team membership relationships?" The distinction matters because agents routinely need to access user-specific resources — particular files, specific records, individual calendar entries — not just broad resource categories.',
        'For agentic systems, FGA adds a critical second dimension to every access decision: the agent\'s authority within the delegation chain. A user can grant an orchestrator agent the right to read their project files, but the FGA model enforces that this grant does not extend to payroll files in the same system, even if the user\'s own access to payroll is not restricted. This is particularly important for RAG-based agent systems where the agent queries a document store — FGA filters retrieved documents to only those the specific user is authorized to see, preventing data leakage across users even if the agent\'s search query is broad.',
        '>> Auth0 FGA is a managed service accessed at dashboard.fga.dev. The API endpoint is api.[region].fga.dev. It uses the OpenFGA model language (same SDK for open-source self-hosted and Auth0-hosted versions). A reference implementation of FGA with a Google Drive-style file sharing model is available at oktadev/fga-drive-example. For SE positioning: FGA is the answer to "how do you prevent an agent from accessing more data than the user intended?" It operationalizes least-privilege at the resource level, not just the scope level.',
      ],
    },
    {
      heading: 'Cross App Access (XAA) — How It Works',
      paragraphs: [
        'Cross App Access defines a three-party trust model: the enterprise IdP (Okta), the requesting application (the AI agent), and the resource application (the API the agent needs to call). The enterprise IT admin creates a "managed connection" in Okta between the requesting and resource apps — this is the governance control that traditional OAuth consent flows lack. The admin decides which apps can connect, what scopes are permitted, and what policies apply.',
        'The technical flow uses the Identity Assertion JWT Authorization Grant (ID-JAG): (1) the requesting app authenticates to Okta via Client Credentials, (2) Okta issues an Identity Assertion JWT — a short-lived, signed assertion that the requesting app has been trusted by the enterprise and that a specific user has authorized the interaction, (3) the requesting app presents this ID-JAG to the resource app\'s authorization server using the JWT Bearer grant type (RFC 7523), (4) the resource app validates the assertion against Okta\'s JWKS endpoint and issues a scoped access token. The resource app never needs to trust the requesting app directly — it trusts Okta, and Okta vouches for the requesting app.',
        '!! For demos and POCs: xaa.dev is a free browser-based playground where anyone can test the XAA flow without local setup. For a full local demo, the oktadev/okta-secure-ai-agent-example repository includes a bootstrap script (pnpm run bootstrap:okta) that automatically creates all required Okta resources: custom authorization server, scopes, OIDC apps, agent identity with RSA keys, and access policies. The demo uses an AI agent (Agent0) accessing a todo app (Todo0) to show the end-to-end XAA flow.',
      ],
    },
  ],
};
