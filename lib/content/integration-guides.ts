import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'integration-guides',
  title: 'Integration Guides',
  description:
    'How to connect Okta with the AI agent frameworks customers actually build with — LangChain, CrewAI, AWS Bedrock, Claude, and the generic MCP pattern.',
  tags: ['developer', 'integration', 'LangChain', 'CrewAI', 'Bedrock', 'Claude'],
  icon: '🔧',
  hasDiagram: false,
  diagramPrompt: '',
  cards: [
    {
      heading: 'LangChain / LangGraph',
      paragraphs: [
        'LangChain is the most common agent framework. The integration point is the Tool layer — where LangChain makes external API calls. The pattern: configure each LangChain Tool to obtain an Okta token before calling the protected API. For OBO flows, the LangGraph node that initiates the agent task receives the user\'s access token and exchanges it via Okta\'s token exchange endpoint before each tool call.',
        '>> Integration pattern: (1) User authenticates via Okta (Auth Code + PKCE), (2) LangGraph receives user\'s access token as task context, (3) Before each tool call, a custom callback or middleware calls Okta\'s /token endpoint with grant_type=token-exchange, passing subject_token (user\'s token) and the tool\'s target audience, (4) Okta returns a scoped delegated token, (5) The tool call uses the delegated token as its Bearer credential, (6) After the call, the scoped token is discarded (not cached).',
        '!! Key implementation detail: the token exchange happens per-tool-call, not per-session. This is what enables per-call audit and minimal privilege. A common mistake is exchanging once at session start and reusing the broad token — this defeats the purpose of OBO.',
        'For MCP-based LangChain tools: configure the LangChain MCP tool to point at the Okta MCP Adapter endpoint instead of the raw MCP server. The Adapter handles all auth transparently — the LangChain tool code does not need to know about Okta.',
      ],
    },
    {
      heading: 'CrewAI',
      paragraphs: [
        'CrewAI organizes agents into "crews" with specialized roles. Each crew member (agent) can have its own tools. The Okta integration maps to CrewAI\'s tool configuration: each tool is configured with Okta credentials, and the crew\'s task context carries the user delegation.',
        '>> Integration pattern: (1) Define each crew member\'s tools with an Okta-aware wrapper that handles token exchange, (2) Pass the user\'s access token into the crew\'s task input, (3) The wrapper exchanges the user token for a scoped tool-specific token before each external API call, (4) For multi-agent crews: the orchestrator agent\'s delegation is downscoped for each sub-agent using RFC 8693 token exchange — sub-agents cannot exceed the orchestrator\'s permissions.',
        '!! CrewAI\'s multi-agent pattern maps directly to Okta\'s principal hierarchy: the crew manager is the orchestrator, crew members are sub-agents. Each delegation hop uses token exchange to enforce scope reduction. This is the concrete implementation of the "confused deputy" prevention described in the Security section.',
      ],
    },
    {
      heading: 'AWS Bedrock Agents',
      paragraphs: [
        'AWS Bedrock Agents authenticate via IAM roles — there is no native OIDC flow. Each Bedrock Agent gets a single IAM service role, and all users\' requests run under that same role with no per-user delegation. This is the core gap Okta fills.',
        '>> Bridge pattern: (1) The calling application authenticates the user via Okta (Auth Code + PKCE), (2) Before invoking the Bedrock Agent, the app calls Okta\'s token exchange to get a delegated token scoped to the specific task, (3) The delegated token is passed to the Bedrock Agent as custom session context, (4) When the Bedrock Agent makes a tool call to an Okta-protected API, the API validates the delegated token — seeing both the user identity and the agent identity, (5) The IAM role handles Bedrock-to-AWS-service auth; the Okta token handles user delegation to external APIs.',
        '!! The Bedrock-Okta bridge is essential for any customer using Bedrock Agents that need to access non-AWS APIs with per-user authorization. Without it, all Bedrock Agent actions appear as the same IAM service role — no user attribution, no per-user data access, no delegation audit.',
      ],
    },
    {
      heading: 'Claude Tools / Claude Code + MCP',
      paragraphs: [
        'Claude Code and Claude Desktop connect to MCP servers natively. The MCP Adapter serves as the remote MCP server endpoint — Claude connects to the Adapter, which handles auth and routes to the actual backend MCP servers. Claude does not need to know about Okta; the Adapter handles everything via the BFF pattern.',
        '>> Setup: (1) Deploy the MCP Adapter (Docker bundle), (2) Configure backend MCP servers in the Admin UI, (3) In Claude Desktop settings or claude_desktop_config.json, add the Adapter\'s URL as a remote MCP server, (4) On first connection, the Adapter initiates OAuth via the BFF pattern — Claude sees a standard OAuth prompt, (5) After auth, Claude can call all tools exposed by the configured backends, with per-agent ACLs and per-call audit enforced by the Adapter.',
        'TT "Your developers are probably already using Claude Code or Claude Desktop with MCP. The Adapter slots in as the MCP server endpoint — Claude connects to it like any other MCP server. The difference: every tool call goes through Okta auth, gets per-user scoping, and produces an audit event. Zero changes to the Claude configuration beyond pointing at a different URL."',
      ],
    },
    {
      heading: 'Generic Pattern (Any Framework)',
      paragraphs: [
        'For frameworks not listed above, the integration follows a framework-agnostic pattern. The key insight: Okta integration happens at the tool call boundary, not at the framework level. Any framework that makes HTTP calls to external APIs can use Okta tokens.',
        '>> Universal integration steps: (1) Authenticate the user via Okta (Auth Code + PKCE or Device Authorization Grant), (2) Store the user\'s access token in the agent\'s session context, (3) Before each tool call, exchange the user\'s token for a scoped delegated token via POST to /oauth2/{authServerId}/v1/token with grant_type=urn:ietf:params:oauth:grant-type:token-exchange, (4) Use the delegated token as the Bearer credential for the tool call, (5) Discard the delegated token after use (do not cache).',
        '?? Which agent framework is the customer using? This determines the integration pattern. If they are using MCP, point them at the Adapter. If they are using direct API calls, walk them through the OBO token exchange integration at the tool call boundary.',
      ],
    },
  ],
};
