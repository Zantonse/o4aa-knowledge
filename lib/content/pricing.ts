import type { SectionContent } from '../types';

const slug = 'pricing';
const title = 'Pricing & Packaging';
const description = 'What SEs need to know about O4AA commercial packaging — what is included, what requires add-ons, and how to position pricing in deals.';
const tags = ['reference', 'pricing', 'packaging', 'SKU', 'commercial'];
const icon = '💰';
const hasDiagram = false;
const diagramPrompt = '';

const cards = [
  {
    heading: 'O4AA Commercial Landscape',
    paragraphs: [
      '!! Important: O4AA is not a single named SKU. It is a set of capabilities distributed across Okta Workforce Identity Cloud (WIC) and Auth0 (OCI). SEs must understand which capabilities come from which product surface to avoid promising features that require a different license.',
      '>> WIC capabilities: OBO Token Exchange (RFC 8693) — included in WIC (OIE), Cross App Access (XAA) — currently Early Access (no additional cost during EA), System Log audit events — included, CIBA — requires confirmation on tier availability, Universal Directory for NHI registration — included, OIG for access reviews — separate WIC add-on.',
      '>> Auth0/OCI capabilities: Auth0 FGA (Fine Grained Authorization) — separate Auth0 managed service at dashboard.fga.dev, requires Auth0 account. M2M token issuance — Auth0 pricing scales with token volume. For WIC-only accounts that need FGA: discuss co-term or cross-sell path with your account team.',
    ],
  },
  {
    heading: 'Agent Gateway Engagement Model',
    paragraphs: [
      'The Agent Gateway (GA April 30, 2026) is currently delivered as a ProServ engagement, not a self-service product. The delivery includes: architecture workshop, tenant configuration, Docker bundle deployment, admin training, and handoff documentation. Position this in deals as a professional services engagement alongside the platform license.',
      '!! Do not position the Agent Gateway as a self-service SaaS product — it is ProServ-delivered in its current form. Misrepresenting the delivery model creates deal friction and customer disappointment. When a customer asks "can we just turn it on?", the honest answer is "it\'s a guided deployment with our professional services team."',
      '?? Is the customer prepared for a ProServ engagement? Do they have the infrastructure (AWS EC2, Docker) and engineering resources to support the deployment? What is their timeline?',
    ],
  },
  {
    heading: 'Competitive Pricing Context',
    paragraphs: [
      'Microsoft Entra Workload Identity Premium: $3/workload identity/month for Conditional Access and risk detection on service principals. This is the most directly comparable competitive price point. Note: this covers only workload CA — not OBO, not FGA, not agent-specific audit, not MCP support.',
      '>> Okta\'s value framing: the comparison is not "Okta vs. Entra per-identity cost" but "integrated agent identity platform vs. assembling pieces from multiple vendors." The TCO of building custom token exchange + FGA + Privileged Credential Management + audit + MCP auth across multiple tools always exceeds the cost of an integrated platform. Frame pricing conversations around total cost of ownership, not per-unit pricing.',
      'TT "The question isn\'t what does Okta cost per agent — it\'s what does it cost your engineering team to build and maintain agent auth across 10 backend systems, keep it secure, and pass your next audit. That\'s the real comparison."',
    ],
  },
  {
    heading: 'Key Packaging Questions for Deals',
    paragraphs: [
      '?? Is the customer WIC-only, Auth0-only, or both? This determines which O4AA capabilities they can access natively vs. what requires cross-sell.',
      '?? Does the customer need FGA? If yes and they\'re WIC-only, engage your Auth0 sales counterpart early — don\'t discover this gap during POC.',
      '?? What is the customer\'s AI agent scale? Number of agents, number of backend integrations, expected tool call volume — this sizes the engagement and identifies whether M2M token volume pricing (Auth0) is a factor.',
    ],
  },
];

export const content: SectionContent = { slug, title, description, tags, icon, hasDiagram, diagramPrompt, cards };
