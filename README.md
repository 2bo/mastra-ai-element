# このリポジトリは Mastra と AI Element を組み合わせたサンプルプロジェクトです。

## Mastra AI Weather Chat サンプル概要

Mastra AI フレームワークと Next.js 16 を組み合わせた天気チャットアプリケーションのデモです。Vercel AI SDK によるストリーミング応答、Mastra のエージェント／ワークフロー設計、AI Element コンポーネントによる UI 実装をまとめて確認できます。PoC や社内トレーニングの叩き台としてご利用ください。

## サンプルで学べること
- GPT-4o-mini を活用した Mastra Weather Agent の構築と、ツール呼び出し・メモリ・スコアリングの連携
- Open-Meteo API を利用する天気ツールの実装と、Mastra からの利用方法
- `@ai-sdk/react` と AI Element コンポーネントによるストリーミングチャット UI の構成
- Mastra Workflow を使った「天気取得 → アクティビティ提案」2 ステップ自動化
- LibSQL と Pino logger を組み合わせたメモリ永続化・オブザーバビリティ設定

## 前提条件と初期設定
- Node.js 20.9.0 以上
- npm（Node.js 同梱）
- GPT-4o シリーズへアクセス可能な OpenAI API キー

ルートディレクトリに `.env` を作成し、以下を設定してください。

```ini
OPENAI_API_KEY=your-api-key
```

依存関係をインストールします。

```bash
npm install
```

## 実行方法

### 開発時
```bash
npm run dev          # Next.js 開発サーバー (http://localhost:3000)
npm run mastra:dev   # Mastra CLI の開発モード（任意）
```

チャット UI は Next.js API Route を通じて Mastra Agent と通信します。基本的な動作確認は `npm run dev` のみで可能です。Mastra CLI 経由でエージェントやワークフローを詳しく確認したい場合は、別ターミナルで `npm run mastra:dev` を併用してください。

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

`.claude/settings.json` の PostToolUse フックにより、TypeScript / JavaScript ファイルの編集時には自動で `lint:fix` と `format` が走るよう設定されています。

## サンプル構成
```
app/               Next.js App Router 層（UI + API）
components/        チャット UI / AI Element ラッパー / Radix ベースの UI コンポーネント
src/mastra/        Mastra 設定（エージェント・ツール・ワークフロー・スコアラー）
lib/               共通ユーティリティ
```

- **UI レイヤー (`app/` + `components/`)**
  - `app/page.tsx`: `useChat` を利用したチャット画面
  - `components/chat`: レイアウト、メッセージ一覧、入力欄、メッセージ描画
  - `components/ai-elements`: Streamdown レンダリング、スクロール制御、Prompt 入力などのヘルパー
  - `components/ui`: Radix UI を Tailwind で拡張した基礎コンポーネント

- **API レイヤー (`app/api/chat/route.ts`)**
  - Mastra の `weatherAgent` を取得し、`toUIMessageStreamResponse()` で AI SDK 互換のストリームを返却

- **Mastra レイヤー (`src/mastra/`)**
  - `index.ts`: エージェント、ワークフロー、スコアラー、LibSQL ストレージ、オブザーバビリティを束ねた Mastra インスタンス
  - `agents/weather-agent.ts`: GPT-4o-mini、ツール連携、LibSQL メモリ（`file:../mastra.db`）を備えた Weather Agent
  - `tools/weather-tool.ts`: Open-Meteo Geocoding + Forecast API を呼び出し、標準化したレスポンスを返すツール
  - `workflows/weather-workflow.ts`: `fetch-weather` → `plan-activities` の 2 ステップでアクティビティ提案を生成
  - `scorers/weather-scorer.ts`: ツール適切性、回答完全性、翻訳品質を評価するスコアラー

## チャット UI の見どころ
- 添付ファイル、ホバーチップ、モデル選択、コピーアクション付きのリッチな入力体験
- 画像プレビューや一般ファイルの簡易表示
- Streamdown によるストリーミングマークダウンレンダリング
- 「最下部へ移動」ボタンやアシスタントメッセージのコピー操作
- 送信中インジケーター、エラー通知、空状態などアクセシビリティに配慮した状態管理

## オブザーバビリティとストレージ
- メモリ: LibSQL（`file:../mastra.db`。`.mastra/output` からの相対パス）で会話履歴を永続化
- オブザーバビリティ: `:memory:` LibSQL ストアでスコアとトレーシングを管理し、デフォルトエクスポーターを有効化
- ログ: `@mastra/loggers` + Pino による構造化ログ出力

## 学習リソース
- `ARCHITECTURE.md`: 全体アーキテクチャと詳細解説
- `AGENTS.md`: エージェントプロンプト、ツール、評価戦略
- `CLAUDE.md`: 自動整形ワークフローの設定

## カスタマイズ & デプロイのヒント
- 本番環境で Open-Meteo API へのアウトバウンド通信が許可されていることを確認
- OpenAI API キーは環境変数で安全に管理
- Mastra を独立サーバーとして運用する場合は `npm run mastra:build` → `npm run mastra:start`
- Weather Agent のモデル／プロンプト／ツールを変更して独自のエージェントに拡張可能
- フロントエンドは AI Element コンポーネントをベースにしているため、UI 変更時は `components/` 以下を参考にしてください

## ライセンス
MIT License（付属の `LICENSE` ファイルを参照してください）
