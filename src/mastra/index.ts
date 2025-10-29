import { Mastra } from '@mastra/core/mastra';
import { PinoLogger } from '@mastra/loggers';
import { LibSQLStore } from '@mastra/libsql';
import { weatherWorkflow } from './workflows/weather-workflow';
import { financialAnalystAgent } from './agents/financial-analyst-agent';
import { codeReviewAgent } from './agents/code-review-agent';
import { travelPlanningAgent } from './agents/travel-planning-agent';
import {
  toolCallAppropriatenessScorer,
  completenessScorer,
  translationScorer,
} from './scorers/weather-scorer';

// Create Mastra instance with explicit typing
const createMastra = () => {
  return new Mastra({
    workflows: { weatherWorkflow },
    agents: {
      financialAnalystAgent,
      codeReviewAgent,
      travelPlanningAgent,
    },
    scorers: {
      toolCallAppropriatenessScorer,
      completenessScorer,
      translationScorer,
    },
    storage: new LibSQLStore({
      // stores observability, scores, ... into memory storage, if it needs to persist, change to file:../mastra.db
      url: ':memory:',
    }),
    logger: new PinoLogger({
      name: 'Mastra',
      level: 'info',
    }),
    telemetry: {
      // Telemetry is deprecated and will be removed in the Nov 4th release
      enabled: false,
    },
    observability: {
      // Enables DefaultExporter and CloudExporter for AI tracing
      // Disabled to prevent "AI Tracing instance already registered" error in dev mode
      default: { enabled: false },
    },
  });
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
