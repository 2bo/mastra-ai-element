import { LangfuseClient } from '@langfuse/client';

/**
 * Langfuseプロンプト取得結果
 */
export interface PromptResult {
  /** レンダリングされたプロンプト文字列 */
  text: string;
  /** 使用するモデルID（Langfuse側のconfigから取得、無ければundefined） */
  modelId?: string;
  /** メタデータ（プロンプト名、バージョン、ラベル、ソース） */
  metadata: {
    promptName: string;
    promptVersion?: number;
    promptLabel?: string;
    source: 'langfuse' | 'fallback';
    json?: string;
    [key: string]: unknown;
  };
}

/**
 * Langfuseからプロンプトを取得し、変数をバインドする
 *
 * @param promptName - Langfuseで管理されているプロンプト名
 * @param options - 取得オプション
 * @param options.label - プロンプトのラベル（例: "production", "staging"）
 * @param options.version - プロンプトのバージョン（ラベルとは排他）
 * @param options.variables - Mustache変数に注入する値
 * @param options.fallbackText - Langfuse接続失敗時のフォールバックテキスト
 * @returns プロンプト取得結果
 */
export async function loadPromptFromLangfuse(
  promptName: string,
  options: {
    label?: string;
    version?: number;
    variables?: Record<string, string>;
    fallbackText?: string;
  } = {},
): Promise<PromptResult> {
  const {
    label,
    version,
    variables = {},
    fallbackText = 'You are a helpful AI assistant.',
  } = options;

  // Langfuse環境変数チェック
  const hasLangfuseConfig =
    process.env.LANGFUSE_PUBLIC_KEY &&
    process.env.LANGFUSE_SECRET_KEY &&
    process.env.LANGFUSE_BASE_URL;

  if (!hasLangfuseConfig) {
    console.warn(
      '[Langfuse] 環境変数が設定されていません。フォールバックを使用します。',
    );
    return {
      text: fallbackText,
      metadata: {
        promptName,
        source: 'fallback',
        reason: 'missing_env_vars',
      },
    };
  }

  try {
    const langfuseClient = new LangfuseClient({
      publicKey: process.env.LANGFUSE_PUBLIC_KEY,
      secretKey: process.env.LANGFUSE_SECRET_KEY,
      baseUrl: process.env.LANGFUSE_BASE_URL,
    });

    // プロンプト取得（ラベルまたはバージョン指定）
    const promptResponse = await langfuseClient.prompt.get(promptName, {
      label,
      version,
    });

    // プロンプトテキストの取得（prompt フィールド）
    const rawPrompt = promptResponse.prompt;
    let promptText =
      typeof rawPrompt === 'string'
        ? rawPrompt
        : JSON.stringify(rawPrompt);

    // 変数バインド（Mustache変数を置換）
    try {
      const compiled = promptResponse.compile(variables);
      promptText =
        typeof compiled === 'string'
          ? compiled
          : JSON.stringify(compiled);
    } catch (error) {
      console.warn(
        '[Langfuse] 変数コンパイルに失敗しました。生のプロンプトを使用します。',
        error,
      );
      if (typeof rawPrompt === 'string') {
        // compileが失敗した場合のみ簡易的に置換
        let fallbackTextWithVars = rawPrompt;
        for (const [key, value] of Object.entries(variables)) {
          fallbackTextWithVars = fallbackTextWithVars.replace(
            new RegExp(`\\{\\{${key}\\}\\}`, 'g'),
            value,
          );
        }
        promptText = fallbackTextWithVars;
      }
    }

    // モデルIDの取得（config.model または config.modelId）
    const config = promptResponse.config as
      | { model?: string; modelId?: string; [key: string]: unknown }
      | undefined;
    const modelId = config?.model ?? config?.modelId;

    return {
      text: promptText,
      modelId: typeof modelId === 'string' ? modelId : undefined,
      metadata: {
        promptName,
        promptVersion: promptResponse.version as number | undefined,
        promptLabel: label,
        source: 'langfuse',
        config,
        json: promptResponse.toJSON(),
      },
    };
  } catch (error) {
    console.error(
      '[Langfuse] プロンプト取得中にエラーが発生しました。フォールバックを使用します。',
      error,
    );
    return {
      text: fallbackText,
      metadata: {
        promptName,
        promptLabel: label,
        source: 'fallback',
        reason: 'fetch_error',
        error: error instanceof Error ? error.message : String(error),
      },
    };
  }
}
