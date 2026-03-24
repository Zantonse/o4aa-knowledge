# O4AA Knowledge Hub

Internal SE reference app covering Okta for AI Agents — products, protocols, auth flows, security, and the MCP adapter. 11 curated sections with AI-generated diagrams and a live Q&A bar backed by Okta dev docs.

**Audience:** Okta Sales Engineers
**Live:** https://o4aa-knowledge.vercel.app (requires disabling Vercel Authentication — see Deploy)

---

## What's Inside

| Section | What it covers |
|---|---|
| AI Agents 101 | What AI agents are, why auth is uniquely hard |
| Agent Identity | Machine identity vs. delegated identity, principal hierarchy |
| O4AA Product Suite | Auth for GenAI, FGA, Token Vault, Scoped Tokens |
| MCP Adapter `NEW` | Okta's auth layer for Model Context Protocol tool calls |
| MCP Bridge `NEW` | HTTP/SSE transport layer between MCP clients and servers |
| On-Behalf-Of (OBO) | RFC 8693 token exchange, step-by-step, SE positioning |
| ID-JAG Protocol | Emerging agent identity standard, provenance chains |
| Audit & Reporting | System Log for agent actions, SIEM integration, compliance |
| Security | Confused deputy, prompt injection, minimal privilege |
| Why Okta | Differentiators, objection handling, top discovery questions |
| Glossary | MCP, OBO, FGA, token vault, ID-JAG and more |

Each section has a diagram (regeneratable on demand) and feeds into the sticky AI Q&A bar at the bottom of the screen.

---

## Local Development

```bash
# 1. Install dependencies
npm install

# 2. Copy environment variables
cp .env.local.example .env.local
# Fill in LITELLM_API_KEY and FIRECRAWL_API_KEY

# 3. Start dev server
npm run dev
# → http://localhost:3000
```

### Environment Variables

| Variable | Description |
|---|---|
| `LITELLM_API_URL` | LiteLLM proxy URL (default: `https://llm.atko.ai`) |
| `LITELLM_API_KEY` | Virtual key from the proxy |
| `CLAUDE_MODEL` | Chat model (default: `claude-4-6-sonnet`) |
| `GEMINI_MODEL` | Image generation model (default: `titan-image-generator-v2`) |
| `FIRECRAWL_API_KEY` | For live doc lookup in the AI Q&A bar. Optional — Q&A still works without it, just without live doc grounding. |

---

## Updating Content

All section content lives in `lib/content/<slug>.ts`. Each file exports a `SectionContent` object.

### Editing an existing section

Open `lib/content/mcp-adapter.ts` (or any slug) and edit the `cards` array. Each card has:

```typescript
{
  heading: string;       // displayed in uppercase as the card label
  paragraphs: string[];  // plain text — each string becomes a <p> tag
}
```

**No HTML in `paragraphs`.** Use plain text only — line breaks between strings, not `<br>`.

### Adding a new section

1. Create `lib/content/your-slug.ts` following the shape of any existing file
2. Add the export to `lib/content/index.ts` — both the import and the `CONTENT_MAP` entry
3. Add the nav item to `lib/sections.ts` under the appropriate `NAV_GROUPS` group
4. Regenerate assets (see below)

### Updating the diagram prompt

Each `SectionContent` has a `diagramPrompt: string` field. Edit it, then click "Regenerate ✦" on that section's diagram card in the browser to get a new image.

**Note:** Keep prompts abstract (avoid brand names) — the image model (AWS Titan) has content filters that block specific brand references.

---

## Regenerating Icons and Diagrams

Assets are pre-generated PNGs in `public/icons/` and `public/diagrams/`. To regenerate all:

```bash
npm run generate-assets
```

To regenerate a specific diagram without running the full script, click "Regenerate ✦" on the diagram card in the app.

**Image model:** The proxy at `llm.atko.ai` uses `titan-image-generator-v2`. To see available models:
```bash
curl https://llm.atko.ai/v1/models -H "Authorization: Bearer <key>" | python3 -m json.tool | grep '"id"'
```

---

## AI Q&A Bar

The sticky bar at the bottom of every section sends questions to `/api/chat`, which:

1. Includes the current section's content as grounding context
2. Optionally searches `developer.okta.com` and `help.okta.com` via Firecrawl
3. Streams the response using `claude-4-6-sonnet` via LiteLLM proxy

**Source toggles:** The `dev docs` and `help docs` pills control which sites are searched. Both are on by default. Firecrawl lookup is silently skipped if `FIRECRAWL_API_KEY` is empty.

---

## Deploying

```bash
# Deploy to production
vercel --prod
```

**Vercel Authentication:** The `okta-solutions-engineering` org has Vercel Authentication enabled by default, which requires a Vercel login to view the site. To make it accessible without login:

1. Go to the Vercel dashboard → `o4aa-knowledge` project
2. Settings → Deployment Protection
3. Set to "No Protection" or allowlist the domains you want

**Environment variables in Vercel:** Set via the dashboard or CLI:
```bash
vercel env add LITELLM_API_KEY production
vercel env add FIRECRAWL_API_KEY production
# etc.
```

---

## Project Structure

```
lib/
  types.ts              # SectionContent, ContentCardData, NavGroup types
  sections.ts           # NAV_GROUPS — sidebar structure
  content/
    index.ts            # CONTENT_MAP — all 11 sections
    *.ts                # one file per section

components/
  Sidebar.tsx           # grouped nav with active state
  SectionPage.tsx       # section header + content cards
  ContentCard.tsx       # individual text card
  DiagramCard.tsx       # diagram image + regenerate button
  AiBar.tsx             # sticky Q&A bar

app/
  layout.tsx            # topbar + sidebar + AI bar
  section/[slug]/       # section detail page
  api/chat/             # streaming LLM + firecrawl
  api/generate-diagram/ # on-demand image gen

public/
  icons/                # section icons (PNG)
  diagrams/             # section diagrams (PNG)
```

---

## Related

- [o4aa-discovery](../o4aa-discovery/) — AI-powered discovery question planner for O4AA deals
- [Okta for AI Agents docs](https://developer.okta.com/docs/concepts/okta-for-ai-agents/)
- [RFC 8693 (Token Exchange)](https://www.rfc-editor.org/rfc/rfc8693)
