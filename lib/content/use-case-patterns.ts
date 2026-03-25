import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'use-case-patterns',
  title: 'Use Case Patterns',
  description:
    'Common agentic AI deployment patterns and the identity and authorization model each one requires.',
  tags: ['OBO', 'XAA', 'M2M', 'CIBA', 'FGA', 'anti-patterns', 'delegation'],
  icon: '🎯',
  hasDiagram: false,
  diagramPrompt: '',
  cards: [
    {
      heading: 'Delegated Access Patterns (OBO/XAA)',
      paragraphs: [
        'Sales Copilot agents read deal history, update Salesforce records, and draft outbound emails on behalf of a specific sales rep. Because the action must be attributed to the rep — not a generic service account — the agent authenticates using On-Behalf-Of (OBO) or Cross-Application Authorization (XAA). The token the agent receives is scoped to that rep\'s permissions and expires with the user\'s session.',
        'Discovery question for Sales Copilot: "When your AI agent sends an email from a rep\'s account, how does it authenticate to Gmail? If two reps trigger the same agent simultaneously, does it access the same shared credential or does each rep get a distinct token?"',
        'HR Data Agents access Workday and ADP to retrieve employee records, automate onboarding tasks, and answer HR policy questions. These agents use a mixed authentication model: Client Credentials (M2M) for provisioning workflows that have no user context, and OBO tokens when accessing specific employee PII. Auth0 Fine-Grained Authorization (FGA) is used to filter what the RAG document retrieval layer surfaces — an employee asking a benefits question should not have salary bands or performance reviews included in the retrieved context.',
        'Discovery question for HR agents: "When your HR agent queries the document store, how do you prevent it from surfacing salary data to an employee asking a general onboarding question? Is that filtering enforced at the identity layer or only inside the LLM prompt?"',
        'Customer Service Agents handle support requests on behalf of authenticated end customers in a B2C context, typically built on Auth0 for CIAM. The agent receives a token derived from the customer\'s login session and Auth0 FGA enforces per-customer record access — the agent can only retrieve data belonging to the authenticated customer, not other accounts.',
        'Discovery question for B2C customer service: "If a customer asks for a record of everything your AI accessed about them during a support session, can you produce that audit trail on demand to comply with a GDPR Subject Access Request?"',
      ],
    },
    {
      heading: 'Machine Identity Patterns (M2M)',
      paragraphs: [
        'IT Automation and Helpdesk Bots handle autonomous tier-1 IT operations: account provisioning, password resets, group membership changes, and ServiceNow ticket updates. These agents authenticate using Client Credentials with Private Key JWT — each agent deployment has its own unique service app identity registered in Okta, with OAuth scopes limited to the specific Admin API operations it needs. High-risk operations such as granting admin roles or disabling MFA require a CIBA async confirmation from an on-call IT admin before the action is executed.',
        'Discovery question for IT automation: "What identity does your helpdesk bot use when it calls the Okta Admin API? Is it a named service account shared with other systems, or does the bot have its own registered application identity with scoped permissions?"',
        'DevOps CI-CD Agents handle pull request review, deployment orchestration, and cloud infrastructure changes across AWS, GitHub, and Kubernetes. The key identity principle is environment isolation: the agent must have separate registered identities for dev, staging, and production environments so that a compromised dev credential cannot be used against production. Production deployment approvals require CIBA confirmation from a senior engineer. The primary risk in this pattern is credential sprawl — a single DevOps agent may need to authenticate to a dozen different API providers, and those credentials are often stored as long-lived secrets in CI/CD environment variables.',
        'Discovery question for DevOps agents: "Could you revoke your DevOps agent\'s access to all downstream systems — AWS, GitHub, Kubernetes, Datadog — in under 60 seconds right now if you detected a compromise?"',
      ],
    },
    {
      heading: 'Complex Patterns',
      paragraphs: [
        'Financial Trading Agents combine M2M autonomous execution with mandatory human-in-the-loop authorization. Trades below a defined threshold execute autonomously using DPoP-bound tokens that are cryptographically tied to the agent\'s runtime environment. Trades above the threshold trigger a CIBA async authorization request to a licensed trader; the push notification includes rich context — instrument, quantity, notional value, and the agent\'s reasoning — so the approver has enough information to make an informed decision. Compliance requirements include SOX audit trail, FINRA Notice 24-09 on AI in trading, and the EU AI Act high-risk classification. Separation of Duties is enforced at the identity layer: the agent identity that generates a trade recommendation cannot be the same identity that executes it.',
        'Discovery question for trading agents: "When your algorithm executes a trade, which identity appears in the trade record submitted to the exchange or custodian? Is it traceable back to the specific agent version and the human who authorized it?"',
        'Multi-Agent Orchestrators chain multiple specialized sub-agents together — a research agent, a drafting agent, a code execution agent — to complete complex tasks. Token delegation across the chain uses RFC 8693 Token Exchange: each sub-agent receives a token that is downscoped from the token the orchestrator holds. A sub-agent that only needs read access to a document store should not hold a token that also grants write access to the CRM. This downscoping directly mitigates prompt injection lateral movement: if a malicious document causes a sub-agent to be compromised, the attacker is constrained to the permissions in the sub-agent\'s restricted token and cannot escalate to orchestrator-level permissions.',
        'Discovery question for multi-agent systems: "If a sub-agent takes a destructive action — deletes a record, sends an unauthorized message — can you produce a complete authorization chain audit trail that traces back to the originating user or system that initiated the orchestration run?"',
      ],
    },
    {
      heading: 'Deployment Anti-Patterns',
      paragraphs: [
        'Shared Service Account Credentials: multiple agents share a single credential, which means audit logs record the account name rather than which agent or which user triggered the action. In a documented incident at a financial services firm, 23 different AI agents were sharing one Salesforce service account. A prompt injection attack on one of those agents exposed the data surfaces of all 23 use cases simultaneously. The blast radius of a single compromised credential grows linearly with the number of agents sharing it.',
        'Long-Lived Static Credentials: API keys and OAuth client secrets that never expire, stored as plaintext environment variables or hardcoded in container images, are one of the most common root causes of AI agent breaches. When an engineer who configured the credentials leaves the organization, the credentials remain active — sometimes for years. In one documented case, a long-lived GitHub personal access token was baked into a Docker image layer. Scanning tools discovered it, which led to further credential exposure across Salesforce and Stripe integrations. Credentials should be short-lived, rotated automatically, and never stored in build artifacts.',
        'No Human Ownership: agents are deployed without a formal identity registration in the enterprise\'s IAM system and without a named business owner. When a security incident occurs — an agent behaving unexpectedly, an anomalous API call pattern — there is no clear responder. Security teams cannot escalate, product teams claim the agent belongs to a different team, and the incident response window expands while ownership is being established. Every agent identity should be registered in Okta with an application owner, a cost center, and an on-call contact.',
        'Overbroad Permissions ("Admin for Convenience"): this is OWASP LLM Top 10 item number 6, Excessive Agency. Engineers grant broad permissions during development to avoid debugging permission errors, then those permissions persist to production. In a documented example, an AI research assistant was granted GitHub organization admin to simplify repository access during a proof of concept. A prompt injection attack in a retrieved document escalated through that admin permission and exfiltrated private repositories before the connection between the broad permission and the attack surface was recognized.',
        'No Kill Switch: the most operationally dangerous anti-pattern. In a documented incident, a compromised agent was identified within 20 minutes of initial detection. It took 4 hours to fully revoke the agent\'s credentials across 11 different API providers because each provider required a manual process and there was no centralized identity that could be disabled in one action. During that 4-hour window, 340,000 customer records were downloaded. Every agent deployment must have a tested runbook for full credential revocation in under 5 minutes, and all agent identities should be centrally managed through Okta so that disabling the application in one place propagates to all downstream token issuance.',
      ],
    },
  ],
};
