import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'mcp-bridge',
  title: 'MCP Bridge',
  description:
    'The transport layer that connects MCP clients to MCP servers over Server-Sent Events — and where Okta\'s auth checkpoint integrates into the connection lifecycle.',
  tags: ['products', 'MCP', 'Transport', 'Upcoming'],
  icon: '🌉',
  hasDiagram: true,
  diagramPrompt:
    'Network connection diagram: MCP Client (left box) connected to MCP Server (right box) via a horizontal SSE connection line labeled "Persistent SSE Connection". Okta auth checkpoint shown as a vertical gate on the connection line. Below: labeled boxes showing "Tool Discovery", "Tool Execution", "Auth Token" as phases. Warm amber/cream palette, flat technical diagram style.',
  cards: [
    {
      heading: 'MCP Bridge vs. MCP Adapter',
      paragraphs: [
        'MCP Bridge and MCP Adapter serve different layers of the same stack, and conflating them in a customer conversation creates confusion. The clearest framing: the Bridge is the road, the Adapter is the security checkpoint on that road. MCP Bridge is the transport layer — it handles the network protocol mechanics of how an MCP client and an MCP server establish a connection, maintain it, and exchange messages. MCP Adapter is the auth layer — it handles what identity assertions are validated, what authorization decisions are enforced, and what audit events are generated for every message that traverses that connection.',
        'Concretely: MCP Bridge implements the Server-Sent Events (SSE) transport that MCP specifies for HTTP-based tool communication. It manages connection establishment, keepalives, message framing, and the tool discovery handshake. MCP Adapter is a policy enforcement point that intercepts individual tool calls on that connection and applies Okta\'s identity model. A customer deploying both gets a complete solution: reliable, standards-compliant transport plus enterprise authentication on every call. A customer deploying only Bridge gets a working transport without auth enforcement. The Bridge handles "how do they talk"; the Adapter handles "who is allowed to say what."',
      ],
    },
    {
      heading: 'How MCP Bridge Works',
      paragraphs: [
        'The MCP Bridge uses Server-Sent Events as its transport mechanism. SSE is an HTTP-based protocol where the server holds a persistent, unidirectional stream open to the client — the client sends requests via standard HTTP POST, and the server responds via the event stream. This makes SSE well-suited for MCP: agents need to maintain a long-running connection to a tool server, enumerate available tools, and make repeated calls without re-establishing the connection on every invocation. The Bridge manages this connection lifecycle: it initiates the SSE stream, negotiates protocol version, and keeps the connection alive across the duration of an agent\'s task.',
        'Tool discovery is the first meaningful exchange over a Bridge connection. When an agent connects, the MCP server advertises a tool manifest: a structured description of every tool it exposes, including the tool\'s name, description, input schema, and any authentication requirements. The agent\'s framework inspects this manifest and makes it available to the LLM as callable functions. This discovery phase is what allows agents to operate with tools they were not explicitly programmed to use — the manifest at runtime tells the agent what is available. Okta\'s auth checkpoint integrates at this phase: a client presenting an invalid or unauthorized credential is rejected before it ever receives the tool manifest.',
        'Once discovery completes, the connection enters its execution phase. Tool calls flow as HTTP POST requests from the client; results flow back as SSE events. The Bridge handles message correlation — matching responses to the requests that generated them — and manages error states, including reconnection logic if the stream drops. When the Okta MCP Adapter is in the stack, it intercepts each POST before the Bridge routes it to the tool server backend, performing the per-call authorization evaluation. The agent sees a single logical connection to a tool server; behind that abstraction is the full auth enforcement stack operating transparently on every message.',
      ],
    },
    {
      heading: 'Setup and SE Angle',
      paragraphs: [
        'The deployment stack for a customer adopting MCP Bridge with Okta auth has three components: an MCP server that exposes the tools the agent needs (this can be an existing API wrapped with an MCP server library, or a native MCP server), the Okta MCP Bridge handling the SSE transport layer, and Okta auth protecting the connection via the MCP Adapter. The customer\'s AI agent framework connects to the Bridge endpoint as its MCP server URL. From the agent\'s perspective, it is just connecting to an MCP server. The Bridge and Adapter handling happens transparently at the infrastructure layer.',
        'The discovery questions that open this conversation are specific and diagnostic. "Are you evaluating or already using MCP in any of your agent workflows?" surfaces where they are in the adoption curve. "How are you handling authentication for MCP tool calls today?" almost always reveals a gap — either they are not yet in production, they are using static API keys per tool server, or they have something custom that does not scale. "What tools or internal APIs are you planning to expose via MCP?" establishes scope: ten tool servers means ten places to enforce auth, which is exactly the consolidation case for using Okta\'s MCP layer.',
        'Like the MCP Adapter, MCP Bridge is upcoming and in active development. The positioning is the same: get into the roadmap conversation now, before the customer commits to a custom transport or auth solution that Okta will then have to displace. The unique SE value is framing MCP Bridge not as a niche infrastructure component but as the production readiness bridge for every MCP deployment the customer is building. Without a standardized, auth-enforced transport, MCP stays in the developer sandbox. With Okta\'s Bridge and Adapter, it becomes an enterprise-grade capability that can pass a security review.',
      ],
    },
  ],
};
