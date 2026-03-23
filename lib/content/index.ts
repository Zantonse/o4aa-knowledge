import type { SectionContent } from '../types';
import { content as aiAgents101 } from './ai-agents-101';
import { content as agentIdentity } from './agent-identity';
import { content as o4aaProducts } from './o4aa-products';
import { content as mcpAdapter } from './mcp-adapter';
import { content as mcpBridge } from './mcp-bridge';

export const CONTENT_MAP: Record<string, SectionContent> = {
  'ai-agents-101': aiAgents101,
  'agent-identity': agentIdentity,
  'o4aa-products': o4aaProducts,
  'mcp-adapter': mcpAdapter,
  'mcp-bridge': mcpBridge,
  // Additional sections added in Tasks 5–6
};
