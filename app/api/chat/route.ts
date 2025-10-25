import type { ModelMessage } from 'ai';
import { mastra } from '@/src/mastra';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages: ModelMessage[] };
    const { messages } = body;

    const weatherAgent = mastra.getAgent('weatherAgent');

    const stream = await weatherAgent.stream(messages, {
      format: 'aisdk',
    });

    return stream.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
