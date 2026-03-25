import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'why-okta',
  title: 'Why Okta',
  description:
    'The case for Okta as the identity platform for AI agentic systems — differentiated capabilities, the audit trail advantage, common objections and responses, and discovery questions that surface the gap.',
  tags: ['reference', 'differentiation', 'messaging', 'objections'],
  icon: '⚡',
  hasDiagram: false,
  diagramPrompt: '',
  cards: [
    {
      heading: 'The Integration Advantage',
      paragraphs: [
        'Every enterprise AI security architecture eventually arrives at the same set of requirements: delegated user identity through to downstream APIs, per-resource fine-grained authorization, secure credential storage for heterogeneous backends, cross-application agent access, and a protocol adapter for MCP-based agent systems. The question is whether those requirements are met by assembling pieces from different vendors — each with its own identity model, policy engine, audit log format, and API surface — or by extending the platform the enterprise already runs for workforce authentication.',
        '!! The key differentiator: Okta is the ONLY enterprise identity platform where OBO Token Exchange (GA), Auth0 FGA, Token Vault, Cross App Access, and MCP Adapter operate as integrated components within the same platform your workforce already authenticates through. No other vendor can say this.',
        '>> The expansion motion is natural: most enterprise Okta customers already have WIC for their workforce. Extending that to AI agents is additive — same platform, same policies, same audit infrastructure, new subject type.',
        'TT "You already use Okta for your workforce identity. Your AI agents need the same level of governance — user delegation, per-resource authorization, audit trail. Why would you bring in a second identity platform for agents when Okta extends to cover them natively?"',
      ],
    },
    {
      heading: 'The Audit Trail Differentiator',
      paragraphs: [
        'When an AI agent takes an action on behalf of a user — calling an API, reading a record, initiating a transaction — that action generates two distinct types of evidence: an application-layer log produced by the agent or the target system, and an identity-layer record produced by the authorization server. Most organizations deploying AI agents today have the first and not the second. The distinction matters because application-layer logs are produced by the same system that is being investigated. An identity-layer record is produced independently — it captures the authorization decision itself, not the application\'s account of what it decided to do.',
        '!! This is the differentiator that closes deals in regulated industries: Okta\'s System Log is produced by the authorization server, not by the agent or the application. It\'s an independent, tamper-evident record of every delegation event. No competitor produces this.',
        '>> In a compliance inquiry, an app-level log says "our agent says it did X." An Okta System Log says "Okta authorized agent Y to do X on behalf of user Z at time T with scope W." The difference is credibility — and it matters to auditors.',
        '?? If your AI agent takes an action that triggers a compliance inquiry, is your audit evidence produced by the agent itself or by an independent identity layer?',
      ],
    },
    {
      heading: 'Common Objections and Responses',
      paragraphs: [
        'Objection: "We already have an IdP" (usually Entra ID)\nTT "Your IdP handles user authentication — that\'s not the gap. The gap is agent delegation. Entra OBO only works for user-initiated flows where a user token is present at the start of the call. Autonomous agents running on scheduled jobs or event triggers cannot produce OBO tokens using client credentials alone — there\'s no user token to exchange. Okta\'s OBO implementation is designed to support delegated access patterns for agentic systems. It layers on top of your existing IdP — it doesn\'t replace it."',
        'Objection: "We can use service accounts"\nTT "Service accounts tell the downstream API who the agent is. They don\'t tell the API who the user is. That means no per-user delegation, no per-resource FGA that enforces what the agent can access on whose behalf, no delegation audit trail, and no way to revoke a specific user\'s agent access without taking down the entire service. When your compliance team asks how you ensure an AI agent acting on behalf of a departed employee loses access immediately — a service account has no answer."',
        'Objection: "We\'ll build it ourselves"\nTT "RFC 8693 token exchange is the easy part — it\'s well-documented. The hard part is what comes after: fine-grained authorization that evaluates relationship-based policies at query time, a token vault with 8 auth methods for heterogeneous backends, centralized revocation that propagates across distributed systems, and an audit log that holds up to SOX review. Those take 12–18 months to build and a dedicated team to maintain as the OAuth ecosystem evolves. The question isn\'t whether you can build it — it\'s whether that\'s the best use of your engineering capacity."',
        'Objection: "It\'s too early for this"\nTT "OBO is GA. Cross App Access is in Early Access. The MCP Adapter exists and is in active development. The standards these capabilities are built on — RFC 8693, GNAP, OAuth 2.1 — are not drafts, they are shipping implementations. The organizations that start building their agent identity architecture now will have it production-ready when their AI deployments scale. The organizations that wait will be building under pressure when the compliance team is already asking questions."',
      ],
    },
    {
      heading: 'Top Discovery Questions',
      paragraphs: [
        '?? When your AI agent calls an internal API, how does the API know which user authorized that call?',
        '?? What happens when an employee leaves — how do you ensure AI agents acting on their behalf lose access immediately?',
        '?? If your AI agents take an action that causes a compliance incident, can you prove to an auditor exactly what the agent did, on whose behalf, and what it was authorized to do?',
        '?? How many backend systems do your AI agents access? How long does it take to add auth to each new integration?',
        '?? Are your AI agents using shared service accounts? What happens when one of those agents is compromised?',
        'TT "These questions don\'t have good answers without an identity layer for agents. That\'s the gap Okta fills. Start the conversation here, document the answers, and use the gaps as the business case."',
      ],
    },
  ],
};
