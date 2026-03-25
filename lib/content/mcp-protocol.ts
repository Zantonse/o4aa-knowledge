import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'mcp-protocol',
  title: 'MCP Protocol Auth Gap',
  description:
    'The Model Context Protocol specification defines transport-layer auth rules that leave most real-world MCP deployments with no authentication at all — and no built-in mechanism for agent identity, tool-level authorization, or centralized revocation.',
  tags: ['MCP', 'Security', 'Auth', 'Protocol'],
  icon: '📡',
  hasDiagram: true,
  diagramPrompt:
    'Two-column comparison diagram: left column labeled STDIO with text "No Auth Spec" and a warning symbol, right column labeled Streamable HTTP with text "Optional OAuth" and a gate symbol. Below both: a box labeled "Enterprise Auth Gap" listing: No agent identity, No tool RBAC, No revocation. Warm amber cream palette, flat technical style.',
  cards: [
    {
      heading: 'MCP Auth by Transport Layer',
      paragraphs: [
        'The MCP specification (version 2025-11-25) defines authentication behavior at the transport layer, not at the protocol level, which means the auth story differs depending on how the MCP server is deployed. For STDIO transport — the mechanism used by Claude Desktop, VS Code, and Cursor — the spec explicitly says implementations SHOULD NOT use OAuth. Credentials are sourced from environment variables. This transport covers the large majority of MCP deployments in production today, and at the protocol level it has zero authentication. Any process running in the same environment with access to those environment variables can invoke all available tools.',
        'For Streamable HTTP transport, which handles remote MCP server connections, the spec says implementations SHOULD conform to OAuth 2.1 with PKCE. The critical word is "should" — this is a recommendation, not a requirement, and compliance is optional. When OAuth is implemented, the spec prescribes the use of Protected Resource Metadata (RFC 9728) to allow the MCP client to discover the authorization server. This metadata document, served by the MCP resource server, points to the authorization server that issues tokens for that resource.',
        'The default architecture in the spec has the MCP server operating as its own authorization server. This creates a circular trust problem: the entity that controls the tools is also the entity that decides who is allowed to call those tools. There is no external authority validating the authorization server\'s decisions, no shared revocation endpoint, and no way for an enterprise to apply organizational policy from outside the MCP server itself.',
        'Custom transports are also permitted by the spec. Implementors building custom transports are told they MUST follow security best practices, but no specific authentication mechanism is prescribed. In practice this means custom transport auth is entirely at the discretion of the implementor, producing a fragmented landscape where each MCP server may enforce authentication in a different way — or not at all.',
      ],
    },
    {
      heading: 'The Enterprise Auth Gaps',
      paragraphs: [
        'The most fundamental gap in the MCP spec is the absence of agent identity. The protocol can confirm that a client connected and presented a valid credential, but it has no mechanism to convey which human authorized the session, which AI model is making the calls, or which organizational policy should govern the interaction. From an enterprise security perspective, this means MCP tool calls are attributed to a credential, not to a person or a workflow. There is no way to answer "who did this?" in a way that maps to a human identity in an audit log.',
        'Tool-level authorization does not exist in the protocol. The tools/list and tools/call methods have no built-in role-based access control. Once a client authenticates to an MCP server, it can enumerate and invoke every tool that server exposes. Per-tool access control must be implemented separately by each MCP server author — there is no standard pattern, no shared enforcement mechanism, and no way to manage tool permissions centrally across multiple MCP servers. This means access control policies are scattered across every tool server in the fleet.',
        'The spec explicitly acknowledges that tool annotations cannot be used as a security boundary. Tool descriptions, parameter schemas, and metadata are all advisory. The spec states that "clients MUST consider tool annotations to be untrusted unless from trusted servers," which means the only enforcement that matters is what the server actually checks at call time — not what it advertises in its tool manifest. Security policies cannot be declared in tool metadata and expected to be honored.',
        'Token forwarding and revocation are both unresolved at scale. The spec prohibits MCP servers from forwarding client tokens to upstream APIs — this is the confused deputy problem — but enforcement is entirely left to implementors. There is no mechanism for an enterprise to verify that a given MCP server is not forwarding tokens. Revocation is similarly unresolved: there is no centralized revocation endpoint across MCP connections, so when an employee leaves or a breach occurs, invalidating all AI agent tokens requires touching every MCP server separately.',
      ],
    },
    {
      heading: 'MCP Security Concerns',
      paragraphs: [
        'The spec itself acknowledges a DNS rebinding attack vector for locally deployed Streamable HTTP servers. If a local MCP server does not validate the Origin header on incoming requests, a malicious web page can use DNS rebinding to send requests to the local server, bypassing network perimeter controls. This is a known and documented risk in the specification, not a theoretical edge case. Mitigations require explicit Origin validation logic that each server author must implement independently.',
        'Tool poisoning and prompt injection are the highest-severity attack vectors unique to AI-integrated protocols. A malicious MCP server can craft tool descriptions, parameter names, or response payloads designed to manipulate the LLM\'s behavior — causing the model to take unintended actions, exfiltrate data through seemingly innocuous tool parameters, or override instructions from the user or system prompt. Because the LLM processes tool descriptions as natural language, adversarial content in those descriptions can influence model reasoning in ways that are invisible to the end user.',
        'The STDIO transport\'s reliance on environment variables for credentials creates a broad attack surface. Any process running in the same environment — not just the intended MCP client — can invoke all tools if it has access to the same environment variables. This includes other software running on the same machine, shell scripts with access to the environment, and any process spawned by the user. There is no session isolation, no per-caller verification, and no way to distinguish the intended AI client from any other process using the same credentials.',
        'Two additional vectors round out the threat landscape. The confused deputy risk — MCP servers forwarding client tokens to upstream APIs — is prohibited by the spec but not enforced, meaning a poorly implemented or malicious MCP server can use a client\'s token to make API calls on the client\'s behalf without the client\'s knowledge. SSRF via Client ID Metadata Documents is a spec-adjacent risk: authorization servers that fetch attacker-controlled URLs as part of dynamic client registration can be weaponized to perform server-side request forgery against internal infrastructure.',
      ],
    },
    {
      heading: 'Where Okta Fits',
      paragraphs: [
        'The MCP spec\'s use of Protected Resource Metadata (RFC 9728) creates an explicit architectural seam between the resource server and the authorization server. The MCP server is the resource server — it hosts tools and enforces what calls are allowed. The authorization server is a separate entity responsible for authentication, token issuance, and revocation. This separation is not incidental; it is the pattern the spec prescribes for Streamable HTTP deployments. Okta fills the authorization server role. When an MCP server\'s Protected Resource Metadata points to an Okta tenant as the authorization server, Okta owns the full auth lifecycle: it authenticates the client, enforces consent, issues scoped tokens, validates tokens on each request, and handles revocation centrally.',
        'This architecture is the same pattern that large platform vendors are adopting. Microsoft routes Copilot Studio agent tool calls through Azure API Management, which enforces auth before forwarding to MCP servers. Cloudflare positions Cloudflare Access as the auth proxy layer in front of remote MCP servers. The pattern is consistent: an external, enterprise-grade authorization server sits between the AI client and the MCP tool server, owning all auth decisions. Okta is the answer to that pattern for organizations that are not locked into Microsoft Azure or Cloudflare\'s network layer.',
        'Every enterprise MCP deployment eventually has to answer one question: what is our authorization server? For STDIO deployments, the answer is often "nothing yet," which is the conversation opener. For Streamable HTTP deployments, the answer might be a custom auth server or a platform-specific solution. Okta is the right answer for organizations that need centralized identity, cross-environment policy, integration with their existing IAM investment, and audit coverage that spans MCP tool calls alongside every other system in the enterprise.',
      ],
    },
  ],
};
