# Mastra AI Elements - Multi-Agent Chat Application

Mastra AI フレームワークと Next.js 15 を組み合わせた、複数の特化型 AI エージェントを活用するチャットアプリケーションです。Vercel AI SDK によるストリーミング応答、Mastra のエージェント設計、AI Elements コンポーネントによる UI 実装を確認できます。

## 特徴

### 3つの特化型エージェント

1. **Financial Analyst Agent** (財務分析エージェント)
   - 決算報告書（短信決算資料）の分析
   - 財務指標の抽出と評価
   - トレンド分析とリスク評価
   - GPT-4o の Vision 機能で PDF/画像からの情報抽出

2. **Code Review Agent** (コードレビューエージェント)
   - コード品質、セキュリティ、パフォーマンスの分析
   - ベストプラクティスの提案
   - リファクタリング推奨事項
   - 技術的負債の識別

3. **Travel Planning Agent** (旅行計画エージェント)
   - カスタム旅行ツールとの連携
   - 目的地の情報提供とアクティビティ提案
   - 予算見積もりと旅行計画
   - 東京、パリ、ニューヨークの詳細データ

### リッチな UI 機能

- **動的モデル選択**: GPT-4o-mini、GPT-4o、GPT-3.5-turbo の切り替え
- **エージェント切り替え**: ドロップダウンで簡単にエージェント選択
- **コマンドパレット**: `/` キーで素早くエージェントやコマンドにアクセス
- **ストリーミング応答**: リアルタイムでの AI 応答表示
- **ファイル添付**: 画像やドキュメントのアップロード対応
- **マークダウンレンダリング**: Streamdown によるリッチなテキスト表示

## 前提条件と初期設定

- Node.js 20.9.0 以上
- npm（Node.js 同梱）
- GPT-4o シリーズへアクセス可能な OpenAI API キー

ルートディレクトリに `.env` を作成し、以下を設定してください。

```ini
OPENAI_API_KEY=your-api-key

# Optional: Langfuse (LLM Observability & Prompt Management)
LANGFUSE_PUBLIC_KEY=pk-lf-...
LANGFUSE_SECRET_KEY=sk-lf-...
LANGFUSE_BASE_URL=http://localhost:3001
```

依存関係をインストールします。

```bash
npm install
```

### Langfuse ローカル環境のセットアップ（オプション）

LLM の観測（トレーシング）とプロンプト管理を行いたい場合、ローカルで Langfuse を実行できます。

```bash
cd langfuse
docker compose up -d       # Langfuse + PostgreSQL + Redis + ClickHouse + Garage を起動
./init-garage.sh          # Garage S3 ストレージを初期化（初回のみ）
```

Langfuse UI にアクセス: http://localhost:3001

**ログイン情報:**

- Email: `admin@example.com`
- Password: `langfuse/.env` の `LANGFUSE_INIT_USER_PASSWORD` を確認

**API キー:**
Settings → API Keys で表示される Public/Secret Key をプロジェクトルートの `.env` に追加してください。

詳細は [`langfuse/README.md`](./langfuse/README.md) を参照。

## 実行方法

### 開発時

```bash
npm run dev          # Next.js 開発サーバー (http://localhost:3000)
npm run mastra:dev   # Mastra CLI の開発モード（任意）
```

チャット UI は Next.js API Route を通じて Mastra Agent と通信します。基本的な動作確認は `npm run dev` のみで可能です。

### ビルドと本番想定

```bash
npm run build        # Next.js 本番ビルド
npm run start        # Next.js 本番サーバー起動

npm run mastra:build # Mastra プロジェクトのビルド
npm run mastra:start # Mastra サーバー起動（独立運用が必要な場合）
```

## コード品質ツール

```bash
npm run typecheck    # TypeScript 型チェック
npm run lint         # ESLint
npm run lint:fix     # ESLint 自動修正
npm run format       # Prettier フォーマット
npm run format:check # Prettier チェックのみ
```

`.claude/settings.json` の PostToolUse フックにより、TypeScript / JavaScript ファイルの編集時には自動で `lint:fix`、`format`、`typecheck` が走るよう設定されています。

## プロジェクト構成

```
app/                    Next.js App Router 層（UI + API）
  ├── page.tsx          メインチャット画面
  └── api/chat/         チャット API エンドポイント
components/             チャット UI / AI Elements ラッパー
  ├── chat/             チャット関連コンポーネント
  ├── ai-elements/      AI Elements ヘルパー
  └── ui/               Radix UI ベースの基礎コンポーネント
src/mastra/             Mastra 設定
  ├── agents/           エージェント定義
  │   ├── financial-analyst-agent.ts
  │   ├── code-review-agent.ts
  │   ├── travel-planning-agent.ts
  │   └── langfuse-managed-agent.ts   # Langfuse連携サンプル
  ├── prompts/          Langfuse連携などのプロンプト取得ロジック
  │   └── langfuse-prompt-loader.ts
  ├── tools/            カスタムツール
  │   └── travel-tool.ts
  ├── workflows/        ワークフロー定義
  ├── scorers/          スコアラー定義
  └── index.ts          Mastra インスタンス設定
```

### 主要コンポーネント

- **UI レイヤー (`app/` + `components/`)**
  - `app/page.tsx`: `useChat` と AI Elements を利用したチャット画面
  - `components/chat/chat-input.tsx`: エージェント選択、モデル選択、コマンドパレット
  - `components/chat/chat-conversation.tsx`: メッセージ一覧とストリーミング表示
  - `components/ai-elements`: Streamdown レンダリング、スクロール制御などのヘルパー

- **API レイヤー (`app/api/chat/route.ts`)**
  - 動的なエージェント選択とモデル切り替え
  - `toUIMessageStreamResponse()` で AI SDK 互換のストリーム返却
  - 型安全なエージェント取得とエラーハンドリング

- **Mastra レイヤー (`src/mastra/`)**
  - `index.ts`: シングルトンパターンによる Mastra インスタンス管理（HMR 対応）
  - `agents/`: 各エージェントの詳細な指示文とメモリ設定（`langfuse-managed-agent.ts` で Langfuse 連携サンプルを提供）
  - `prompts/langfuse-prompt-loader.ts`: Langfuse からプロンプトを取得して Mastra に差し込むヘルパー
  - `tools/travel-tool.ts`: Zod スキーマによる型安全なカスタムツール
  - LibSQL によるメモリ永続化とオブザーバビリティ

## 技術的なハイライト

### TypeScript 型安全性

- `ReturnType<typeof createMastra>` による完全な型推論
- エージェント名の Union 型による型安全なルーティング
- Zod スキーマによるツールの入出力検証

### 開発体験の最適化

- VS Code での自動フォーマット・Lint 設定
- Claude Code 用の包括的な Unix コマンド権限設定
- ESLint キャッシュ無効化による型チェックの正確性確保
- HMR 対応のシングルトンパターン

### パフォーマンスと信頼性

- ストリーミングレスポンスによる高速な応答体験
- LibSQL によるメモリの永続化
- Pino による構造化ログ出力
- エラーバウンダリーとユーザーフレンドリーなエラーメッセージ

## カスタマイズ方法

### 新しいエージェントの追加

1. `src/mastra/agents/` に新しいエージェントファイルを作成
2. `src/mastra/index.ts` の agents オブジェクトに追加
3. `app/api/chat/route.ts` の `AgentName` 型と配列に追加
4. `app/page.tsx` と `components/chat/chat-input.tsx` に UI を追加

### カスタムツールの作成

1. `src/mastra/tools/` に新しいツールファイルを作成
2. `createTool()` で Zod スキーマと実行ロジックを定義
3. エージェント定義で `tools` プロパティに追加

### モデルの変更

`app/api/chat/route.ts` の `modelMap` オブジェクトに新しいモデルを追加し、UI の選択肢を更新します。

## 学習リソース

- `ARCHITECTURE.md`: 全体アーキテクチャと詳細解説
- `.claude/settings.json`: 自動整形ワークフローと権限設定
- [Mastra Documentation](https://docs.mastra.ai)
- [Vercel AI SDK](https://sdk.vercel.ai)

## デプロイのヒント

- OpenAI API キーは環境変数で安全に管理
- Mastra を独立サーバーとして運用する場合は `npm run mastra:build` → `npm run mastra:start`
- 各エージェントのモデル、プロンプト、ツールは自由にカスタマイズ可能
- フロントエンドは AI Elements コンポーネントをベースにしているため、UI 変更時は `components/` 以下を参考に

## ライセンス

MIT License（付属の `LICENSE` ファイルを参照してください）
