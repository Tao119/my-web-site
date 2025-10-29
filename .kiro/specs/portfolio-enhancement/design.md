# Design Document

## Overview

ポートフォリオページの全面的な機能強化を行い、モダンでプロフェッショナルな印象を与える包括的なポートフォリオサイトを構築します。ネイビーブルー（#1e3a8a）をテーマカラーとし、Neobrutalism.devのデザインシステムを採用して、太いボーダー、鮮やかな色彩、大胆なタイポグラフィを特徴とする印象的なデザインを実現します。PC・スマートフォン・タブレットに完全対応したレスポンシブデザインを提供します。

## Architecture

### 技術スタック

- **フレームワーク**: Next.js 14+ (App Router)
- **言語**: TypeScript
- **スタイリング**: Tailwind CSS + Neobrutalism.dev コンポーネント
- **UIライブラリ**: Neobrutalism.dev (shadcn/ui ベース)
- **アニメーション**: Framer Motion + AOS (Animate On Scroll)
- **状態管理**: React Hooks (useState, useEffect, useContext)
- **データベース**: Firebase Firestore (既存)
- **認証**: Next.js API Routes + セッション管理
- **画像最適化**: Next.js Image コンポーネント
- **フォーム**: React Hook Form + Zod バリデーション
- **レスポンシブ**: Tailwind CSS ブレークポイント (sm, md, lg, xl, 2xl)

### ディレクトリ構造

```
src/
├── app/
│   └── portfolio/
│       ├── page.tsx (メインポートフォリオページ)
│       ├── layout.tsx (ポートフォリオレイアウト)
│       ├── admin/
│       │   ├── page.tsx (管理画面ログイン)
│       │   ├── dashboard/
│       │   │   └── page.tsx (管理ダッシュボード)
│       │   └── profile/
│       │       └── page.tsx (プロフィール編集)
│       └── blog/
│           ├── page.tsx (ブログ一覧)
│           └── [id]/
│               └── page.tsx (ブログ詳細)
├── components/
│   └── portfolio/
│       ├── sections/ (各セクションコンポーネント)
│       ├── ui/ (再利用可能なUIコンポーネント)
│       └── admin/ (管理画面コンポーネント)
├── hooks/ (カスタムフック)
├── lib/ (ユーティリティ関数)
└── types/ (TypeScript型定義)
```

## Components and Interfaces

### 1. ヒーローセクション (HeroSection)

```typescript
interface HeroSectionProps {
  title: string;
  subtitle: string;
  catchphrase: string;
  ctaText: string;
  backgroundType: "parallax" | "animated" | "gradient";
}
```

**デザイン特徴:**

- フルスクリーン表示（100vh）
- パララックス効果付き背景
- タイピングアニメーション付きキャッチコピー
- グラスモーフィズム効果のCTAボタン
- スクロールインジケーター

### 2. ナビゲーション (Navigation)

```typescript
interface NavigationProps {
  isScrolled: boolean;
  currentSection: string;
  isDarkMode: boolean;
}
```

**デザイン特徴:**

- スティッキーヘッダー（スクロール時に縮小・背景ブラー効果）
- 現在位置のハイライト表示
- スムーズスクロール対応
- レスポンシブハンバーガーメニュー
- ダークモード切り替えボタン

### 3. プロフィールセクション (ProfileSection)

```typescript
interface ProfileData {
  name: string;
  nameEn: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
  socialLinks: SocialLink[];
}

interface ProfileSectionProps {
  data: ProfileData;
  showDetailedInfo: boolean;
}
```

**デザイン特徴:**

- 円形プロフィール画像（ホバー時拡大効果）
- アニメーション付きタイポグラフィ
- タイピングアニメーション付き肩書き
- アコーディオン形式の詳細情報
- ニューモーフィズム効果のカード

### 4. 技術スタックセクション (SkillsSection)

```typescript
interface Skill {
  id: string;
  name: string;
  category: string;
  level: number; // 1-100
  years: number;
  icon: string;
  description: string;
}

interface SkillsSectionProps {
  skills: Skill[];
  animateOnScroll: boolean;
}
```

**デザイン特徴:**

- カテゴリ別タブ表示
- 円形プログレスバーまたはスキルレーダーチャート
- アニメーション付き数値カウントアップ
- ホバー時ツールチップ表示
- 技術アイコンのグリッド表示

### 5. プロジェクトセクション (ProjectsSection)

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  category: string;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
}

interface ProjectsSectionProps {
  projects: Project[];
  categories: string[];
}
```

**デザイン特徴:**

- マソナリーレイアウトまたはグリッド表示
- フィルタリング機能（アニメーション付き）
- ホバー時オーバーレイエフェクト
- モーダル詳細表示
- 技術タグのカラーコーディング

### 6. ブログセクション (BlogSection)

```typescript
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  tags: string[];
  publishedAt: Date;
  readTime: number;
  published: boolean;
}

interface BlogSectionProps {
  posts: BlogPost[];
  showCount: number;
}
```

**デザイン特徴:**

- カード形式のレイアウト
- 読了時間とカテゴリ表示
- 検索・フィルタリング機能
- ページネーションまたは無限スクロール
- Markdownレンダリング対応

### 7. コンタクトセクション (ContactSection)

```typescript
interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface ContactSectionProps {
  onSubmit: (data: ContactFormData) => Promise<void>;
}
```

**デザイン特徴:**

- バリデーション付きフォーム
- リアルタイムエラー表示
- 送信成功/失敗フィードバック
- グラスモーフィズム効果のフォーム要素

## Data Models

### 1. User Profile Model

```typescript
interface UserProfile {
  id: string;
  name: string;
  nameEn: string;
  title: string;
  bio: string;
  location: string;
  email: string;
  avatar: string;
  socialLinks: SocialLink[];
  education: Education[];
  experience: Experience[];
  createdAt: Date;
  updatedAt: Date;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface Education {
  institution: string;
  degree: string;
  field: string;
  startDate: Date;
  endDate?: Date;
  description?: string;
}

interface Experience {
  company: string;
  position: string;
  startDate: Date;
  endDate?: Date;
  description: string;
  technologies: string[];
}
```

### 2. Skill Model

```typescript
interface Skill {
  id: string;
  name: string;
  category: SkillCategory;
  level: number; // 1-100
  years: number;
  icon: string;
  description: string;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

enum SkillCategory {
  FRONTEND = "frontend",
  BACKEND = "backend",
  DATABASE = "database",
  INFRASTRUCTURE = "infrastructure",
  UNITY = "unity",
  AI = "ai",
  OTHER = "other",
}
```

### 3. Project Model

```typescript
interface Project {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  images: string[];
  technologies: string[];
  category: ProjectCategory;
  githubUrl?: string;
  demoUrl?: string;
  featured: boolean;
  order: number;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

enum ProjectCategory {
  WEB = "web",
  MOBILE = "mobile",
  UNITY = "unity",
  AI = "ai",
  OTHER = "other",
}
```

### 4. Blog Post Model

```typescript
interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  thumbnail: string;
  category: string;
  tags: string[];
  readTime: number;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

## Error Handling

### 1. クライアントサイドエラーハンドリング

- React Error Boundary の実装
- ユーザーフレンドリーなエラーメッセージ
- エラー状態のフォールバックUI
- ネットワークエラーの自動リトライ機能

### 2. サーバーサイドエラーハンドリング

- API エラーレスポンスの統一フォーマット
- 適切なHTTPステータスコードの返却
- ログ記録とエラー追跡
- レート制限とセキュリティ対策

### 3. フォームバリデーション

- Zod スキーマによる型安全なバリデーション
- リアルタイムバリデーション
- 多言語対応エラーメッセージ

## Testing Strategy

### 1. 単体テスト (Jest + React Testing Library)

- コンポーネントの動作テスト
- カスタムフックのテスト
- ユーティリティ関数のテスト
- API エンドポイントのテスト

### 2. 統合テスト

- ページ全体の動作テスト
- フォーム送信フローのテスト
- 認証フローのテスト

### 3. E2Eテスト (Playwright)

- ユーザージャーニーのテスト
- レスポンシブデザインのテスト
- パフォーマンステスト

### 4. アクセシビリティテスト

- axe-core による自動テスト
- キーボードナビゲーションテスト
- スクリーンリーダー対応テスト

## デザインシステム

### Neobrutalism デザインアプローチ

Neobrutalism.dev のデザインシステムを採用し、以下の特徴を活用：

- **太いボーダー**: 3-5px の黒いボーダー
- **シャドウ効果**: 4-8px のオフセットシャドウ
- **鮮やかな色彩**: 高コントラストカラーパレット
- **大胆なタイポグラフィ**: 太字フォントとクリアな階層
- **幾何学的形状**: 角ばったデザイン要素

### カラーパレット（Neobrutalism対応）

```css
/* Primary Colors */
--navy-blue: #1e3a8a;
--navy-blue-light: #3b82f6;
--navy-blue-dark: #1e40af;

/* Neobrutalism Accent Colors */
--neon-yellow: #fbbf24;
--electric-pink: #ec4899;
--lime-green: #84cc16;
--orange: #f97316;

/* Base Colors */
--white: #ffffff;
--black: #000000;
--gray-100: #f3f4f6;
--gray-900: #111827;

/* Dark Mode Colors */
--dark-bg: #0f172a;
--dark-surface: #1e293b;
--dark-text: #f1f5f9;
```

### レスポンシブブレークポイント

```css
/* Tailwind CSS ブレークポイント */
--breakpoint-sm: 640px; /* スマートフォン */
--breakpoint-md: 768px; /* タブレット */
--breakpoint-lg: 1024px; /* デスクトップ */
--breakpoint-xl: 1280px; /* 大画面 */
--breakpoint-2xl: 1536px; /* 超大画面 */
```

### Neobrutalism コンポーネントスタイル

```css
/* ボタンスタイル */
.neo-button {
  @apply bg-white border-4 border-black font-bold px-6 py-3 
         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
         hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
         hover:translate-x-[2px] hover:translate-y-[2px] 
         transition-all duration-150;
}

/* カードスタイル */
.neo-card {
  @apply bg-white border-4 border-black 
         shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] 
         p-6 rounded-none;
}

/* インプットスタイル */
.neo-input {
  @apply border-4 border-black bg-white px-4 py-3 
         focus:outline-none focus:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
         transition-all duration-150;
}
```

### タイポグラフィ

```css
/* Font Families */
--font-primary: "Inter", "Noto Sans JP", sans-serif;
--font-mono: "JetBrains Mono", monospace;
--font-display: "Space Grotesk", sans-serif; /* Neobrutalism用 */

/* Font Sizes (レスポンシブ対応) */
--text-xs: clamp(0.75rem, 0.7rem + 0.25vw, 0.875rem);
--text-sm: clamp(0.875rem, 0.8rem + 0.375vw, 1rem);
--text-base: clamp(1rem, 0.9rem + 0.5vw, 1.125rem);
--text-lg: clamp(1.125rem, 1rem + 0.625vw, 1.25rem);
--text-xl: clamp(1.25rem, 1.1rem + 0.75vw, 1.5rem);
--text-2xl: clamp(1.5rem, 1.3rem + 1vw, 1.875rem);
--text-3xl: clamp(1.875rem, 1.6rem + 1.375vw, 2.25rem);
--text-4xl: clamp(2.25rem, 1.9rem + 1.75vw, 3rem);
```

### アニメーション

```css
/* Neobrutalism Transitions */
--transition-neo: 0.15s ease-out;
--transition-bounce: 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55);

/* Shadow Animations */
@keyframes shadowPulse {
  0%,
  100% {
    box-shadow: 8px 8px 0px 0px rgba(0, 0, 0, 1);
  }
  50% {
    box-shadow: 12px 12px 0px 0px rgba(0, 0, 0, 1);
  }
}
```

### レスポンシブデザイン戦略

```css
/* モバイルファースト設計 */
.responsive-grid {
  @apply grid grid-cols-1 gap-4 
         sm:grid-cols-2 sm:gap-6 
         md:grid-cols-3 md:gap-8 
         lg:grid-cols-4 lg:gap-10;
}

/* レスポンシブタイポグラフィ */
.responsive-heading {
  @apply text-2xl font-bold 
         sm:text-3xl 
         md:text-4xl 
         lg:text-5xl;
}

/* レスポンシブスペーシング */
.responsive-padding {
  @apply px-4 py-6 
         sm:px-6 sm:py-8 
         md:px-8 md:py-12 
         lg:px-12 lg:py-16;
}
```

## パフォーマンス最適化

### 1. 画像最適化

- Next.js Image コンポーネントの使用
- WebP フォーマットの採用
- 遅延読み込み（Lazy Loading）
- レスポンシブ画像の実装

### 2. コード分割

- 動的インポートによるコンポーネント分割
- ルートベースのコード分割
- ライブラリの最適化

### 3. キャッシュ戦略

- Static Generation の活用
- ISR (Incremental Static Regeneration) の実装
- CDN キャッシュの最適化

### 4. バンドル最適化

- Tree Shaking の活用
- 不要なライブラリの除去
- バンドルサイズの監視

## アクセシビリティ

### 1. セマンティックHTML

- 適切なHTML要素の使用
- ランドマークロールの実装
- 見出し階層の適切な構造

### 2. キーボードナビゲーション

- Tab キーによる順次ナビゲーション
- Skip Link の実装
- フォーカス管理

### 3. スクリーンリーダー対応

- aria-label の適切な使用
- alt テキストの実装
- ライブリージョンの活用

### 4. カラーコントラスト

- WCAG 2.1 AA レベルの準拠
- カラーのみに依存しない情報伝達
- ダークモード対応
