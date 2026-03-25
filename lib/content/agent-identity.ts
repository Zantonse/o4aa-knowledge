import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'agent-identity',
  title: 'Agent Identity',
  description:
    'Machine identity vs. human-delegated identity, how principal hierarchies work in multi-agent systems, and the discovery questions that open the identity conversation.',
  tags: ['foundations', 'identity', 'delegation', 'discovery'],
  icon: '👤',
  hasDiagram: true,
  diagramPrompt:
    'Vertical trust chain diagram: Human User (top, amber box) → AI Orchestrator (amber) → Sub-Agent (amber) → Protected API (bottom, amber). Downward arrows labeled with identity assertion types (delegated token, scoped token). Okta auth checkpoint icon between Sub-Agent and API. Clean flat style, warm cream background, white background areas, technical diagram aesthetic.',
  cards: [
    {
      heading: 'Machine Identity vs. Human-Delegated Identity',
      paragraphs: [
        'An agent can act in two fundamentally different identity modes, and confusing them is one of the most common mistakes in early agentic architectures. Machine identity means the agent authenticates as itself — it holds credentials issued to it as a service principal, independent of any particular user. This is appropriate for fully autonomous, system-level operations: running a nightly data pipeline, monitoring infrastructure, or performing batch processing tasks that have no per-user context. The credential belongs to the agent, and the agent\'s authorization is defined by what the service principal has been granted.',
        'Human-delegated identity means the agent acts on behalf of a specific human user. The agent\'s actions carry the user\'s identity and are bounded by what that user is permitted to do. This is required any time the agent accesses user-specific data — reading a person\'s calendar, querying their account records, sending email from their address. The agent cannot simply use its own machine credential here; the downstream API needs to know which user authorized this action and what scope of access was granted. Without this delegation chain, you lose accountability: you can see that Agent X accessed the calendar API, but you cannot attribute that action to any specific user authorization.',
        'The identity assertion chain is the concrete question: when the agent\'s tool call arrives at a protected API, how does that API determine who authorized the request and what they were permitted to do? A bare machine credential answers "who is this agent" but not "on whose behalf is it acting." This is where RFC 8693 OAuth 2.0 Token Exchange enters: it provides a standards-based mechanism to issue a new token that binds both the agent\'s identity (the actor) and the user\'s identity (the subject), so the receiving API can verify the complete authorization picture. Okta\'s On-Behalf-Of Token Exchange implementation is the production form of this pattern.',
      ],
    },
    {
      heading: 'Principal Hierarchy in Multi-Agent Systems',
      paragraphs: [
        'In a multi-agent system, authorization does not flow through a single hop — it traverses a chain: Human User authorizes an AI Orchestrator, the Orchestrator delegates to one or more Sub-Agents, and Sub-Agents call Tools or downstream APIs. At every hop in this chain, a different principal is making the API call, but the action should still be traceable back to the original human authorization. If the chain breaks — if a sub-agent operates with credentials that are not rooted in the user\'s explicit grant — then you no longer have a defensible authorization model.',
        'The confused delegate problem is the most dangerous failure mode in this chain. It occurs when a sub-agent can claim or inherit permissions that the orchestrator never had, or that the user never granted to the orchestrator. If the orchestrator was authorized to read a user\'s calendar but not write to it, a sub-agent operating under the orchestrator\'s delegation should not be able to write to the calendar either. The permission ceiling of any downstream agent is bounded by the authorization of the principal above it in the chain. Without an explicit enforcement mechanism, a misconfigured or compromised sub-agent can silently escalate privilege.',
        'Okta models this through scoped delegation tokens that carry both the original user\'s identity and the agent\'s identity. When a sub-agent requests a token to call a downstream API, Okta can inspect the full delegation chain — user granted orchestrator, orchestrator delegated to sub-agent — and issue a token scoped to only what that sub-agent legitimately needs for that specific call. The receiving API gets a verifiable credential that answers: who is the user, who is the acting agent, what was explicitly authorized, and is this token still valid. For an SE, this is the conversation-stopper when a prospect says "we just use a shared service account for all our agents."',
      ],
    },
    {
      heading: 'SE Discovery Angle',
      paragraphs: [
        '?? The most productive early question is not "do you have AI agents?" — most prospects do or are building them. The question is: "How do your agents authenticate to internal APIs today?" The answers reveal the gap immediately. If the answer is "we have a shared service account," that means every agent action is attributed to a single system credential with no per-user accountability and no ability to scope access down. If the answer is "we pass the user\'s token to the agent," you need to understand how that token is being stored, how it\'s refreshed, and what happens when it expires mid-task. Both answers lead directly to Okta for AI Agents.',
        '>> Common pain points worth surfacing: shared service account credentials used across multiple agents (no isolation, no accountability, blast radius is the entire account\'s permissions); no per-user delegation mechanism (agent acts as itself, not as the user — user-specific data access breaks or is silently unauthorized); no audit trail distinguishing agent actions from human actions (compliance cannot answer "what did the agent do?"); tokens stored in agent memory or environment variables with no rotation (static credentials in a dynamic system). Any one of these is a compelling problem. All four in the same organization is a priority deal.',
        'TT Why this conversation is different from traditional IAM: your prospect has probably already solved human authentication — they have Okta, or a competitor, for their employees. The agentic identity problem is new, and critically, most customers have not consciously recognized it as an identity problem yet. They think of it as a "how do we connect our agent to APIs" problem. Reframing it as an identity and authorization problem — with the compliance, audit, and security implications that follow — elevates the conversation from a developer integration discussion to a CISO-relevant business risk conversation. That reframe is the entry point for a strategic Okta for AI Agents sale.',
      ],
    },
  ],
};
