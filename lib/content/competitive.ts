import type { SectionContent } from '../types';

const slug = 'competitive';
const title = 'Competitive Intel';
const description = 'How Okta O4AA compares to Microsoft Entra, AWS IAM, Auth0, CyberArk, and Ping Identity for AI agent identity.';
const tags = ['competitive', 'microsoft', 'aws', 'auth0', 'cyberark', 'ping'];
const icon = '🏁';
const hasDiagram = false;
const diagramPrompt = '';

const cards = [
  {
    heading: 'Microsoft Entra',
    paragraphs: [
      'Entra covers the core workload identity primitives: service principals for application identities, managed identities for secretless Azure-native workloads, and workload identity federation for cross-cloud scenarios via OIDC. These are solid building blocks for Azure-centric deployments.',
      'Entra does support On-Behalf-Of (OBO) flow, but with a critical constraint: OBO only works when the originating token was issued by a user-initiated flow. Autonomous agents running on client credentials cannot produce OBO tokens that carry user identity. This is a fundamental architectural gap for agentic workloads where the human may have authorized an action hours before the agent executes it.',
      'Managed Identities are Azure-locked. An agent calling AWS, GCP, or any third-party API gets nothing from Managed Identities and must fall back to secrets or separate credential management. Multi-cloud agentic architectures are effectively second-class citizens.',
      'Entra has no Fine-Grained Authorization (FGA) — it offers RBAC only. There is no relationship graph for data-level permissions, no MCP adapter for agentic tool registration, and no token vault for scoped ephemeral credentials. Conditional Access for Workload Identities requires the premium SKU at $3 per identity per month, which scales unfavorably for high-volume agent deployments.',
      'Objection response: "Service principal tokens tell the API who the agent is but not who the user is. Entra OBO requires user-initiated flow and breaks for autonomous agents. Okta OBO Token Exchange works for both human-initiated and autonomous patterns."',
    ],
  },
  {
    heading: 'AWS IAM',
    paragraphs: [
      'AWS IAM is the right tool for authenticating agents to AWS services. IAM Roles for Compute automatically provision temporary credentials for EC2, Lambda, ECS, and SageMaker workloads with no secret management required. STS AssumeRole extends this with role chaining for cross-account and cross-service delegation. Within the AWS ecosystem, this is a well-solved problem.',
      'The user identity gap is the core issue. AWS Bedrock Agents assign a single IAM service role per agent. Every user request runs under the same role. CloudTrail logs the service role ARN, not the individual user who triggered the action. There is no native mechanism to propagate user identity through an agent chain, making per-user data access control and user-level audit trails impossible without custom engineering outside IAM.',
      'IAM is AWS-only. Agents that need to call Salesforce, ServiceNow, internal APIs, or any non-AWS endpoint must manage those credentials separately. In practice this means secrets stored in Secrets Manager or Parameter Store with custom retrieval logic — the zero-credential experience disappears the moment the agent leaves the AWS boundary.',
      'Objection response: "IAM roles authenticate your agent to AWS services. They cannot tell your non-AWS APIs which user authorized the action or enforce per-user data access. Okta handles the human-delegated identity layer that IAM was never designed for."',
    ],
  },
  {
    heading: 'Auth0 (Okta\'s Own Product)',
    paragraphs: [
      'Auth0 is the right choice for B2C and CIAM agent authentication — customer-facing agents where the end-users are consumers rather than enterprise workforce. Workforce Identity Cloud (WIC) is the correct product for enterprise and workforce agentic deployments. These products serve different markets and are not direct competitors within the Okta portfolio.',
      'Auth0 has strong M2M support via Client Credentials (GA and widely deployed) and supports RBAC and API permissions. Teams do use Auth0 Actions — custom code injected into token flows — to embed user context into agent tokens, but this is bespoke engineering on every deployment rather than a supported primitive. There is no RFC 8693 Token Exchange (no native OBO), no FGA, no Token Vault, and no MCP adapter.',
      'M2M token pricing in Auth0 scales with token volume. High-frequency agentic systems that generate many short-lived tokens per user session may encounter material cost increases at scale. This is a commercial consideration worth surfacing early in deals where Auth0 is already in use for agentic workloads.',
    ],
  },
  {
    heading: 'CyberArk and Ping Identity',
    paragraphs: [
      'CyberArk approaches agent identity from the secrets management angle. Conjur enables runtime secret retrieval so agents never store long-lived credentials at rest. Platform attestation via workload identity allows agents to prove their identity to Conjur without a bootstrapped secret. This is best-in-class for non-OAuth credentials — database passwords, API keys, legacy system tokens — that agents need for systems that do not support modern authorization flows.',
      'CyberArk is complementary to Okta, not competitive. CyberArk solves the storage and retrieval problem for the agent\'s own credentials. Okta solves the authorization model — which user delegated to the agent, what scope was granted, and the audit trail that ties agent actions back to human principals. Many enterprise deployments will use both. Objection response: "CyberArk solves where to store the agent\'s API keys. Okta solves the user delegation layer — which user authorized the agent, what scope, and the audit trail."',
      'Ping Identity covers two relevant products. PingFederate supports token exchange including OBO, but it requires significant expert policy configuration to implement correctly. PingAuthorize is an externalized authorization engine comparable in concept to Okta FGA, but it requires integration work to connect to agent workflows. There is no purpose-built AI agent product, no MCP adapter, and no token vault equivalent in the Ping portfolio.',
      'Ping\'s on-premises orientation is a structural disadvantage for cloud-native AI deployments. Organizations building on AWS, Azure, or GCP with managed AI services are adding operational overhead when they introduce an on-prem policy engine into the authorization path. Latency, availability, and operational complexity all increase.',
      'Objection response: "PingFederate can do token exchange, but you\'re looking at significant integration work to wire it with PingAuthorize into a coherent agent identity layer. Okta O4AA is purpose-built — OBO, FGA, and XAA are designed to work as a unit."',
    ],
  },
];

export const content: SectionContent = { slug, title, description, tags, icon, hasDiagram, diagramPrompt, cards };
