import type { SectionContent } from '../types';

export const content: SectionContent = {
  slug: 'ciba',
  title: 'CIBA (Human-in-the-Loop)',
  description:
    'Client-Initiated Backchannel Authentication — how Okta enables human approval gates for high-risk AI agent actions, satisfying EU AI Act oversight requirements.',
  tags: ['auth-flows', 'CIBA', 'human-in-loop', 'EU-AI-Act'],
  icon: '✋',
  hasDiagram: true,
  diagramPrompt:
    'Sequence diagram: AI Agent on left initiates backchannel auth request to Authorization Server in center. Server sends push notification to Human Approver on right. Approver approves or denies. Server issues or denies token to Agent. Blue and white palette, clean technical style.',
  cards: [
    {
      heading: 'What is CIBA?',
      paragraphs: [
        'CIBA (Client-Initiated Backchannel Authentication) is an OpenID Connect extension where the client (AI agent) initiates an authentication/authorization request, but the end user authenticates on a separate device. The agent does not need a browser — it makes a backchannel API call and waits.',
        'Three delivery modes: poll (agent polls the token endpoint), ping (server calls back the agent when approved), push (server pushes the token directly). The agent sends a login_hint identifying the approver and a binding_message describing the action requiring approval.',
        '!! CIBA is the technical mechanism that makes "human-in-the-loop" for AI agents real. Without it, agents must either proceed autonomously (risky) or pause and surface a UI approval (requires the user to be at a browser). CIBA decouples the agent\'s request from the human\'s approval device — the approver gets a push notification on Okta Verify, reviews the action, and approves or denies from their phone.',
        '?? For actions your AI agents can take that cannot be undone — wiring a payment, deleting a record, modifying production config — what is your approval mechanism today? Can you get async human approval without blocking the agent\'s execution thread?',
      ],
    },
    {
      heading: 'CIBA for AI Agent Scenarios',
      paragraphs: [
        'Financial trading: agent executes trades autonomously below a threshold. Above threshold, CIBA fires — the licensed trader gets a push notification with the instrument, quantity, price, and reason. They approve or deny from Okta Verify. The agent only receives the token (and can proceed) after approval. This satisfies SOX maker/checker requirements.',
        'Healthcare PHI access: agent processing a patient request needs to access medical records. CIBA triggers approval from the treating clinician before the agent can access PHI. Logged in Okta System Log as a CIBA authorization event — auditable under HIPAA.',
        'IT automation: helpdesk bot handles routine requests autonomously. For high-risk operations (account deprovisioning, privilege escalation), CIBA requires approval from an IT admin. Satisfies SOX ITGC separation of duties.',
        '!! CIBA is the direct answer to the EU AI Act Article 14 requirement for human oversight of high-risk AI systems. The Act requires that humans can "intervene on the functioning of the high-risk AI system or interrupt the system." CIBA implements this at the identity layer — no approval, no token, no action.',
      ],
    },
    {
      heading: 'SE Positioning',
      paragraphs: [
        'TT "Every enterprise deploying AI agents has a class of actions that should never happen without human approval. The question is how you implement that gate. CIBA means the agent requests approval via API, the human approves from their phone, and Okta issues the token only after approval. It\'s async, it\'s auditable, and it works without the user being at a browser."',
        '>> CIBA differentiates Okta from every competitor in the AI agent space. No other enterprise identity platform has a native backchannel auth flow purpose-built for agent approval gates. Entra has no equivalent. AWS IAM has no equivalent. Ping\'s new "Identity for AI" does not include backchannel approval.',
        '?? Which of your AI agent actions require human approval before execution? How do you implement that approval today — is it a code-level check, a Slack message, or nothing at all?',
      ],
    },
  ],
};
