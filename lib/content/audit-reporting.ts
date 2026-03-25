import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'audit-reporting',
  title: 'Audit & Reporting',
  description:
    'How Okta\'s System Log provides a tamper-proof, identity-layer audit trail for every AI agent action — answering the compliance question of who authorized what, on whose behalf, and when.',
  tags: ['audit', 'compliance', 'system-log', 'siem', 'governance'],
  icon: '📊',
  hasDiagram: true,
  diagramPrompt:
    'Data flow diagram: AI Agent box (top) → Auth Layer box → Protected API box. From Auth Layer: arrow down to Okta System Log box showing sample log entry fields (actor, subject, eventType, scopes, timestamp). From System Log: arrow right to SIEM box. Warm amber/cream palette, flat technical diagram style, white background.',
  cards: [
    {
      heading: 'AI Agents in the Okta System Log',
      paragraphs: [
        'Okta\'s System Log captures every event in the identity layer — including token exchanges, delegation grants, and API authorizations. This is not an application-level log that an individual service controls; it is the authoritative record of every authorization decision the identity platform makes. When an AI agent requests a token, exchanges it for a delegated credential, or calls a protected API through an Okta-enforced authorization boundary, each of those events appears in the System Log with a structured, immutable record.',
        'For AI agents specifically, the token exchange event is the key audit record. It captures the subject — the user whose identity is being delegated — the actor, which is the agent performing the exchange, the audience, which is the target API the token is scoped to, the specific scopes granted, and the precise timestamp. The log entries also expose field-level detail: actor.type distinguishes whether the actor was a human user or an automated agent, displayName surfaces the registered name of the agent, and eventType identifies the specific operation — token.exchange, grant.delegated, and so on. Together these fields answer the identity-layer question: who authorized whom to do what.',
        '!! Why this matters for enterprise AI deployments is straightforward. When an AI agent takes an action on behalf of a user — reads a file, submits a form, queries a database — compliance teams need a reliable, tamper-proof record of that action. The Okta System Log is that record. It is not produced by the agent, which could be compromised or misconfigured. It is not produced by the application, which the development team controls. It is the identity layer record, produced by the authorization server itself, capturing the authorization decision at the moment it was made. For regulated industries, that distinction between an app-level log and an identity-layer log is often the difference between meeting an audit requirement and failing it.',
      ],
    },
    {
      heading: 'Audit Trail Design for Compliance',
      paragraphs: [
        'GDPR, SOX, HIPAA, and the emerging AI governance frameworks being developed by NIST, the EU AI Act, and industry regulators all require audit trails for automated systems acting on user data. The core requirement is consistent: there must be a durable, verifiable record of what the system did, on whose behalf, under what authorization, and when. For AI agents that act across multiple systems and APIs, this requirement is difficult to satisfy with application-level logging alone — each system produces its own log with its own schema, and there is no authoritative record that ties them together.',
        'A well-designed AI agent audit trail must be able to answer four questions for any agent action: who authorized the agent to take this action, whose data or resources were accessed, what specific scopes governed that access, and was the delegation within the permissions the user originally granted. Okta\'s System Log answers all four questions directly. The delegated token that the agent presents to a protected API carries the user\'s identity and the scopes the user authorized. The System Log records the full token exchange event, including which agent made the request and what it was granted. An auditor can reconstruct the complete authorization chain for any agent action from these records without relying on the agent itself or the application it called.',
        'SIEM integration extends this capability into existing security operations workflows. Okta\'s System Log exports to Splunk, Datadog, Elastic, and other SIEM platforms via event hooks — structured, real-time streams of identity events. This means AI agent actions become searchable, alertable, and reportable in the same tooling security teams already use for human activity. An organization can create a Splunk dashboard showing all token exchange events by agent, alert on agents requesting scopes outside their registered profile, or generate a compliance report showing every action taken by AI agents on behalf of a specific user over a given period. The identity-layer events provide the authoritative source of truth; the SIEM integration makes that source of truth operationally accessible.',
      ],
    },
    {
      heading: 'SE Discovery Angle',
      paragraphs: [
        'The discovery questions that open the audit conversation are designed to surface gaps that customers often have not fully articulated.',
        '?? How would you audit what an AI agent did on behalf of a specific user? Most organizations discover in answering this question that they rely on application logs they do not fully control, or that their current architecture produces no per-call audit record at all.',
        '?? Who is accountable when an AI agent makes a mistake — and how do you prove what happened? This adds the accountability dimension, which resonates strongly with legal, compliance, and security leadership.',
        '?? Does your current auth model produce per-call audit records for agent actions? This makes the gap concrete and quantifiable.',
        'The common blocker for AI agent adoption in regulated industries is not technical complexity — it is auditability. Organizations that have worked through the technical architecture for their agent systems frequently stall at deployment when the CISO or compliance team asks "how do we audit this?" The answer "we log at the application layer" is not sufficient for many regulatory frameworks, and security-conscious organizations recognize that application-layer logs can be manipulated by the application. Okta\'s System Log resolves this blocker directly. It is the identity-layer record of the authorization decision, produced by the authorization server, not by the agent or the application it calls.',
        '>> The upgrade from application-level logging to identity-layer logging is worth making explicit in the sales conversation. Application logs are produced by the agent or the application and can be altered, selectively retained, or accidentally omitted if the application fails mid-execution. Okta\'s System Log is the authoritative identity-layer record — more credible for compliance, more useful for forensics, and harder for an attacker or a misconfigured system to suppress. For organizations that are required to demonstrate to an auditor that AI agents acted only within authorized bounds, the System Log is not just a feature — it is the mechanism that makes the entire deployment defensible.',
      ],
    },
  ],
};
