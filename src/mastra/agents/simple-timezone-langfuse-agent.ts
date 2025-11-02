/**
 * Simple Timezone Agent with Langfuse Integration
 *
 * このファイルは、MastraとLangfuseを統合した極めてシンプルなサンプル実装です。
 * テックブログ掲載用に1ファイルで完結させています。
 *
 * 機能:
 * - Langfuseでプロンプトをバージョン管理
 * - Mustache変数によるプロンプトのカスタマイズ（{{tone}}）
 * - tracingOptionsでLangfuseメタデータを自動送信
 * - timezoneMapToolをインライン定義（都市の現在時刻取得）
 *
 * 環境変数:
 * - LANGFUSE_PUBLIC_KEY: Langfuse公開鍵
 * - LANGFUSE_SECRET_KEY: Langfuse秘密鍵
 * - LANGFUSE_BASE_URL: LangfuseエンドポイントURL
 * - OPENAI_API_KEY: OpenAI APIキー
 * - TIMEZONE_AGENT_TONE: エージェントのトーン（デフォルト: "friendly"）
 *
 * Langfuse設定:
 * 1. Langfuse UIで "Simple Timezone Agent" というプロンプトを作成
 * 2. プロンプトに変数を埋め込む（例: "You are a {{tone}} timezone assistant."）
 * 3. config.modelId に使用するモデル名を設定（例: "gpt-4o-mini"）
 * 4. ラベル "production" を付与
 */

import { openai } from '@ai-sdk/openai';
import { LangfuseClient } from '@langfuse/client';
import { Agent } from '@mastra/core/agent';
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

// ===================================================================
// Current Time Tool (インライン定義)
// ===================================================================

const timezoneMapTool = createTool({
  id: 'get-timezone',
  description: 'Get current time for a city',
  inputSchema: z.object({
    city: z
      .string()
      .describe('City name (e.g., "Tokyo", "New York", "London")'),
  }),
  outputSchema: z.object({
    currentTime: z.string(),
  }),
  // eslint-disable-next-line @typescript-eslint/require-await
  execute: async () => {
    // デモ用の簡易実装: 都市に関係なくシステムの現在時刻を返す
    const systemTimezone =
      Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    const currentTime = new Date().toLocaleString('en-US', {
      timeZone: systemTimezone,
      dateStyle: 'full',
      timeStyle: 'long',
    });

    return {
      currentTime,
    };
  },
});

// ===================================================================
// Langfuse Integration
// ===================================================================

// Langfuse Client初期化（SDKが自動的にフォールバック処理を行う）
const langfuseClient = new LangfuseClient({
  publicKey: process.env.LANGFUSE_PUBLIC_KEY,
  secretKey: process.env.LANGFUSE_SECRET_KEY,
  baseUrl: process.env.LANGFUSE_BASE_URL,
});

// デフォルトプロンプト（Langfuse未設定時のフォールバック）
// 変数: {{tone}}
const DEFAULT_INSTRUCTIONS = `You are a {{tone}} timezone assistant.
Help users find current times in different cities around the world using the timezoneMapTool.
Provide clear and helpful responses with time zone information.`;

// プロンプト変数（環境変数またはデフォルト値）
const promptVariables = {
  tone: process.env.TIMEZONE_AGENT_TONE ?? 'friendly',
};

// プロンプト取得（SDKのネイティブfallback機能を使用）
const prompt = await langfuseClient.prompt.get('Simple-Timezone-Agent', {
  label: 'production',
  fallback: DEFAULT_INSTRUCTIONS,
});

// 変数バインド（Mustache変数を置換）
const instructions = prompt.compile(promptVariables);

// モデルID取得（プロンプト設定から、なければデフォルト）
const config = prompt.config as { modelId?: string } | undefined;
const modelId = config?.modelId ?? 'gpt-4.1-nano';

// ===================================================================
// Agent Definition
// ===================================================================

export const simpleTimezoneLangfuseAgent = new Agent({
  name: 'Simple Timezone Langfuse Agent',
  instructions,
  model: openai(modelId),
  tools: { timezoneMapTool },
  defaultVNextStreamOptions: {
    tracingOptions: {
      metadata: {
        langfusePrompt: prompt.toJSON(),
      },
    },
  },
});
