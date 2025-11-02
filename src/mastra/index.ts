import { SamplingStrategyType } from '@mastra/core/ai-tracing';
import { Mastra } from '@mastra/core/mastra';
import { LangfuseExporter } from '@mastra/langfuse';
import { simpleTimezoneLangfuseAgent } from './agents/simple-timezone-langfuse-agent';

export const mastra = new Mastra({
  agents: { simpleTimezoneLangfuseAgent },
  observability: {
    configs: {
      langfuse: {
        serviceName: 'simple-timezone-demo',
        sampling: { type: SamplingStrategyType.ALWAYS },
        exporters: [
          new LangfuseExporter({
            publicKey: process.env.LANGFUSE_PUBLIC_KEY,
            secretKey: process.env.LANGFUSE_SECRET_KEY,
            baseUrl: process.env.LANGFUSE_BASE_URL,
            realtime: true,
          }),
        ],
      },
    },
  },
});
