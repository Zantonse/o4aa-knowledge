import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'nhi-management',
  title: 'NHI Management',
  description:
    'How to register, govern, review, and deprovision AI agent identities in Okta — the full Non-Human Identity lifecycle.',
  tags: ['developer', 'NHI', 'lifecycle', 'ISPM', 'OIG', 'Universal-Logout'],
  icon: '🤖',
  hasDiagram: false,
  diagramPrompt: '',
  cards: [
    {
      heading: 'Registering Agent Identities',
      paragraphs: [
        'In Okta, an AI agent is registered as a service application (OIDC app with client_credentials grant type). Best practice: use Private Key JWT authentication (not client secret) for production agents. Each agent gets its own app registration with metadata: owner (human), environment (dev/staging/prod), cost center, and purpose description.',
        '!! Critical rule: every agent gets its own identity — never share service accounts across agents. Shared credentials mean shared blast radius, shared audit trail (useless), and inability to revoke one agent without killing all of them.',
        '>> Registration checklist: (1) Create OIDC app in Admin Console with client_credentials grant, (2) Enable Private Key JWT auth, generate RSA 2048 key pair, (3) Assign custom scopes matching the agent\'s required API access, (4) Set app metadata: owner, environment, team, (5) Add to relevant groups for access policy enforcement.',
        'For environments with many agents, consider automating registration via the Okta Management API or the Okta Terraform provider. The Okta MCP Server can also be used to manage agent app registrations via natural language.',
      ],
    },
    {
      heading: 'Shadow Agent Discovery (ISPM)',
      paragraphs: [
        'The "shadow agent" problem: development teams deploy AI agents with their own credentials (personal API keys, shared service accounts) without registering them through IT. These agents accumulate access, are invisible to security, and persist after the deploying engineer leaves.',
        '!! Okta Identity Security Posture Management (ISPM) surfaces these shadow identities. ISPM analyzes authentication patterns, credential usage, and API access to identify non-human identities that are not formally registered — including agents using stale credentials, agents with overprivileged access, and orphaned service accounts with no active owner.',
        '?? How many AI agents are running in your environment right now? Can you name all of them? Do you know who owns each one? If a deploying engineer left last month, how would you find the agents they created?',
      ],
    },
    {
      heading: 'Access Reviews and Governance (OIG)',
      paragraphs: [
        'Okta Identity Governance (OIG) extends access certification campaigns to non-human identities. Just as human users undergo quarterly access reviews, AI agent app registrations can be included in certification campaigns. The assigned owner reviews: which scopes does this agent have? Are they still needed? Is the agent still active?',
        'TT "Your quarterly access reviews probably cover human users. Do they cover your AI agents? With OIG, you include agent identities in the same certification campaigns — the owner reviews scopes, confirms the agent is still needed, and either re-certifies or flags for deprovisioning."',
        '>> Access review lifecycle: (1) OIG creates certification campaign including NHI apps, (2) Assigned owner reviews each agent\'s scopes and access, (3) Owner certifies or flags for revocation, (4) Flagged agents are automatically disabled or scopes are narrowed, (5) Audit trail of every review decision stored in OIG.',
      ],
    },
    {
      heading: 'Revocation and Universal Logout',
      paragraphs: [
        'When an agent is compromised or needs to be deprovisioned, disabling the app registration in Okta immediately stops all new token issuance. Existing tokens expire according to their TTL (typically minutes for access tokens). For immediate revocation, Okta\'s token revocation endpoint invalidates specific tokens on demand.',
        '!! The "kill switch" is not an abstract concept — it\'s a concrete Okta operation: disable the app in Admin Console (or via API) and all downstream access stops. No need to hunt down credentials across 11 different API providers. One action, immediate effect, full audit trail of who disabled what and when.',
        '?? If you discovered an AI agent was compromised right now, how long would it take to revoke ALL of its access across ALL systems? Minutes, hours, or days? With Okta, the answer is seconds — disable the app, revoke the token, done.',
      ],
    },
  ],
};
