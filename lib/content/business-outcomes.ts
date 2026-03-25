import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'business-outcomes',
  title: 'Customer Business Outcomes',
  description:
    'How Okta for AI Agents maps to the business outcomes customers care about — unblocking production deployment, reducing integration complexity, and strengthening compliance posture.',
  tags: ['SE-playbook', 'business-outcomes', 'value-mapping', 'consulting'],
  icon: '📈',
  hasDiagram: false,
  diagramPrompt: '',
  cards: [
    {
      heading: 'Accelerate AI Agent Deployment',
      paragraphs: [
        'Most enterprises have AI agent projects stalled in development because they can\'t pass security review. The auth model is missing. Agents are running on shared service accounts with no per-user delegation, no audit trail, and no revocation mechanism. Security teams block production deployment until these gaps are closed.',
        '!! Business outcome: Okta unblocks production deployment by providing the auth layer security teams require — OBO token exchange for user delegation, Auth0 FGA for per-resource access, and System Log for compliance-grade audit. Customers go from "blocked in dev" to "approved for production."',
        'TT "How many AI agent projects do you have waiting for security approval right now? What\'s the specific blocker? In most cases, it\'s the identity and authorization model. Okta provides that layer so your security team can sign off."',
        '?? How many AI agent initiatives are currently blocked waiting for security review? What would it mean for your business if those went live this quarter instead of next year?',
      ],
    },
    {
      heading: 'Reduce Integration Complexity',
      paragraphs: [
        'Without a centralized identity layer, every AI agent integration requires custom auth middleware. Each backend API needs its own credential management, token exchange logic, and audit implementation. With 10 backend systems, that\'s 10 custom auth implementations to build, maintain, test, and keep secure. Engineering time spent on auth plumbing is time not spent on AI capabilities.',
        '!! Business outcome: Okta centralizes agent auth into one platform. The MCP Adapter handles 8 different auth methods through a single gateway. Engineers configure once in Okta; every agent-to-backend connection inherits enterprise auth automatically. Customers report reducing integration effort from weeks to days per backend.',
        '>> The pattern we see: customers start by building custom auth for their first 2-3 agent integrations, then hit a wall at integration 4-5 when the maintenance burden becomes unsustainable. Okta is the answer to "how do we scale this?"',
        '?? How many backend systems do your AI agents need to connect to? How long does it take your team to add auth to each new integration today?',
      ],
    },
    {
      heading: 'Strengthen Compliance Posture',
      paragraphs: [
        'Regulators are catching up to AI. SOX auditors are asking whether AI agents have unique, audited identities. HIPAA requires per-access PHI logging that shared service accounts can\'t provide. The EU AI Act mandates human oversight mechanisms for high-risk AI systems. Organizations that deploy AI agents without an identity layer face compliance gaps that surface during the next audit cycle.',
        '!! Business outcome: Okta produces the audit evidence compliance teams need — every agent action logged with user attribution, delegation chain, scopes used, and timestamp. System Log is an identity-layer record (not an app-level log), making it authoritative for audit purposes. CIBA provides the human oversight mechanism the EU AI Act requires.',
        'TT "When your auditor asks \'who authorized this AI agent to access that customer record,\' what\'s your answer today? With Okta, the answer is in the System Log: user X authorized agent Y at time T with scope Z. That\'s the audit evidence that closes the compliance gap."',
        '?? What compliance frameworks govern your AI agent deployments? Has your audit team asked about AI agent identity and access controls yet?',
      ],
    },
    {
      heading: 'Feature-to-Outcome Mapping',
      paragraphs: [
        'Every O4AA capability maps to a specific business outcome. Use this mapping in proposals, executive summaries, and business case documents to connect technical features to the language leadership cares about.',
        '>> OBO Token Exchange (RFC 8693) → Enables user-delegated agent access → Unblocks production deployment by satisfying security team requirements for per-user attribution',
        '>> Cross App Access (XAA) / ID-JAG → Enterprise-governed app-to-app connections → Reduces shadow AI risk by giving IT centralized control over which agents access which systems',
        '>> Auth0 FGA → Per-resource, per-user authorization → Prevents data leakage in RAG systems and multi-tenant environments → Directly addresses GDPR "minimum necessary" and HIPAA requirements',
        '>> Token Vault → Centralized credential management → Eliminates credential sprawl and "ghost access" from departed employees → Reduces mean-time-to-revoke from hours to seconds',
        '>> MCP Adapter (8 auth methods) → Single gateway for heterogeneous backends → Reduces per-integration auth engineering from weeks to days → Directly reduces engineering cost',
        '>> System Log (identity-layer audit) → Authoritative compliance record → Satisfies SOX ITGC, HIPAA 164.312(b), GDPR Article 30 → Audit evidence that costs nothing to produce once configured',
        '>> CIBA (human-in-the-loop) → Async human approval for high-risk agent actions → Satisfies EU AI Act human oversight requirement → Directly unblocks regulated industry deployment',
      ],
    },
  ],
};
