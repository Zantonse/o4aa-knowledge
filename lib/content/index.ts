import type { SectionContent } from '../types';
import { content as aiAgents101 } from './ai-agents-101';
import { content as agentIdentity } from './agent-identity';
import { content as mcpProtocol } from './mcp-protocol';
import { content as o4aaProducts } from './o4aa-products';
import { content as mcpAdapter } from './mcp-adapter';
import { content as mcpBridge } from './mcp-bridge';
import { content as oboFlow } from './obo-flow';
import { content as idJag } from './id-jag';
import { content as xaaDeepDive } from './xaa-deep-dive';
import { content as auditReporting } from './audit-reporting';
import { content as security } from './security';
import { content as compliance } from './compliance';
import { content as businessOutcomes } from './business-outcomes';
import { content as useCasePatterns } from './use-case-patterns';
import { content as competitive } from './competitive';
import { content as whyOkta } from './why-okta';
import { content as glossary } from './glossary';

export const CONTENT_MAP: Record<string, SectionContent> = {
  'ai-agents-101': aiAgents101,
  'agent-identity': agentIdentity,
  'mcp-protocol': mcpProtocol,
  'o4aa-products': o4aaProducts,
  'mcp-adapter': mcpAdapter,
  'mcp-bridge': mcpBridge,
  'obo-flow': oboFlow,
  'id-jag': idJag,
  'xaa-deep-dive': xaaDeepDive,
  'audit-reporting': auditReporting,
  'security': security,
  'compliance': compliance,
  'business-outcomes': businessOutcomes,
  'use-case-patterns': useCasePatterns,
  'competitive': competitive,
  'why-okta': whyOkta,
  'glossary': glossary,
};
