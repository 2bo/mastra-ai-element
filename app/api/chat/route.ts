import { mastra } from '@/src/mastra';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

interface Message {
  role: string;
  content: string;
}

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { messages: Message[] };
    const { messages } = body;

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
