# HANDOVER — O4AA Knowledge Hub

**Date:** 2026-03-25
**Branch:** main
**Latest commit:** cdb6357 `content: add Emerging Competitors card`
**Deploy:** https://o4aa-knowledge.vercel.app

---

## 1. Session Summary

Built the O4AA Knowledge Hub from scratch — a Next.js 16 internal SE reference app for Okta for AI Agents with 22 content sections across 7 sidebar groups, AI-generated icons/diagrams via Nano Banana Pro, a streaming AI Q&A bar backed by Claude via LiteLLM, rich paragraph formatting (callouts, discovery questions, highlights, talk tracks), and competitive intel from 12 vendor battlecards. Deployed to Vercel at `o4aa-knowledge.vercel.app`. Ran deep research with 5 parallel specialist agents identifying significant content gaps and product naming corrections that still need implementation.

---

## 2. What Got Done

### App Infrastructure
- Scaffolded Next.js 16.2.0 + React 19 + Tailwind v4 + TypeScript project
- DM Sans + JetBrains Mono fonts (Google Fonts via `<link>` in head — NOT CSS @import, which breaks Tailwind v4)
- Slate/Okta-blue color scheme matching `o4aa-discovery` sibling app
- Deployed to Vercel org `okta-solutions-engineering`
- GitHub: `github.com/Zantonse/o4aa-knowledge`

### 22 Content Sections (lib/content/*.ts)
| Group | Sections |
|---|---|
| Foundations | ai-agents-101, agent-identity, mcp-protocol |
| Okta Products | o4aa-products, mcp-adapter, mcp-bridge |
| Auth Flows | obo-flow, id-jag, xaa-deep-dive, ciba |
| Developer | nhi-management, integration-guides |
| Operations | audit-reporting, security, compliance |
| SE Playbook | demo-playbook, business-outcomes, use-case-patterns, competitive |
| Reference | why-okta, pricing, glossary |

### Rich Paragraph Types (ContentCard.tsx)
Content authors prefix paragraphs to trigger visual formatting:
- `>> ` = blue callout box
- `?? ` = amber discovery question
- `!! ` = blue highlight
- `TT ` = green talk track box
- No prefix = normal paragraph (auto-split into 2-3 sentence blocks)
- Labels detected automatically (e.g., "Step 1:", "okta-cross-app:")

### Visual Assets
- 22 section icons + 11 architecture diagrams generated via Nano Banana Pro (`gemini-3-pro-image-preview`)
- 4 competitive comparison diagrams (Entra, AWS, Ping, landscape quadrant) with per-card `image` field
- Batch manifest scripts in `scripts/`

### AI Q&A Bar
- Streaming chat via `/api/chat` → LiteLLM proxy (claude-4-6-sonnet)
- Firecrawl doc grounding for developer.okta.com and help.okta.com
- Context-aware: includes active section content in system prompt
- Source toggles (Dev/Help) with strikethrough when disabled

### Competitive Intel
- 12 battlecards in Obsidian: Entra, AWS IAM, CyberArk, Ping, SailPoint, Auth0, Astrix, Oasis, Aembit, Stytch, Descope, Silverfort
- Landscape summary: `Claude-Research/competitive-intel/landscape-2026-03.md`
- App section covers: Entra, AWS, Ping (with Identity for AI GA March 31), CyberArk/SailPoint, Market Landscape, Emerging Competitors

---

## 3. What Didn't Work / Bugs Encountered

- **Tailwind v4 CSS import order**: `@import url(...)` for Google Fonts MUST come before `@import "tailwindcss"` OR use `<link>` in HTML head. The CSS @import approach caused silent failures where the font import was placed after Tailwind's generated layers. **Fix**: moved to `<link>` tag in layout.tsx `<head>`.
- **ContentCard hover handlers**: adding `onMouseEnter`/`onMouseLeave` to ContentCard required `'use client'` directive — Server Components can't have event handlers. Build failed on Vercel until fixed.
- **AWS Titan content filter**: `titan-image-generator-v2` blocked prompts containing brand names ("Okta"). Fixed by simplifying diagram prompts to use generic terms. Later switched to `gemini-3-pro-image-preview` which doesn't have this issue.
- **LiteLLM rate limits**: batch generating 26 images at 5s delay hit 403s after ~15 images. Fixed by retrying failed manifest with 10s delay.
- **Vercel Authentication**: `okta-solutions-engineering` org has Vercel Auth enabled by default — returns 401. Must disable in Vercel Dashboard > Settings > Deployment Protection.

---

## 4. Key Decisions Made

- **Content as TypeScript data files** (not MDX/markdown): enables type safety, import-time validation, and the rich prefix system without a parser
- **`paragraphs: string[]`** instead of HTML body: eliminates XSS surface entirely, enables sentence-splitting at render time
- **Rich prefix system** (`>>`, `??`, `!!`, `TT`): zero data model change, detected at render time in ContentCard.tsx
- **Per-card `image?: string`** field: allows any card in any section to have an image, not just hasDiagram sections
- **Firecrawl for runtime doc lookup** (not context7 MCP): context7 is build-time only, firecrawl works as HTTP API from Next.js API routes
- **DM Sans + JetBrains Mono**: distinctive typography that avoids generic AI aesthetic

---

## 5. Lessons Learned / Gotchas

- **Product names change fast**: "Auth for GenAI" → "Cross App Access (XAA)" → now the GA name is under the "Secure Agentic Enterprise" umbrella. "MCP Adapter" → "Agent Gateway". "Token Vault" → "Privileged Credential Management". Content needs a "last verified" date mechanism.
- **Okta's OBO implementation does NOT emit the RFC 8693 `act` claim** — the token has `cid` + `sub` but no nested actor object. This caught the content review.
- **Auth0 FGA is Auth0-branded**, not WIC — accessed at `dashboard.fga.dev` with an Auth0 account. WIC-only customers need cross-sell path.
- **XAA is self-service Early Access** — must enable via Admin Console > Settings > Features > Early Access before any catalog entries appear.
- **The Okta MCP Server** (`okta/okta-mcp-server`) is a tenant management tool, NOT the Agent Gateway. Completely different products.

---

## 6. Current State

- **Build:** Clean (`npm run build` passes, `tsc --noEmit` clean)
- **Deploy:** Live at https://o4aa-knowledge.vercel.app (may need Vercel Auth disabled)
- **Uncommitted:** Only `scripts/assets-manifest-failed.json` (untracked, can be gitignored)
- **Branch:** main
- **22 sections, 7 groups, all with rich formatting**

---

## 7. Clear Next Steps — PRIORITY ORDER

### Critical: Product Name Update (AGAIN)
Deep research revealed the names changed AGAIN in March 2026 announcements:
- **"MCP Adapter" → "Agent Gateway"** (GA April 30)
- **"Token Vault" → "Privileged Credential Management"** (GA April 30)
- **O4AA goes GA April 30, 2026** — update all "Upcoming" badges

Files to update: `mcp-adapter.ts`, `mcp-bridge.ts`, `o4aa-products.ts`, `glossary.ts`, `business-outcomes.ts`, `why-okta.ts`, `competitive.ts`, `sections.ts` (sidebar labels)

### New Sections to Add (from deep research)
1. **Secure Agentic Enterprise Blueprint** — the 3-pillar framework (Where/What connect/What do)
2. **Regulatory Timeline** — NIST April 2, O4AA GA April 30, Colorado June 30, EU AI Act August 2
3. **CSA Agentic Trust Framework** — 5 autonomy levels with identity controls
4. **Token Exchange Performance Sizing** — capacity formulas, TTL guides, CAEP
5. **OWASP Agentic Top 10** — distinct from LLM Top 10, 7 identity-critical risks
6. **POC Failure Modes** — 5 field-validated patterns

### Content Enrichment
- Add Cisco (RSA March 23) to competitive section
- Add Project Odin (Okta's own internal agent) as a reference story
- Add Air Canada case law to compliance/legal section
- Add Shadow AI stats ($670K/incident, 45.6% shared API keys)
- Update compliance.ts with NIST CAISI, OWASP Agentic Top 10, ISO 42001
- Update framework ecosystem data in integration-guides.ts

### Research Outputs (saved to Obsidian, ready to incorporate)
- `Claude-Research/competitive-intel/` — 12 battlecard files + landscape
- `Claude-Research/MCP-Auth-Gap-Research.md`
- `Claude-Research/AI-Agent-Auth-Competitive-Intel-2026.md`
- `Claude-Research/okta-platform/ai-agent-deployment-patterns-se-discovery-2026-03.md`
- `Claude-Research/okta-platform/se-enablement-gaps-ai-agent-identity-2026-03.md`
- `Claude-Research/o4aa/architect-level-technical-depth.md`
- `Claude-Research/o4aa/emerging-ai-agent-regulations-2026.md`
- `Claude-Research/o4aa-framework-ecosystem.md`

---

## 8. Important Files Map

| File | Description |
|---|---|
| `lib/types.ts` | ContentCardData (with optional `image` field), SectionContent, NavGroup types |
| `lib/sections.ts` | NAV_GROUPS — 7 groups, 22 sections, sidebar structure |
| `lib/content/index.ts` | CONTENT_MAP barrel — all 22 section imports |
| `lib/content/*.ts` | One file per section — each exports `const content: SectionContent` |
| `components/ContentCard.tsx` | Rich paragraph renderer — detects `>>`, `??`, `!!`, `TT` prefixes + auto-splits long paragraphs |
| `components/SectionPage.tsx` | Section layout — header, divider, staggered card entrance, per-card images |
| `components/AiBar.tsx` | Streaming Q&A — firecrawl grounding, source toggles, markdown response rendering |
| `components/Sidebar.tsx` | 240px sidebar — grouped nav, active scroll-into-view, hover states |
| `components/DiagramCard.tsx` | Static diagram display (regenerate button removed) |
| `app/layout.tsx` | Root layout — topbar, sidebar, AI bar, Google Fonts link |
| `app/globals.css` | Tailwind v4 — @layer base resets, card-enter animation, shimmer, stream-pulse |
| `app/api/chat/route.ts` | Streaming LLM + firecrawl doc grounding |
| `app/api/generate-diagram/route.ts` | On-demand Gemini image gen (still functional but button removed from UI) |
| `scripts/assets-manifest.json` | Batch manifest for all 22 section icons + diagrams |
| `scripts/generate-assets.ts` | Node script for batch icon/diagram generation |
| `.env.local` | LITELLM_API_URL, LITELLM_API_KEY, CLAUDE_MODEL, GEMINI_MODEL, FIRECRAWL_API_KEY |
| `docs/superpowers/specs/2026-03-23-o4aa-knowledge-hub-design.md` | Original design spec |
| `docs/superpowers/plans/2026-03-23-o4aa-knowledge-hub.md` | Original 16-task implementation plan |
