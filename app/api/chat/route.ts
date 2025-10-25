import { mastra } from '@/src/mastra';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    const weatherAgent = mastra.getAgent('weatherAgent');

    if (!weatherAgent) {
      return new Response('Weather agent not found', { status: 500 });
    }

    const stream = await weatherAgent.stream(messages, {
      format: 'aisdk',
    });

    return stream.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Error in chat route:', error);
    return new Response('Internal server error', { status: 500 });
  }
}
