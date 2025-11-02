import type { ModelMessage } from 'ai';
import { mastra } from '@/src/mastra';
import { langfuseAgentMetadata } from '@/src/mastra/agents/langfuse-managed-agent';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

type AgentName =
  | 'financialAnalystAgent'
  | 'codeReviewAgent'
  | 'travelPlanningAgent'
  | 'langfuseManagedAgent';

interface ChatRequestBody {
  messages: ModelMessage[];
  model?: string;
  agent?: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as ChatRequestBody;
    const {
      messages,
      model = 'gpt-4o-mini',
      agent: agentName = 'financialAnalystAgent',
    } = body;

    // Get the requested agent using type-safe approach
    const validAgentNames: AgentName[] = [
      'financialAnalystAgent',
      'codeReviewAgent',
      'travelPlanningAgent',
      'langfuseManagedAgent',
    ];
    const selectedAgentName: AgentName = validAgentNames.includes(
      agentName as AgentName
    )
      ? (agentName as AgentName)
      : 'financialAnalystAgent';

    if (agentName && !validAgentNames.includes(agentName as AgentName)) {
      console.warn(
        `Agent "${agentName}" not found, using financialAnalystAgent`
      );
    }

    const agent = mastra.getAgent(selectedAgentName);

    // Map UI model names to Mastra model format
    const modelMap: Record<string, string> = {
      'gpt-4o-mini': 'openai/gpt-4o-mini',
      'gpt-4o': 'openai/gpt-4o',
      'gpt-3.5-turbo': 'openai/gpt-3.5-turbo',
    };

    const mastraModel = modelMap[model] ?? 'openai/gpt-4o-mini';

    // Update agent's model dynamically
    agent.model = mastraModel;

    // Prepare tracing options with Langfuse prompt metadata (for langfuseManagedAgent)
    const tracingOptions =
      selectedAgentName === 'langfuseManagedAgent'
        ? {
            metadata: {
              promptName: langfuseAgentMetadata.promptName,
              promptVersion: langfuseAgentMetadata.promptVersion,
              promptLabel: langfuseAgentMetadata.promptLabel,
              promptSource: langfuseAgentMetadata.source,
              promptVariables: langfuseAgentMetadata.variables,
              langfusePrompt: langfuseAgentMetadata.json,
            },
          }
        : undefined;

    // Stream with the agent
    const stream = await agent.stream(messages, {
      format: 'aisdk',
      tracingOptions,
      telemetry: {
        isEnabled: true,
        metadata: {
          langfusePrompt: langfuseAgentMetadata.json ?? '{}',
        },
      },
    });

    return stream.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response(
      JSON.stringify({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
