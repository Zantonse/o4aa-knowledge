import type { NavGroup } from './types';

export const NAV_GROUPS: NavGroup[] = [
  {
    groupLabel: 'Foundations',
    items: [
      { slug: 'ai-agents-101', label: 'AI Agents 101', icon: '🤖' },
      { slug: 'agent-identity', label: 'Agent Identity', icon: '👤' },
      { slug: 'mcp-protocol', label: 'MCP Protocol', icon: '📡', isNew: true },
    ],
  },
  {
    groupLabel: 'Okta Products',
    items: [
      { slug: 'o4aa-products', label: 'O4AA Product Suite', icon: '🔐' },
      { slug: 'mcp-adapter', label: 'MCP Adapter & Server', icon: '🔌' },
      { slug: 'mcp-bridge', label: 'MCP Bridge', icon: '🌉' },
    ],
  },
  {
    groupLabel: 'Auth Flows',
    items: [
      { slug: 'obo-flow', label: 'On-Behalf-Of (OBO)', icon: '🔄' },
      { slug: 'id-jag', label: 'ID-JAG Protocol', icon: '🪪' },
      { slug: 'xaa-deep-dive', label: 'XAA Deep Dive', icon: '🔗', isNew: true },
    ],
  },
  {
    groupLabel: 'Operations',
    items: [
      { slug: 'audit-reporting', label: 'Audit & Reporting', icon: '📊' },
      { slug: 'security', label: 'Security', icon: '🛡️' },
      { slug: 'compliance', label: 'Industry Compliance', icon: '⚖️', isNew: true },
    ],
  },
  {
    groupLabel: 'SE Playbook',
    items: [
      { slug: 'business-outcomes', label: 'Business Outcomes', icon: '📈', isNew: true },
      { slug: 'use-case-patterns', label: 'Use Case Patterns', icon: '🎯', isNew: true },
      { slug: 'competitive', label: 'Competitive Intel', icon: '🏁', isNew: true },
    ],
  },
  {
    groupLabel: 'Reference',
    items: [
      { slug: 'why-okta', label: 'Why Okta', icon: '⚡' },
      { slug: 'glossary', label: 'Glossary', icon: '📖' },
    ],
  },
];

export const ALL_SLUGS = NAV_GROUPS.flatMap(g => g.items.map(i => i.slug));

export const SLUG_MAP = Object.fromEntries(
  NAV_GROUPS.flatMap(g => g.items.map(i => [i.slug, i]))
) as Record<string, NavGroup['items'][number]>;
