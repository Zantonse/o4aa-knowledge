import type { SectionContent } from '../types';
import { content as aiAgents101 } from './ai-agents-101';
import { content as agentIdentity } from './agent-identity';

export const CONTENT_MAP: Record<string, SectionContent> = {
  'ai-agents-101': aiAgents101,
  'agent-identity': agentIdentity,
  // Additional sections added in Tasks 4–6
};
