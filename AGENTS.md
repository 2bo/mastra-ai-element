## プロジェクト概要

Mastra AIフレームワークを使用したNext.js天気チャットアプリケーション。天気情報を提供し、活動の提案を行うAIエージェントを実装しています。

## 開発コマンド

### Next.js アプリケーション
```bash
npm run dev          # 開発サーバー起動 (http://localhost:3000)
npm run build        # 本番ビルド
npm run start        # 本番サーバー起動
```

### Mastra CLI
```bash
npm run mastra:dev   # Mastraの開発モード
npm run mastra:build # Mastraのビルド
npm run mastra:start # Mastraサーバー起動
```

### コード品質
```bash
npm run typecheck    # TypeScript型チェック
npm run lint         # ESLintによるリンティング
npm run lint:fix     # ESLintエラーの自動修正
npm run format       # Prettierによるフォーマット
npm run format:check # フォーマットのチェックのみ
```

## アーキテクチャ

### Mastraコア構成 (`src/mastra/`)

プロジェクトのMastraインスタンスは`src/mastra/index.ts`で初期化され、以下のコンポーネントを統合:

- **Agents** (`agents/weather-agent.ts`): GPT-4o-miniをベースにした天気アシスタント。メモリ機能とスコアリングを統合
- **Tools** (`tools/weather-tool.ts`): Open-Meteo APIを使用した天気データ取得ツール
- **Workflows** (`workflows/weather-workflow.ts`): 天気取得と活動提案を組み合わせた2ステップワークフロー
- **Scorers** (`scorers/weather-scorer.ts`): ツール呼び出しの適切性、完全性、翻訳品質を評価する3つのスコアラー
- **Storage**: LibSQLStore (メモリストレージ、永続化には`file:../mastra.db`を使用)
- **Observability**: デフォルトエクスポーターが有効化されており、AIトレーシングを提供

### Next.js UI層 (`app/`)

- **API Route** (`api/chat/route.ts`): Mastra weatherAgentと統合し、AI SDKストリーミング応答を返す
- **メインページ** (`page.tsx`): `@ai-sdk/react`の`useChat`フックを使用したクライアントサイドチャットUI
- **コンポーネント** (`components/`): ChatMessage、ChatInput、ChatHeader、LoadingIndicator、EmptyStateなど再利用可能なUIコンポーネント

### データフロー

1. ユーザーが`app/page.tsx`でメッセージを送信
2. `@ai-sdk/react`の`useChat`が`/api/chat`にPOSTリクエスト
3. APIルートが`weatherAgent`を取得し、メッセージをストリーミング
4. エージェントは必要に応じて`weatherTool`を呼び出し、Open-Meteo APIから天気データを取得
5. ストリーミング応答がUIに返され、リアルタイムで表示
6. エージェントの相互作用はスコアラーによって評価され、observabilityストアに記録

## 重要な実装詳細

### 環境変数
`.env`ファイルが必要:
```
OPENAI_API_KEY=your-api-key
```

### TypeScript設定
- パスエイリアス: `@/*`は`./`にマップ
- ES2022ターゲット、strictモード有効
- bundlerモジュール解決

### スタイリング
- Tailwind CSS 4.x使用
- カスタムグラデーション: `bg-gradient-primary`と`text-primary`
- レスポンシブデザインで最大幅3xl

### Mastra Agent設定
- エージェントのメモリは`file:../mastra.db`に保存（`.mastra/output`ディレクトリ相対）
- 3つのスコアラーがすべて100%サンプリングレート（`ratio: 1`）で有効
- エージェントは英語以外の地名を翻訳するよう指示されている

### コード品質の自動化
PostToolUseフックが`.claude/settings.json`に設定されており、TypeScript/JavaScriptファイルの編集・作成時に自動的に`lint:fix`と`format`を実行

## 技術スタック
- **フレームワーク**: Next.js 16 (React 19)
- **AI**: Mastra Core 0.23.1, Vercel AI SDK
- **データベース**: LibSQL (メモリまたはファイルベース)
- **スタイリング**: Tailwind CSS 4
- **開発ツール**: TypeScript, ESLint, Prettier
- **Node.js**: >=20.9.0


## 言語
ユーザーとのやりとりは日本語でします。

