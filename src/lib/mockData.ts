// モックデータ - オフライン時やFirestore接続エラー時のフォールバック
import { Profile, Project, BlogPost, Skill, SkillCategory, ProjectCategory } from '@/types/portfolio'

export const mockProfile: Profile = {
    id: 'mock-profile',
    name: 'サンプル太郎',
    title: 'フルスタック開発者',
    bio: 'モダンなWebアプリケーション開発を専門とするフルスタック開発者です。\n\nReact、Next.js、Node.jsを中心とした技術スタックで、ユーザー体験を重視したアプリケーションを開発しています。\n\n常に新しい技術にチャレンジし、効率的で保守性の高いコードを心がけています。',
    email: 'sample@example.com',
    location: '東京, 日本',
    avatar: '/images/avatar-placeholder.jpg',
    socialLinks: {
        github: 'https://github.com/sample',
        linkedin: 'https://linkedin.com/in/sample',
        x: 'https://x.com/sample'
    },
    experience: [
        {
            company: 'サンプル株式会社',
            position: 'シニアフロントエンド開発者',
            startDate: '2022年4月',
            description: 'React/Next.jsを使用したWebアプリケーションの設計・開発・運用を担当。チームリードとして5名のメンバーをマネジメント。'
        },
        {
            company: 'テック企業A',
            position: 'フロントエンド開発者',
            startDate: '2022年4月',
            description: 'Vue.js/Nuxt.jsを使用したSPAの開発。UI/UXの改善とパフォーマンス最適化を実施。'
        }
    ],
    education: [
        {
            institution: 'サンプル大学',
            degree: '情報工学科 学士',
            startDate: '2016年4月',
            description: 'コンピュータサイエンスの基礎を学習。卒業研究では機械学習を用いた画像認識システムを開発。'
        }
    ],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01')
}

export const mockSkills: Skill[] = [
    {
        id: 'react',
        name: 'React',
        level: 90,
        years: 4,
        category: SkillCategory.FRONTEND,
        description: 'モダンなReactアプリケーションの開発経験が豊富',
        icon: '⚛️',
        order: 1,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'nextjs',
        name: 'Next.js',
        level: 85,
        years: 3,
        category: SkillCategory.FRONTEND,
        description: 'SSR/SSGを活用したパフォーマンスの高いWebアプリケーション開発',
        icon: '▲',
        order: 2,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'typescript',
        name: 'TypeScript',
        level: 88,
        years: 3,
        category: SkillCategory.FRONTEND,
        description: '型安全なコード開発とチーム開発での品質向上',
        icon: '🔷',
        order: 3,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'nodejs',
        name: 'Node.js',
        level: 80,
        years: 3,
        category: SkillCategory.BACKEND,
        description: 'RESTful APIとGraphQL APIの設計・開発',
        icon: '🟢',
        order: 4,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'firebase',
        name: 'Firebase',
        level: 75,
        years: 2,
        category: SkillCategory.BACKEND,
        description: 'Firestore、Authentication、Hostingを活用したBaaS開発',
        icon: '🔥',
        order: 5,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    },
    {
        id: 'docker',
        name: 'Docker',
        level: 70,
        years: 2,
        category: SkillCategory.INFRASTRUCTURE,
        description: 'コンテナ化による開発環境の統一と本番デプロイ',
        icon: '🐳',
        order: 6,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01')
    }
]

export const mockProjects: Project[] = [
    {
        id: 'portfolio-site',
        title: 'ポートフォリオサイト',
        description: 'Next.js 14とFirebaseを使用したモダンなポートフォリオサイト。レスポンシブデザイン、アクセシビリティ対応、パフォーマンス最適化を実装。',
        thumbnail: '/images/project-portfolio.jpg',
        images: ['/images/project-portfolio-1.jpg', '/images/project-portfolio-2.jpg'],
        technologies: ['Next.js', 'TypeScript', 'Firebase', 'SCSS', 'Vercel'],
        category: ProjectCategory.WEB,
        demoUrl: 'https://portfolio.example.com',
        githubUrl: 'https://github.com/sample/portfolio',
        featured: true,
        status: 'completed',
        startDate: new Date('2024-10-01'),
        endDate: new Date('2024-12-01'),
        order: 1,
        published: true,
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-12-01')
    },
    {
        id: 'task-manager',
        title: 'タスク管理アプリ',
        description: 'チーム向けのタスク管理アプリケーション。リアルタイム同期、ドラッグ&ドロップ、通知機能を実装。',
        thumbnail: '/images/project-task.jpg',
        images: ['/images/project-task-1.jpg'],
        technologies: ['React', 'Node.js', 'Socket.io', 'MongoDB', 'Material-UI'],
        category: ProjectCategory.WEB,
        demoUrl: 'https://taskmanager.example.com',
        githubUrl: 'https://github.com/sample/task-manager',
        featured: true,
        status: 'completed',
        startDate: new Date('2024-06-01'),
        endDate: new Date('2024-09-01'),
        order: 2,
        published: true,
        createdAt: new Date('2024-06-01'),
        updatedAt: new Date('2024-09-01')
    },
    {
        id: 'ecommerce-site',
        title: 'ECサイト',
        description: 'モバイルファーストなECサイト。決済機能、在庫管理、管理画面を含む包括的なソリューション。',
        thumbnail: '/images/project-ecommerce.jpg',
        images: ['/images/project-ecommerce-1.jpg', '/images/project-ecommerce-2.jpg'],
        technologies: ['Vue.js', 'Nuxt.js', 'Stripe', 'PostgreSQL', 'AWS'],
        category: ProjectCategory.WEB,
        demoUrl: 'https://shop.example.com',
        githubUrl: 'https://github.com/sample/ecommerce',
        featured: false,
        status: 'completed',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-05-01'),
        order: 3,
        published: true,
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-05-01')
    }
]

export const mockBlogPosts: BlogPost[] = [
    {
        id: 'next-js-14-features',
        title: 'Next.js 14の新機能を徹底解説',
        content: `# Next.js 14の新機能を徹底解説

Next.js 14がリリースされ、多くの新機能と改善が追加されました。この記事では、主要な新機能について詳しく解説します。

## Server Actions

Server Actionsは、サーバーサイドでの処理を簡単に実装できる新機能です。

\`\`\`typescript
async function createPost(formData: FormData) {
  'use server'
  
  const title = formData.get('title') as string
  const content = formData.get('content') as string
  
  // データベースに保存
  await db.posts.create({ title, content })
}
\`\`\`

## Turbopack

開発時のビルド速度が大幅に向上しました。

## まとめ

Next.js 14は開発体験を大きく向上させる素晴らしいアップデートです。`,
        excerpt: 'Next.js 14の主要な新機能であるServer ActionsやTurbopackについて詳しく解説します。',
        slug: 'next-js-14-features',
        category: 'Web Development',
        tags: ['Next.js', 'React', 'Web開発'],
        readTime: 8,
        published: true,
        featured: true,
        thumbnail: '/images/blog-nextjs14.jpg',
        publishedAt: new Date('2024-11-01'),
        createdAt: new Date('2024-11-01'),
        updatedAt: new Date('2024-11-01')
    },
    {
        id: 'react-performance-tips',
        title: 'Reactパフォーマンス最適化のベストプラクティス',
        content: `# Reactパフォーマンス最適化のベストプラクティス

Reactアプリケーションのパフォーマンスを向上させるための実践的なテクニックを紹介します。

## 1. React.memo の活用

不要な再レンダリングを防ぐためにReact.memoを使用しましょう。

\`\`\`typescript
const MyComponent = React.memo(({ data }) => {
  return <div>{data.name}</div>
})
\`\`\`

## 2. useMemo と useCallback

計算コストの高い処理やコールバック関数をメモ化します。

\`\`\`typescript
const expensiveValue = useMemo(() => {
  return heavyCalculation(data)
}, [data])

const handleClick = useCallback(() => {
  onClick(id)
}, [onClick, id])
\`\`\`

## まとめ

これらのテクニックを適切に使用することで、Reactアプリケーションのパフォーマンスを大幅に改善できます。`,
        excerpt: 'Reactアプリケーションのパフォーマンスを向上させるための実践的なテクニックを紹介します。',
        slug: 'react-performance-tips',
        category: 'Web Development',
        tags: ['React', 'パフォーマンス', 'JavaScript'],
        readTime: 6,
        published: true,
        featured: false,
        thumbnail: '/images/blog-react-performance.jpg',
        publishedAt: new Date('2024-10-15'),
        createdAt: new Date('2024-10-15'),
        updatedAt: new Date('2024-10-15')
    },
    {
        id: 'typescript-advanced-types',
        title: 'TypeScript高度な型システムの活用法',
        content: `# TypeScript高度な型システムの活用法

TypeScriptの高度な型システムを活用して、より安全で保守性の高いコードを書く方法を解説します。

## Conditional Types

条件に基づいて型を決定するConditional Typesの使い方。

\`\`\`typescript
type ApiResponse<T> = T extends string 
  ? { message: T } 
  : { data: T }
\`\`\`

## Mapped Types

既存の型から新しい型を生成するMapped Types。

\`\`\`typescript
type Partial<T> = {
  [P in keyof T]?: T[P]
}
\`\`\`

## まとめ

TypeScriptの高度な型システムを理解することで、より堅牢なアプリケーションを構築できます。`,
        excerpt: 'TypeScriptの高度な型システムを活用して、より安全で保守性の高いコードを書く方法を解説します。',
        slug: 'typescript-advanced-types',
        category: 'Programming',
        tags: ['TypeScript', '型システム', 'プログラミング'],
        readTime: 10,
        published: true,
        featured: false,
        thumbnail: '/images/blog-typescript.jpg',
        publishedAt: new Date('2024-10-01'),
        createdAt: new Date('2024-10-01'),
        updatedAt: new Date('2024-10-01')
    }
]

// オフライン検出とモックデータの使用判定
export const isOffline = (): boolean => {
    if (typeof window === 'undefined') return false
    return !navigator.onLine
}

// Firebase接続エラーの判定
export const isFirebaseError = (error: any): boolean => {
    return error?.code === 'unavailable' ||
        error?.message?.includes('offline') ||
        error?.message?.includes('network') ||
        error?.message?.includes('connection')
}

// モックデータを使用するかの判定
export const shouldUseMockData = (error?: any): boolean => {
    return isOffline() || (error && isFirebaseError(error))
}