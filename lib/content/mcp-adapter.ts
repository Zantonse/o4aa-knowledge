import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'mcp-adapter',
  title: 'MCP Adapter',
  description:
    'How Okta\'s MCP Adapter injects enterprise authentication into Model Context Protocol tool calls — every agent action authorized, scoped, and logged.',
  tags: ['products', 'MCP', 'Upcoming', 'auth-flows'],
  icon: '🔌',
  hasDiagram: true,
  diagramPrompt:
    'Horizontal flow diagram (left to right): AI Agent box → MCP Client box → [Okta MCP Adapter box, highlighted with amber border, centered] → MCP Server box → Protected API box. Downward arrows from Okta MCP Adapter to: "Scoped Token" label, "FGA Decision" label, "Audit Log" label. Warm cream background, flat technical style, amber accent on Okta box.',
  cards: [
    {
      heading: 'What is the MCP Adapter?',
      paragraphs: [
        'Model Context Protocol (MCP) is the emerging open standard for how AI agents discover and invoke tools — external APIs, data sources, code executors, and other capabilities. MCP defines the wire protocol: how a client sends tool call requests, how servers advertise available tools, and how results are returned. What MCP does not define is authentication. The protocol is deliberately auth-agnostic, which means every organization deploying MCP-based agents faces the same question: who gets to call these tools, on whose behalf, and with what permissions?',
        'Okta\'s MCP Adapter is the authentication and authorization layer that plugs into this gap. It sits between the MCP client (the agent\'s tool-calling framework) and the MCP server (the service exposing tools), intercepting every tool call before it reaches a protected API. The Adapter validates the agent\'s identity, verifies the user delegation chain, consults FGA for per-resource access decisions, and issues a minimally scoped token for that specific call. Without the Adapter, MCP tool calls carry no enterprise-grade auth; with it, every tool call is a fully authorized, auditable event tied to a specific user and agent identity.',
        'The significance is architectural, not just operational. Organizations evaluating MCP for enterprise use consistently hit the auth wall: "MCP is great for demos, but we cannot put it in production without knowing who is calling and what they are authorized to do." The MCP Adapter is Okta\'s answer to that production readiness requirement. It means an organization can adopt MCP as a standard without building custom auth middleware for every tool server they expose — Okta handles the identity layer centrally, with the same consistency and auditability as any other Okta-protected resource.',
      ],
    },
    {
      heading: 'Auth Flow: Agent to MCP Adapter to Protected API',
      paragraphs: [
        'The flow begins when an AI agent, through its MCP client library, decides to call a tool. The tool call request is a structured message specifying the tool name, the input parameters, and the context of the calling agent. This request does not go directly to the MCP server that hosts the tool. It first arrives at the Okta MCP Adapter.',
        'The MCP Adapter performs a multi-step authorization evaluation before forwarding anything. First, it validates the agent\'s identity — confirming the agent is a known, registered principal with a valid credential. Second, it checks the delegation chain: is there an active user delegation authorizing this agent to act? What scope was that delegation granted? Third, it submits the tool call context to FGA for a per-resource decision — not just "can this agent call this tool" but "can this agent, for this user, access the specific resource this tool call will touch?" Only if all three checks pass does the Adapter proceed.',
        'Once the authorization checks clear, the Adapter mints a scoped token for this specific tool call. The token carries the minimum permissions required for that one operation and is short-lived — it has no value outside the immediate call. The Adapter forwards the original tool call to the MCP server with this scoped token attached. The MCP server executes the tool, calls the protected API using the scoped token, and returns the result through the Adapter back to the agent. Every step of this — the authorization evaluation, the token issuance, the tool execution — is logged to Okta\'s audit infrastructure, creating a per-call chain of custody.',
        'The result is that the agent experiences a seamless tool call: it asked for a capability and got a result. But behind that simplicity is a full enterprise authorization model applied to every individual interaction. The protected API on the receiving end sees a properly scoped, cryptographically valid token — not an overly broad service account credential or a long-lived user token cached from a session that started hours ago.',
      ],
    },
    {
      heading: 'SE Positioning',
      paragraphs: [
        'The MCP Adapter is a strong conversation-opener for any account that has mentioned MCP, is evaluating agent frameworks like LangChain, CrewAI, or Claude\'s tool use, or has developers already building tool-calling workflows. The core message is simple: MCP is becoming the standard for agent tool use, but it ships without auth. Any organization deploying MCP at enterprise scale will need to solve auth — either by rolling their own middleware for every tool server, or by using Okta\'s MCP Adapter to handle it once, centrally, with full enterprise identity compliance. The "build your own" path is the same trap organizations fell into with custom SSO before Okta: it works until it doesn\'t, and then it becomes a security incident.',
        'The MCP Adapter is currently in development (upcoming), which makes it ideal for roadmap conversations rather than near-term close deals. The goal in the current selling moment is to plant the flag: "When you are ready to put MCP in production, Okta is the only enterprise identity platform that has a native auth layer for it." This positions Okta ahead of when the customer hits the production readiness wall, rather than reactively when they are already mid-build on a custom auth solution. Ask about timeline, current MCP usage, and what their plan is for auth — and document the answer as a return motion.',
        'The most common objection is "we can handle auth ourselves." The response is not to argue that they cannot, but to probe what "handle it ourselves" means at scale: one tool server is manageable, but what about twenty? What about when the agent needs to respect per-user data permissions at the record level, not just API-level access? What happens when an agent is deprecated and you need to revoke its access to twenty tool servers simultaneously? FGA integration, per-call audit logging, and centralized credential rotation are the capabilities that make self-built auth impractical at enterprise scale — and those are exactly the capabilities the MCP Adapter delivers through Okta\'s existing identity infrastructure.',
      ],
    },
  ],
};
