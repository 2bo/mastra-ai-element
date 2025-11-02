import { LangfuseExporter } from '@mastra/langfuse';

/**
 * Langfuse AI Tracing Exporterの生成
 *
 * Mastraの AI Tracing システムを使用してLangfuseにトレースデータを送信します。
 * 以下の情報が自動的に記録されます：
 * - エージェント実行
 * - モデル呼び出し（トークン数、レイテンシ）
 * - ツール実行
 * - メモリ操作
 * - エラーとリトライ
 *
 * 環境変数:
 * - LANGFUSE_PUBLIC_KEY: Langfuse公開鍵
 * - LANGFUSE_SECRET_KEY: Langfuse秘密鍵
 * - LANGFUSE_BASE_URL: LangfuseベースURL (例: http://localhost:3001)
 *
 * @returns LangfuseExporter インスタンス、または環境変数が設定されていない場合はnull
 */
export function createLangfuseExporter() {
  // Langfuse環境変数チェック
  const hasLangfuseConfig =
    process.env.LANGFUSE_PUBLIC_KEY &&
    process.env.LANGFUSE_SECRET_KEY &&
    process.env.LANGFUSE_BASE_URL;

  if (!hasLangfuseConfig) {
    console.warn(
      '[Langfuse] AI Tracing用の環境変数が設定されていません。トレーシングは無効です。',
    );
    return null;
  }

  try {
    const exporter = new LangfuseExporter({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL,
      realtime: true,
    });

    console.log('[Langfuse] AI Tracing Exporter initialized');
    console.log(`  - Base URL: ${process.env.LANGFUSE_BASE_URL}`);

    return exporter;
  } catch (error) {
    console.error(
      '[Langfuse] AI Tracing Exporterの初期化に失敗しました。トレーシングは無効です。',
      error,
    );
    return null;
  }
}
