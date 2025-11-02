import { SamplingStrategyType } from '@mastra/core/ai-tracing';
import { Mastra } from '@mastra/core/mastra';
import { LibSQLStore } from '@mastra/libsql';
import { PinoLogger } from '@mastra/loggers';
import { codeReviewAgent } from './agents/code-review-agent';
import { financialAnalystAgent } from './agents/financial-analyst-agent';
import { langfuseManagedAgent } from './agents/langfuse-managed-agent';
import { simpleTimezoneLangfuseAgent } from './agents/simple-timezone-langfuse-agent';
import { travelPlanningAgent } from './agents/travel-planning-agent';
import { createLangfuseExporter } from './observability/langfuse';
import {
  completenessScorer,
  toolCallAppropriatenessScorer,
  translationScorer,
} from './scorers/weather-scorer';
import { weatherWorkflow } from './workflows/weather-workflow';

// Create Mastra instance with explicit typing
const createMastra = () => {
  // Initialize Langfuse AI Tracing Exporter (optional - only if env vars are set)
  const langfuseExporter = createLangfuseExporter();

  const baseConfig = {
    workflows: { weatherWorkflow },
    agents: {
      financialAnalystAgent,
      codeReviewAgent,
      travelPlanningAgent,
      langfuseManagedAgent,
      simpleTimezoneLangfuseAgent,
    },
    scorers: {
      toolCallAppropriatenessScorer,
      completenessScorer,
      translationScorer,
    },
    storage: new LibSQLStore({
      // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
      url: 'file:./mastra.db', // Storage
    }),
    logger: new PinoLogger({
      name: 'Mastra',
      level: 'info',
    }),
  };

  // Add Langfuse AI Tracing if available, otherwise disable observability
  if (langfuseExporter) {
    console.log('[Mastra] Langfuse AI Tracing enabled');

    return new Mastra({
      ...baseConfig,
      observability: {
        configs: {
          langfuse: {
            serviceName: 'mastra-langfuse-demo',
            sampling: { type: SamplingStrategyType.ALWAYS },
            exporters: [langfuseExporter],
          },
        },
      },
    });
  } else {
    // Fallback: disable observability if Langfuse is not available
    return new Mastra({
      ...baseConfig,
      observability: {
        default: { enabled: true },
      },
    });
  }
};

// Use a singleton pattern to prevent recreation on hot reload in dev mode
const globalForMastra = globalThis as unknown as {
  mastra: ReturnType<typeof createMastra> | undefined;
};

export const mastra = globalForMastra.mastra ?? createMastra();

// Store in globalThis to persist across hot reloads
if (process.env.NODE_ENV !== 'production') {
  globalForMastra.mastra = mastra;
}
