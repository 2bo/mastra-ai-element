import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';
import { loadPromptFromLangfuse } from '../prompts/langfuse-prompt-loader';

/**
 * Langfuse Managed Agent
 *
 * Langfuseで管理されたプロンプトを実行時に取得し、エージェントに適用するサンプルです。
 *
 * 環境変数:
 * - LANGFUSE_PUBLIC_KEY: Langfuse APIキー（公開鍵）
 * - LANGFUSE_SECRET_KEY: Langfuse APIキー（秘密鍵）
 * - LANGFUSE_BASE_URL: Langfuseエンドポイント（例: http://localhost:3001）
 * - LANGFUSE_AGENT_PROMPT_NAME: プロンプト名（デフォルト: "mastra.langfuse.sample.system"）
 * - LANGFUSE_AGENT_PROMPT_LABEL: プロンプトラベル（デフォルト: "production"）
 *
 * Langfuse側で設定可能な変数（Mustache形式）:
 * - {{tone}}: 応答のトーン（例: "friendly", "professional", "casual"）
 * - {{channel}}: 利用チャネル（例: "web", "mobile", "api"）
 *
 * 機能:
 * - Langfuseからプロンプトを取得
 * - Mustache変数を環境変数から注入
 * - Langfuse側のmodelId設定があればそれを適用
 * - フォールバック処理（Langfuse接続失敗時）
 * - メタデータ記録（プロンプト名/バージョン/ラベル/ソース）
 */

// デフォルトのプロンプト（Langfuse接続失敗時のフォールバック）
const FALLBACK_PROMPT = `
You are a helpful AI assistant managed by Langfuse prompt system.

このエージェントは通常、Langfuseで管理されたプロンプトを使用しますが、
現在はフォールバックモードで動作しています。

Langfuseを有効にするには、以下の環境変数を設定してください：
- LANGFUSE_PUBLIC_KEY
- LANGFUSE_SECRET_KEY
- LANGFUSE_BASE_URL

また、Langfuse UIで以下のプロンプトを作成してください：
- プロンプト名: mastra.langfuse.sample.system（または環境変数 LANGFUSE_AGENT_PROMPT_NAME で指定）
- ラベル: production（または環境変数 LANGFUSE_AGENT_PROMPT_LABEL で指定）

それまでは基本的な会話アシスタントとして動作します。
`.trim();

// 環境変数からプロンプト設定を取得
const promptName =
  process.env.LANGFUSE_AGENT_PROMPT_NAME ?? 'mastra.langfuse.sample.system';
const promptLabel =
  process.env.LANGFUSE_AGENT_PROMPT_LABEL ?? 'production';

// Mustache変数の準備（環境変数から注入）
const variables = {
  tone: process.env.LANGFUSE_PROMPT_VAR_TONE ?? 'professional',
  channel: process.env.LANGFUSE_PROMPT_VAR_CHANNEL ?? 'web',
};

// Langfuseからプロンプトを取得
const promptResult = await loadPromptFromLangfuse(promptName, {
  label: promptLabel,
  variables,
  fallbackText: FALLBACK_PROMPT,
});

// ログ出力
console.log(
  `[Langfuse Agent] プロンプトをロードしました: ${promptResult.metadata.source}`,
);
if (promptResult.metadata.source === 'langfuse') {
  console.log(
    `  - プロンプト名: ${promptResult.metadata.promptName}`,
  );
  console.log(
    `  - バージョン: ${promptResult.metadata.promptVersion}`,
  );
  console.log(`  - ラベル: ${promptResult.metadata.promptLabel}`);
  if (promptResult.modelId) {
    console.log(`  - モデルID: ${promptResult.modelId}`);
  }
}

// モデルIDの決定（Langfuse側の設定 > デフォルト）
const modelId = promptResult.modelId ?? 'openai/gpt-4o-mini';

export const langfuseManagedAgent = new Agent({
  name: 'langfuseManagedAgent',
  instructions: promptResult.text,
  model: modelId,
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
});

// Langfuseメタデータ（トレーシングで参照可能）
// これらの情報はエージェント起動時にログ出力されます
export const langfuseAgentMetadata = {
  ...promptResult.metadata,
  variables,
};
