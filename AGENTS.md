# Agent Specifications

このドキュメントは、アプリケーションに実装されている3つの特化型AIエージェントの詳細仕様を提供します。

## 概要

本アプリケーションは、それぞれ異なる専門能力を持つ3つのエージェントを備えています：

1. **Financial Analyst Agent** - 財務書類と決算報告書の分析
2. **Code Review Agent** - コード品質、セキュリティ、ベストプラクティスのレビュー
3. **Travel Planning Agent** - カスタムツールと連携した旅行計画

各エージェントは、その分野で優れた能力を発揮するための専門的な指示、モデル設定、ツールアクセスを備えています。

---

## 1. Financial Analyst Agent (財務分析エージェント)

### 目的
企業の決算報告書（短信決算資料）や財務諸表の分析に特化し、実用的な洞察を含む包括的な財務分析を提供します。

### 設定
```typescript
Agent ID: financialAnalystAgent
Model: openai/gpt-4o (PDF/画像分析のためのマルチモーダル機能)
Memory: LibSQL (ファイルベース永続化: ../mastra.db)
Tools: なし (GPT-4oのネイティブ機能に依存)
```

### 機能

#### 書類分析
- **決算報告書分析**: 四半期・年次決算報告書（短信決算資料）の解析
- **ビジョンベース抽出**: GPT-4oのビジョン機能を使用したPDF文書や画像からのデータ抽出
- **日本の財務書類**: 標準的な日本の会計用語とフォーマットの理解

#### 財務指標
- 主要財務指標（売上高、利益、EPS、配当等）の抽出
- 前年同期比の変化率と成長率の計算
- 予想からの大きな乖離の識別
- 利益率や財務比率の分析

#### 分析と洞察
- **トレンド分析**: 複数の報告期間にわたるパターンの識別
- **リスク評価**: 財務リスクと機会の評価
- **比較分析**: 異なる時期の業績比較
- **業界コンテキスト**: 業界標準内での文脈提供

### 出力フォーマット

エージェントは以下の構造でレスポンスを組み立てます：

1. **Executive Summary**: 主要な発見の簡潔な概要（2-3文）
2. **Financial Performance**: YoY比較を含む詳細な指標
3. **Key Insights**: 注目すべきトレンド、異常値、観察事項
4. **Risks & Opportunities**: 潜在的な懸念事項と成長分野
5. **Recommendation**: 全体的な評価と推奨されるアクション

### ユースケース例

- 投資判断のための四半期決算報告書の分析
- スキャンされた文書からの財務データ抽出
- 複数四半期にわたる財務パフォーマンスの比較
- M&A活動前の企業健全性評価
- 複雑な財務書類のエグゼクティブサマリー作成

---

## 2. Code Review Agent (コードレビューエージェント)

### 目的
モダンなコードベースに対する包括的なコードレビュー、品質分析、セキュリティ評価を専門とするエキスパートソフトウェアエンジニア。

### 設定
```typescript
Agent ID: codeReviewAgent
Model: openai/gpt-4o (コードスクリーンショット用のマルチモーダル機能)
Memory: LibSQL (ファイルベース永続化: ../mastra.db)
Tools: なし (GPT-4oの豊富なコード知識に依存)
```

### 機能

#### コード品質分析
- **ベストプラクティス**: 言語固有のベストプラクティスからの逸脱を識別
- **コードスメル**: 一般的なアンチパターンと技術的負債の検出
- **保守性**: コードの可読性と長期的な保守性の評価
- **デザインパターン**: 適切なデザインパターンとアーキテクチャの提案

#### セキュリティ評価
- **脆弱性検出**: 一般的なセキュリティ脆弱性（SQLインジェクション、XSS等）の識別
- **認証/認可**: 認証実装パターンのレビュー
- **データハンドリング**: 機密データの安全な取り扱いのチェック
- **依存関係のセキュリティ**: 古いまたは脆弱な依存関係のフラグ

#### パフォーマンス分析
- **最適化の機会**: 非効率なアルゴリズムと操作の識別
- **リソース管理**: メモリリークとリソース枯渇のチェック
- **データベースクエリ**: クエリの効率性とN+1問題のレビュー
- **キャッシング戦略**: キャッシングの改善提案

#### 対応技術スタック
- TypeScript/JavaScript (React, Next.js, Node.js)
- Python (Django, FastAPI, Flask)
- Go, Rust, Java, C#
- Mobile (Swift, Kotlin, React Native)
- Infrastructure as Code (Terraform, CloudFormation)

### 出力フォーマット

エージェントは以下の構造でコードレビューを提供します：

1. **Overall Assessment**: コード品質の高レベルな要約
2. **Critical Issues**: セキュリティ脆弱性と重大なバグ
3. **Major Concerns**: 重要なデザインまたはパフォーマンスの問題
4. **Minor Issues**: スタイルの不一致と小さな改善点
5. **Strengths**: 観察された良い点と優れた実践
6. **Recommendations**: 優先順位付けされた実行可能な改善リスト

### ユースケース例

- プルリクエストのコミット前レビュー
- 本番環境デプロイ前のセキュリティ監査
- パフォーマンス最適化分析
- 新機能のアーキテクチャレビュー
- レガシーコードの評価と近代化計画

---

## 3. Travel Planning Agent (旅行計画エージェント)

### 目的
包括的な目的地情報、旅程提案、実用的な旅行アドバイスを提供するエキスパート旅行プランナー。

### 設定
```typescript
Agent ID: travelPlanningAgent
Model: openai/gpt-4o-mini (会話型計画に最適な高速・コスト効率)
Memory: LibSQL (ファイルベース永続化: ../mastra.db)
Tools: travelTool (カスタム目的地情報ツール)
```

### 機能

#### 目的地情報
- **主要都市**: 東京、パリ、ニューヨークの詳細情報（拡張可能）
- **ハイライト**: 主要な観光名所とユニークな体験
- **訪問のベストタイミング**: 理由付きの季節別推奨
- **予算見積もり**: 現実的な1日あたりの予算範囲

#### 旅程計画
- **パーソナライズされた推奨**: 旅行者の興味（文化、食事、自然、冒険）に合わせたカスタマイズ
- **アトラクション詳細**: 各推奨の名前、説明、カテゴリー
- **現地のヒント**: 交通、エチケット、言語、お金に関する実用的なアドバイス
- **複数日程計画**: 複数日にわたる複雑な旅程の構造化

#### Travel Tool統合

エージェントは以下を提供する `travelTool` にアクセスできます：

```typescript
入力:
- destination: string (都市または国名)
- interests: string[] (オプション、例: ["culture", "food", "nature"])

出力:
- highlights: string[] (訪問する主な理由)
- bestTimeToVisit: string (最適な季節)
- estimatedBudget: string (1日あたりのコスト範囲)
- topAttractions: Array<{name, description, category}>
- localTips: string[] (実用的なアドバイス)
```

詳細データが利用可能な現在の目的地：
- **東京**: 寺院、料理、桜、モダン文化
- **パリ**: 芸術、建築、美食、ロマンチックな雰囲気
- **ニューヨーク**: 多様性、エンターテインメント、スカイライン、国際料理

### 出力フォーマット

エージェントは以下の構造で旅行情報を提供します：

1. **Destination Overview**: 場所の簡単な紹介
2. **Key Highlights**: 訪問する主な理由
3. **Best Time to Visit**: 長所と短所を含む季節別の内訳
4. **Budget Planning**: 内訳付きの現実的なコスト見積もり
5. **Top Attractions**: カテゴリー付きの詳細リスト
6. **Local Tips**: ナビゲーション、コミュニケーション、文化に関する実用的なアドバイス
7. **Suggested Itinerary**: （リクエストがあれば）日別または複数日プラン

### ユースケース例

- 主要都市への初回訪問の計画
- 素早い目的地概要の取得
- 国際旅行の予算立て
- 特定の興味に基づくアトラクションの検索
- 現地の習慣と実用的なヒントの学習
- 旅行計画のための複数の目的地の比較

---

## エージェントアーキテクチャパターン

### メモリ管理

すべてのエージェントは、ファイルベース永続化を備えたLibSQLを使用します：
```typescript
memory: new Memory({
  storage: new LibSQLStore({
    url: 'file:../mastra.db',
  }),
})
```

これにより以下が可能になります：
- セッション間での会話履歴
- 以前のインタラクションからの文脈認識
- 時間をかけたユーザー嗜好の学習

### モデル選択の理由

| エージェント | モデル | 理由 |
|-------------|--------|------|
| Financial Analyst | GPT-4o | PDF/画像分析のビジョン機能、複雑な財務推論 |
| Code Review | GPT-4o | 大規模なコンテキストウィンドウ、深いコード理解、パターン認識 |
| Travel Planning | GPT-4o-mini | 高速レスポンス、会話型タスクに対するコスト効率、ツールベースのルックアップに十分 |

### 動的モデルオーバーライド

APIルート（`app/api/chat/route.ts`）は動的モデルオーバーライドをサポート：
```typescript
agent.model = mastraModel; // 実行時にオーバーライド可能
```

これによりユーザーは以下が可能：
- 必要に応じて旅行計画でGPT-4oを使用
- コスト削減のために簡単な財務質問でGPT-4o-miniを使用
- パフォーマンス/コスト最適化のために異なるモデルをテスト

---

## エージェントシステムの拡張

### 新しいエージェントの追加

1. **エージェントファイルの作成** (`src/mastra/agents/your-agent.ts`):
```typescript
import { Agent } from '@mastra/core/agent';
import { Memory } from '@mastra/memory';
import { LibSQLStore } from '@mastra/libsql';

export const yourAgent = new Agent({
  name: 'yourAgent',
  instructions: `詳細なエージェント指示...`,
  model: 'openai/gpt-4o-mini',
  memory: new Memory({
    storage: new LibSQLStore({
      url: 'file:../mastra.db',
    }),
  }),
  tools: { /* オプションのカスタムツール */ },
});
```

2. **Mastraへの登録** (`src/mastra/index.ts`):
```typescript
import { yourAgent } from './agents/your-agent';

const createMastra = () => {
  return new Mastra({
    agents: {
      financialAnalystAgent,
      codeReviewAgent,
      travelPlanningAgent,
      yourAgent, // ここに追加
    },
    // ... 残りの設定
  });
};
```

3. **APIルートの更新** (`app/api/chat/route.ts`):
```typescript
type AgentName =
  | 'financialAnalystAgent'
  | 'codeReviewAgent'
  | 'travelPlanningAgent'
  | 'yourAgent'; // ここに追加

const validAgentNames: AgentName[] = [
  'financialAnalystAgent',
  'codeReviewAgent',
  'travelPlanningAgent',
  'yourAgent', // ここに追加
];
```

4. **UIコントロールの追加** (`app/page.tsx` と `components/chat/chat-input.tsx`):
```typescript
// app/page.tsx内
const agentDescriptions = {
  // ... 既存のエージェント
  yourAgent: 'エージェントの説明',
};

// components/chat/chat-input.tsx内
<PromptInputModelSelectItem value="yourAgent">
  エージェント表示名
</PromptInputModelSelectItem>

// コマンドパレットエントリの追加
<PromptInputCommandItem onSelect={() => handleCommandSelect('your-command')}>
  <YourIcon className="mr-2 size-4" />
  <span>/your-command - エージェントに切り替え</span>
</PromptInputCommandItem>
```

### カスタムツールの作成

参考として `src/mastra/tools/travel-tool.ts` を参照：

```typescript
import { createTool } from '@mastra/core/tools';
import { z } from 'zod';

export const yourTool = createTool({
  id: 'your-tool-id',
  description: 'ツールの機能説明',
  inputSchema: z.object({
    param: z.string().describe('パラメータの説明'),
  }),
  outputSchema: z.object({
    result: z.string(),
  }),
  execute: async ({ context }) => {
    // ツールロジックをここに
    return { result: 'value' };
  },
});
```

エージェントに追加：
```typescript
export const yourAgent = new Agent({
  // ... その他の設定
  tools: { yourTool },
});
```

---

## パフォーマンスに関する考慮事項

### モデルコスト

| モデル | 入力コスト | 出力コスト | ユースケース |
|--------|-----------|-----------|-------------|
| GPT-4o | $2.50/1M トークン | $10.00/1M トークン | 複雑な分析、ビジョン |
| GPT-4o-mini | $0.15/1M トークン | $0.60/1M トークン | 会話型、ツールベース |

### トークン最適化

- Financial Analyst: 構造化された出力フォーマットがトークン使用量を最小化
- Code Review: 優先順位付けされたフィードバックが不要な詳細を削減
- Travel Planning: ツールベースのデータ取得がプロンプトサイズを削減

### レスポンス時間

- GPT-4o-mini: 通常のレスポンスで約1-2秒
- GPT-4o: 複雑な分析で約3-5秒
- すべてのエージェントでストリーミングが有効化され、体感パフォーマンスが向上

---

## トラブルシューティング

### エージェントが応答しない

1. `.env`にOpenAI APIキーが設定されているか確認
2. `src/mastra/index.ts`にエージェントが登録されているか確認
3. エージェント名が正確に一致しているか確認（大文字小文字区別）
4. ブラウザコンソールでAPIエラーを確認

### ツールが呼び出されない

1. エージェントの `tools` プロパティにツールが追加されているか確認
2. ツールの説明が明確で具体的か確認
3. 明示的なユーザーリクエストでテスト（例: "東京について旅行ツールを使って"）
4. Mastraログでツール実行エラーを確認

### メモリの問題

1. `mastra.db` ファイルが正しい場所に存在するか確認
2. LibSQLストレージ設定を確認
3. 破損している場合はメモリをクリア: `rm mastra.db` して再起動
4. エージェント指示のメモリアクセスパターンを確認

### 型エラー

1. `src/mastra/index.ts`で `ReturnType<typeof createMastra>` が使用されているか確認
2. VS CodeでTypeScript Serverを再起動
3. ESLintキャッシュをクリア: `rm -rf .eslintcache node_modules/.cache`
4. `npm run typecheck` を実行して型を確認

---

## 参考資料

- [Mastra Documentation](https://docs.mastra.ai)
- [OpenAI Model Pricing](https://openai.com/pricing)
- [Vercel AI SDK - Agent Patterns](https://sdk.vercel.ai/docs/ai-sdk-core/agents)
- [Zod Documentation](https://zod.dev/) (ツールスキーマ用)
