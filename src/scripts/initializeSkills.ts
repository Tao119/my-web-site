// スキルデータベース初期化スクリプト
import { Skill, SkillCategory } from '@/types/portfolio';

export const initialSkillsData: Omit<Skill, 'createdAt' | 'updatedAt'>[] = [
    // プログラミング言語
    {
        id: 'javascript',
        name: 'JavaScript',
        category: SkillCategory.LANGUAGE,
        level: 95,
        years: 7,
        icon: '🟨',
        description: 'ES6+、TypeScript、モダンJavaScript開発に精通。フロントエンド・バックエンド両方で豊富な経験。非同期処理、DOM操作、モジュールシステムを駆使した高品質なアプリケーション開発。',
        order: 1
    },
    {
        id: 'html-css',
        name: 'HTML・CSS',
        category: SkillCategory.LANGUAGE,
        level: 95,
        years: 7,
        icon: '🎨',
        description: 'セマンティックHTML5、CSS3、Flexbox、Grid、レスポンシブデザイン、アクセシビリティ対応。SCSS/Sass、CSS-in-JS、アニメーション、パフォーマンス最適化まで幅広くカバー。',
        order: 2
    },
    {
        id: 'python',
        name: 'Python',
        category: SkillCategory.LANGUAGE,
        level: 95,
        years: 8,
        icon: '🐍',
        description: 'Web開発（FastAPI、Flask、Django）から機械学習（PyTorch、scikit-learn、pandas）まで幅広く活用。データ分析、AI開発、自動化スクリプト、API開発の主力言語。',
        order: 3
    },
    {
        id: 'csharp',
        name: 'C#',
        category: SkillCategory.LANGUAGE,
        level: 85,
        years: 5,
        icon: '🔷',
        description: '.NET Framework/.NET Core、ASP.NET、Unity開発、WPF、デスクトップアプリケーション開発。オブジェクト指向プログラミング、LINQ、非同期処理に精通。',
        order: 4
    },
    {
        id: 'rust',
        name: 'Rust',
        category: SkillCategory.LANGUAGE,
        level: 85,
        years: 3,
        icon: '🦀',
        description: 'CLIツール開発、システムプログラミング、WebAssembly。npmにパッケージ公開経験あり。メモリ安全性とパフォーマンスを重視した開発に活用。所有権システムとライフタイムに精通。',
        order: 5
    },
    {
        id: 'cpp',
        name: 'C++',
        category: SkillCategory.LANGUAGE,
        level: 90,
        years: 6,
        icon: '⚡',
        description: 'システムプログラミング、ゲーム開発、高性能アプリケーション開発。STL、テンプレート、メモリ管理、マルチスレッド処理、パフォーマンス最適化に精通。',
        order: 6
    },
    {
        id: 'dart',
        name: 'Dart',
        category: SkillCategory.LANGUAGE,
        level: 85,
        years: 4,
        icon: '🎯',
        description: 'Flutter開発の主力言語。非同期処理、ジェネリクス、ミックスイン、null safety対応。クロスプラットフォームモバイルアプリ開発で豊富な実績。',
        order: 7
    },
    {
        id: 'swift',
        name: 'Swift・SwiftUI',
        category: SkillCategory.LANGUAGE,
        level: 85,
        years: 5,
        icon: '🍎',
        description: 'iOS/macOSアプリ開発。SwiftUIを使った宣言的UI開発、Combine、Core Data、CloudKit。プロトコル指向プログラミング、オプショナル、ARC管理に精通。',
        order: 8
    },
    {
        id: 'ruby',
        name: 'Ruby',
        category: SkillCategory.LANGUAGE,
        level: 70,
        years: 6,
        icon: '💎',
        description: 'Ruby on Rails、Sinatra、スクリプト作成、Web API開発。メタプログラミング、ブロック、イテレータを活用したエレガントなコード記述。プロトタイピングに最適。',
        order: 9
    },
    {
        id: 'php',
        name: 'PHP',
        category: SkillCategory.LANGUAGE,
        level: 90,
        years: 6,
        icon: '🐘',
        description: 'Laravel、Symfony、WordPress、CakePHP。Composer、PSR標準、名前空間、トレイト。レガシーシステムの保守・改修からモダンなAPI開発まで幅広い経験。',
        order: 10
    },
    {
        id: 'kotlin',
        name: 'Kotlin',
        category: SkillCategory.LANGUAGE,
        level: 75,
        years: 4,
        icon: '🟣',
        description: 'Androidアプリ開発、Kotlin Multiplatform、Spring Boot。コルーチン、拡張関数、データクラス。Javaからの移行プロジェクトを複数経験。',
        order: 11
    },
    {
        id: 'shell-script',
        name: 'Shell Script',
        category: SkillCategory.LANGUAGE,
        level: 80,
        years: 4,
        icon: '🐚',
        description: 'Bash、Zsh、Fish。自動化スクリプト、CI/CDパイプライン、サーバー管理タスクの自動化。正規表現、パイプライン、プロセス制御、環境変数管理に精通。',
        order: 12
    },

    // フロントエンド
    {
        id: 'nextjs',
        name: 'Next.js',
        category: SkillCategory.FRONTEND,
        level: 95,
        years: 5,
        icon: '⚫',
        description: 'App Router、Pages Router、SSR/SSG/ISR、API Routes、Image最適化、パフォーマンス最適化。React Server Components、Streaming、Suspenseを活用したモダンWeb開発のメインフレームワーク。',
        order: 13
    },

    // バックエンド
    {
        id: 'nodejs',
        name: 'Node.js',
        category: SkillCategory.BACKEND,
        level: 85,
        years: 5,
        icon: '🟢',
        description: 'Express、Fastify、Koa、NestJS。RESTful API、GraphQL、リアルタイム通信（Socket.io）、マイクロサービス、イベント駆動アーキテクチャ、パフォーマンス最適化、メモリ管理。',
        order: 14
    },
    {
        id: 'fastapi-flask',
        name: 'FastAPI・Flask',
        category: SkillCategory.BACKEND,
        level: 90,
        years: 4,
        icon: '⚡',
        description: '高性能Web API開発、OpenAPI/Swagger自動生成、Pydantic、非同期処理（async/await）、依存性注入、マイクロサービス、機械学習API、WebSocket、バックグラウンドタスク。',
        order: 15
    },
    {
        id: 'dotnet',
        name: '.NET',
        category: SkillCategory.BACKEND,
        level: 80,
        years: 5,
        icon: '🔵',
        description: '.NET Core/.NET 6+、ASP.NET Core、Entity Framework Core、Minimal APIs、SignalR、Web API開発、マイクロサービス、依存性注入、ミドルウェア、認証・認可。',
        order: 16
    },
    {
        id: 'firebase',
        name: 'Firebase',
        category: SkillCategory.BACKEND,
        level: 80,
        years: 4,
        icon: '🔥',
        description: 'Firestore、Realtime Database、Authentication、Cloud Functions、Cloud Storage、Hosting、Analytics。リアルタイムアプリ、PWA開発、サーバーレスアーキテクチャ。',
        order: 17
    },

    // モバイル
    {
        id: 'react-native',
        name: 'React Native',
        category: SkillCategory.MOBILE,
        level: 80,
        years: 4,
        icon: '📱',
        description: 'クロスプラットフォームモバイルアプリ開発。Expo、React Navigation、Redux/Zustand、ネイティブモジュール連携、パフォーマンス最適化、プッシュ通知、アプリストア公開。',
        order: 18
    },
    {
        id: 'flutter',
        name: 'Flutter',
        category: SkillCategory.MOBILE,
        level: 80,
        years: 4,
        icon: '🦋',
        description: 'クロスプラットフォーム開発、Material Design、Cupertino、状態管理（Provider、Riverpod、Bloc）、カスタムウィジェット、アニメーション、プラットフォーム固有機能統合。',
        order: 19
    },

    // データベース
    {
        id: 'sql',
        name: 'SQL',
        category: SkillCategory.DATABASE,
        level: 95,
        years: 5,
        icon: '🗄️',
        description: 'PostgreSQL、MySQL、SQLite、SQL Server。複雑なクエリ最適化、インデックス設計、パーティショニング、レプリケーション、データベース設計、正規化、パフォーマンスチューニング、ストアドプロシージャ。',
        order: 20
    },
    {
        id: 'nosql',
        name: 'NoSQL',
        category: SkillCategory.DATABASE,
        level: 90,
        years: 3,
        icon: '📊',
        description: 'MongoDB、Firestore、Redis、DynamoDB、Elasticsearch。ドキュメント指向DB、キー値ストア、キャッシュ戦略、分散システム、スケーラブルなデータ設計、集約パイプライン。',
        order: 21
    },

    // インフラ・DevOps
    {
        id: 'aws',
        name: 'AWS',
        category: SkillCategory.INFRASTRUCTURE,
        level: 75,
        years: 4,
        icon: '☁️',
        description: 'EC2、S3、RDS、Lambda、CloudFormation、ECS、EKS、API Gateway、CloudWatch。インフラの設計・構築・運用、IaC、コスト最適化、セキュリティ対策、監視・ログ管理。',
        order: 22
    },
    {
        id: 'docker',
        name: 'Docker',
        category: SkillCategory.INFRASTRUCTURE,
        level: 90,
        years: 4,
        icon: '🐳',
        description: 'コンテナ化、Docker Compose、Dockerfile最適化、マルチステージビルド、本番環境デプロイ、CI/CD統合、Kubernetes、セキュリティスキャン、イメージ最適化。',
        order: 23
    },

    // AI・機械学習
    {
        id: 'pytorch-ml',
        name: 'PyTorch・機械学習',
        category: SkillCategory.AI,
        level: 80,
        years: 4,
        icon: '🧠',
        description: 'PyTorch、Transformers（HuggingFace）、TRL（Transformer Reinforcement Learning）、自然言語処理、ファインチューニング、PEFT、LoRA、MLOps、モデル最適化、推論高速化。',
        order: 24
    },
    {
        id: 'dify',
        name: 'Dify',
        category: SkillCategory.AI,
        level: 90,
        years: 3,
        icon: '🤖',
        description: 'LLMアプリケーション開発プラットフォーム。RAG（Retrieval-Augmented Generation）、エージェント、ワークフロー設計、プロンプトエンジニアリング、ナレッジベース構築に精通。',
        order: 25
    },

    // Unity・ゲーム
    {
        id: 'unity',
        name: 'Unity',
        category: SkillCategory.UNITY,
        level: 80,
        years: 5,
        icon: '🎮',
        description: '2D/3Dゲーム開発、XR（VR/AR）アプリ開発、WebGL、モバイルゲーム開発。教育・指導経験あり。Physics、Animation、Shader、ScriptableObject、Addressables、パフォーマンス最適化。',
        order: 26
    },

    // デザイン・クリエイティブ
    {
        id: 'figma',
        name: 'Figma',
        category: SkillCategory.DESIGN,
        level: 70,
        years: 4,
        icon: '🎨',
        description: 'UI/UXデザイン、ワイヤーフレーム、プロトタイピング、デザインシステム構築、コンポーネント設計。開発者との連携、デザイントークン、レスポンシブデザイン、ユーザビリティテスト。',
        order: 27
    },
    {
        id: 'blender',
        name: 'Blender',
        category: SkillCategory.DESIGN,
        level: 80,
        years: 3,
        icon: '🟠',
        description: '3Dモデリング、スカルプティング、テクスチャリング、ライティング、アニメーション、レンダリング（Cycles、Eevee）。ゲーム・XRアプリ用ローポリ・ハイポリアセット制作、UV展開。',
        order: 28
    },
    {
        id: 'illustrator',
        name: 'Illustrator',
        category: SkillCategory.DESIGN,
        level: 70,
        years: 5,
        icon: '🟡',
        description: 'ベクターグラフィック、ロゴデザイン、アイコン制作、イラスト、印刷物デザイン。パスファインダー、ブレンドツール、グラデーションメッシュ、SVG最適化。',
        order: 29
    },
    {
        id: 'video-editing',
        name: 'After Effects・Premiere Pro',
        category: SkillCategory.DESIGN,
        level: 70,
        years: 5,
        icon: '🎬',
        description: '動画編集、カラーグレーディング、モーショングラフィックス、VFX、キーイング、トラッキング。プロモーション動画、チュートリアル動画、UI/UXデモ動画制作。',
        order: 30
    },

    // マネジメント・その他
    {
        id: 'project-management',
        name: 'プロジェクト管理・PM経験',
        category: SkillCategory.MANAGEMENT,
        level: 75,
        years: 2,
        icon: '📋',
        description: 'アジャイル開発（スクラム、カンバン）、チームリーダー経験、プロダクトマネジメント、スケジュール管理、リスク管理、ステークホルダー調整、品質管理、予算管理。',
        order: 31
    },
    {
        id: 'startup-experience',
        name: '立ち上げ経験・事業開発',
        category: SkillCategory.MANAGEMENT,
        level: 80,
        years: 3,
        icon: '🚀',
        description: '新規事業立ち上げ、0→1フェーズのプロダクト開発、MVP設計・開発、技術選定、システムアーキテクチャ設計、チーム構築、採用、事業戦略策定、市場分析。',
        order: 32
    }
];

// カテゴリ別のスキル取得
export const getSkillsByCategory = (category: SkillCategory) => {
    return initialSkillsData.filter(skill => skill.category === category);
};

// レベル別のスキル取得
export const getSkillsByLevel = (minLevel: number) => {
    return initialSkillsData.filter(skill => skill.level >= minLevel);
};

// 経験年数別のスキル取得
export const getSkillsByYears = (minYears: number) => {
    return initialSkillsData.filter(skill => skill.years >= minYears);
};