import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'o4aa-products',
  title: 'O4AA Product Suite',
  description:
    'Auth for GenAI, Fine Grained Authorization, Token Vault, and Scoped Tokens: the four components of Okta for AI Agents and how they work together to secure agentic systems.',
  tags: ['products', 'o4aa', 'fga', 'token-vault'],
  icon: '🔐',
  hasDiagram: true,
  diagramPrompt:
    'Product architecture diagram: "O4AA Suite" label at top. Four interconnected component boxes: Auth for GenAI (top-left), Fine Grained Authorization (top-right), Token Vault (bottom-left), Scoped Tokens (bottom-right). AI Agent above the suite, Protected APIs below. Amber/cream palette, flat technical illustration, clean white background.',
  cards: [
    {
      heading: 'The O4AA Product Suite',
      paragraphs: [
        'Okta for AI Agents (O4AA) is a purpose-built product suite that addresses the identity and authorization challenges unique to agentic AI systems. It is composed of four integrated components: Auth for GenAI, Fine Grained Authorization (FGA), Token Vault, and Scoped Tokens. Each component solves a distinct problem that arises when autonomous agents start making API calls on behalf of human users — but the four are designed to work as a unified layer, not as standalone products.',
        'Auth for GenAI is the entry point: it handles how an agent establishes its identity and proves a user has delegated access to it. It implements RFC 8693 OAuth 2.0 Token Exchange so that an agent can hold a token that simultaneously asserts its own machine identity and the human user\'s delegated authority. Every downstream API call the agent makes carries this dual identity claim. Auth for GenAI is the authentication foundation that the rest of the suite sits on top of.',
        'Fine Grained Authorization (FGA) adds the authorization intelligence layer. Once the agent\'s identity is established, FGA answers the question: is this agent, acting for this specific user, allowed to access this specific resource right now? That is a fundamentally richer question than traditional role-based access control can answer. FGA evaluates relationship graphs — who owns the document, what teams have access, what the user\'s current role allows — and makes a per-resource, per-request decision.',
        'Token Vault and Scoped Tokens close the loop on credential security. Token Vault is a secure, centralized store for third-party credentials and refresh tokens that agents need during task execution. Scoped Tokens are short-lived, minimally permissioned tokens issued just-in-time for each individual tool call. Together they eliminate the risk of long-lived credentials sitting in agent memory, and they ensure that even if one token is compromised, the blast radius is limited to exactly one tool call.',
      ],
    },
    {
      heading: 'Fine Grained Authorization (FGA)',
      paragraphs: [
        'Fine Grained Authorization is relationship-based access control: it models permissions not as flat role assignments but as a graph of relationships between users, resources, groups, and actions. Where RBAC asks "does this user have the editor role?", FGA asks "does this user have edit access to this specific document, given the current state of all ownership, sharing, and team membership relationships?" The distinction matters because agents routinely need to access user-specific resources — particular files, specific records, individual calendar entries — not just broad resource categories.',
        'For agentic systems, FGA adds a critical second dimension to every access decision: the agent\'s authority within the delegation chain. A user can grant an orchestrator agent the right to read their project files, but the FGA model enforces that this grant does not extend to payroll files in the same system, even if the user\'s own access to payroll is not restricted. When a sub-agent calls a tool API, FGA evaluates the full context: what resource is being accessed, which user initiated the task, what was explicitly delegated to which agent, and whether that combination satisfies the access policy for that specific resource. No traditional RBAC engine has the data model to perform that evaluation.',
        'From a positioning standpoint, FGA is the answer to "how do you prevent an agent from doing more than the user intended?" It operationalizes least-privilege at the resource level, not just the scope level. A token with a broad scope like "read:documents" may be legitimate for the agent to hold, but FGA intercepts the actual API call and confirms whether that agent, for that user, is allowed to read this document — before any data is returned. This is particularly important for regulated industries where data residency, consent scoping, and audit trails must be defensible at the individual record level.',
      ],
    },
    {
      heading: 'Token Vault and Scoped Tokens',
      paragraphs: [
        'Long-lived credentials stored in agent memory are one of the most underappreciated risks in agentic architectures. An agent working through a multi-step task naturally accumulates tokens — OAuth access tokens, refresh tokens, API keys, third-party service credentials — and often caches them in its context window or an attached memory store to avoid re-authenticating on every step. A prompt injection attack, a logging misconfiguration, or a compromised memory store can expose those cached credentials. Because the token is long-lived and broadly scoped, an attacker who obtains it can make API calls as the agent across its full permission scope until the token expires.',
        'Token Vault addresses this by moving credentials out of agent memory and into a secure, centralized store managed by Okta. Instead of caching a third-party service\'s OAuth token in the agent\'s context, the agent holds only a reference pointer. When it needs to make a call, it presents the reference to Token Vault, which returns the actual credential for that specific call — and only that call. The credential is never fully materialized in the agent\'s context. Token Vault also handles refresh logic, rotation, and revocation centrally: when a credential needs to be revoked or rotated, it happens in one place and takes effect immediately for every agent that references it.',
        'Scoped Tokens are the just-in-time credential mechanism for calls to Okta-protected APIs. Rather than issuing one token at agent initialization that covers everything the agent might ever need, Scoped Tokens are minted fresh for each individual tool call, carrying only the permissions necessary for that call and expiring immediately after. This is the practical implementation of least-privilege for a dynamic agent workflow. If an agent is compromised mid-task, the attacker obtains a token that is already expiring and is scoped only to the tool call in flight — not a persistent key to the agent\'s full authorized scope. For compliance, every Scoped Token issuance is logged, creating a complete, per-call audit trail of what the agent did, as which user, with what explicit authorization.',
      ],
    },
  ],
};
