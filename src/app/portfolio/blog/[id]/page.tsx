"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getBlogPost, getBlogPosts } from "@/lib/dataService";
import Link from "next/link";
import Image from "next/image";
import { marked } from "marked";
import { BlogPost } from "@/types/portfolio";
import { formatDate } from "@/lib/utils";

// Configure marked for better markdown parsing
marked.setOptions({
  breaks: true,
  gfm: true,
});

const BlogDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [htmlContent, setHtmlContent] = useState("");
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);

  const fetchRelatedPosts = async (currentPost: BlogPost) => {
    try {
      const allPosts = await getBlogPosts(true, 10); // published only, limit 10
      const related = allPosts
        .filter(post => post.id !== currentPost.id)
        .filter(post =>
          post.category === currentPost.category ||
          post.tags.some(tag => currentPost.tags.includes(tag))
        )
        .slice(0, 3);
      setRelatedPosts(related);
    } catch (error) {
      console.error("Error fetching related posts:", error);
    }
  };

  const fetchPost = async (identifier: string) => {
    try {
      const postData = await getBlogPost(identifier);

      if (postData) {
        setPost(postData);

        // Parse Markdown content
        const html = await marked(postData.content);
        setHtmlContent(html);

        // Fetch related posts
        fetchRelatedPosts(postData);
      } else {
        // Fallback to sample data for demo
        setSamplePost(identifier);
      }
    } catch (error) {
      console.error("Error fetching blog post:", error);
      setSamplePost(identifier);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchPost(params.id as string);
    }
  }, [fetchPost, params.id]);

  const setSamplePost = async (identifier: string) => {
    const samplePosts: BlogPost[] = [
      {
        id: "1",
        title: "Next.js 14とApp Routerで作るモダンなポートフォリオサイト",
        slug: "nextjs-14-portfolio-site",
        excerpt: "Next.js 14の新機能App Routerを使用して、パフォーマンスとSEOに優れたポートフォリオサイトを構築する方法を詳しく解説します。",
        content: `# Next.js 14とApp Routerで作るモダンなポートフォリオサイト

Next.js 14では、App Routerという新しいルーティングシステムが導入されました。この記事では、App Routerを使用してモダンなポートフォリオサイトを構築する方法を詳しく解説します。

## App Routerの特徴

App Routerは以下のような特徴があります：

- **ファイルベースルーティング**: \`app\`ディレクトリ内のフォルダ構造がそのままURLになります
- **レイアウトシステム**: 共通レイアウトを効率的に管理できます
- **Server Components**: サーバーサイドでレンダリングされるコンポーネント
- **ストリーミング**: ページの一部を段階的に読み込み可能

## 実装例

\`\`\`typescript
// app/page.tsx
export default function HomePage() {
  return (
    <div>
      <h1>Welcome to My Portfolio</h1>
    </div>
  );
}
\`\`\`

## まとめ

Next.js 14のApp Routerを使用することで、より効率的で保守性の高いポートフォリオサイトを構築できます。`,
        thumbnail: "/placeholder-blog.svg",
        category: "Web Development",
        tags: ["Next.js", "React", "TypeScript", "Portfolio"],
        readTime: 8,
        published: true,
        publishedAt: new Date("2024-01-15"),
        createdAt: new Date("2024-01-15"),
        updatedAt: new Date("2024-01-15"),
      },
      {
        id: "2",
        title: "Tailwind CSSとNeobrutalism UIで作る印象的なデザイン",
        slug: "tailwind-neobrutalism-design",
        excerpt: "Neobrutalism UIデザインの特徴である太いボーダー、鮮やかな色彩、大胆なタイポグラフィをTailwind CSSで実装する方法を紹介します。",
        content: `# Tailwind CSSとNeobrutalism UIで作る印象的なデザイン

Neobrutalism UIは、ブルータリズム建築からインスピレーションを得たデザインスタイルです。太いボーダー、鮮やかな色彩、大胆なタイポグラフィが特徴的です。

## Neobrutalism UIの特徴

- **太いボーダー**: 3-5pxの黒いボーダー
- **シャドウ効果**: オフセットシャドウ
- **鮮やかな色彩**: 高コントラストカラー
- **大胆なタイポグラフィ**: 太字フォント

## Tailwind CSSでの実装

\`\`\`css
.neo-button {
  @apply bg-white border-4 border-black font-bold px-6 py-3 
         shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] 
         hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] 
         hover:translate-x-[2px] hover:translate-y-[2px] 
         transition-all duration-150;
}
\`\`\`

このスタイルにより、印象的で現代的なUIを作成できます。`,
        thumbnail: "/placeholder-blog.svg",
        category: "Design",
        tags: ["Tailwind CSS", "UI Design", "Neobrutalism", "CSS"],
        readTime: 6,
        published: true,
        publishedAt: new Date("2024-01-10"),
        createdAt: new Date("2024-01-10"),
        updatedAt: new Date("2024-01-10"),
      },
    ];

    const foundPost = samplePosts.find(p => p.id === identifier || p.slug === identifier);
    if (foundPost) {
      setPost(foundPost);
      const html = await marked(foundPost.content);
      setHtmlContent(html);
      setRelatedPosts(samplePosts.filter(p => p.id !== foundPost.id).slice(0, 2));
    } else {
      router.push("/portfolio/blog");
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="neo-card bg-gray-50 dark:bg-gray-800 max-w-md mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-300 rounded"></div>
            <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            <div className="h-4 bg-gray-300 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="neo-card bg-gray-50 dark:bg-gray-800 max-w-md mx-auto text-center">
          <h2 className="text-xl font-bold mb-4">記事が見つかりません</h2>
          <Link
            href="/portfolio/blog"
            className="neo-button bg-blue-400 hover:bg-blue-500 text-black"
          >
            ブログ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Back Navigation */}
      <div className="neo-section border-b-4 border-black bg-gray-50 dark:bg-gray-800">
        <div className="neo-container py-4">
          <Link
            href="/portfolio/blog"
            className="inline-flex items-center gap-2 neo-button bg-white hover:bg-gray-50 text-black"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ブログ一覧に戻る
          </Link>
        </div>
      </div>

      <article className="neo-container py-12 max-w-4xl">
        {/* Hero Image */}
        {post.thumbnail && (
          <div className="relative h-64 md:h-96 mb-8 overflow-hidden neo-card">
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}

        {/* Article Header */}
        <header className="mb-8">
          {/* Category Badge */}
          <div className="mb-4">
            <span className="bg-yellow-400 text-black px-4 py-2 font-bold border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              {post.category}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-5xl font-black mb-6 leading-tight">
            {post.title}
          </h1>

          {/* Meta Information */}
          <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-400 mb-6">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <time>{formatDate(post.publishedAt)}</time>
            </div>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>{post.readTime}分で読める</span>
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-3 py-1 text-sm font-medium border-2 border-gray-300 dark:border-gray-600"
              >
                #{tag}
              </span>
            ))}
          </div>
        </header>

        {/* Article Content */}
        <div
          className="prose prose-lg max-w-none mb-12
                     prose-headings:font-black prose-headings:text-black dark:prose-headings:text-white
                     prose-p:text-gray-700 dark:prose-p:text-gray-300
                     prose-a:text-blue-600 dark:prose-a:text-blue-400 prose-a:font-bold
                     prose-strong:text-black dark:prose-strong:text-white
                     prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:font-mono
                     prose-pre:bg-gray-900 prose-pre:border-4 prose-pre:border-black prose-pre:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                     prose-blockquote:border-l-4 prose-blockquote:border-yellow-400 prose-blockquote:bg-yellow-50 dark:prose-blockquote:bg-yellow-900/20 prose-blockquote:p-4
                     prose-ul:list-disc prose-ol:list-decimal
                     prose-li:text-gray-700 dark:prose-li:text-gray-300"
          dangerouslySetInnerHTML={{ __html: htmlContent }}
        />

        {/* Related Posts */}
        {relatedPosts.length > 0 && (
          <section className="border-t-4 border-black pt-12">
            <h2 className="text-2xl md:text-3xl font-black mb-8">関連記事</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Link
                  key={relatedPost.id}
                  href={`/portfolio/blog/${relatedPost.slug}`}
                  className="block group"
                >
                  <article className="neo-card bg-white dark:bg-gray-800 overflow-hidden h-full hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
                    <div className="relative h-32 overflow-hidden">
                      <Image
                        src={relatedPost.thumbnail || '/placeholder-blog.svg'}
                        alt={relatedPost.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                        {relatedPost.excerpt}
                      </p>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to Blog */}
        <div className="text-center mt-12 pt-8 border-t-4 border-black">
          <Link
            href="/portfolio/blog"
            className="neo-button bg-blue-400 hover:bg-blue-500 text-black inline-flex items-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            ブログ一覧に戻る
          </Link>
        </div>
      </article>
    </div>
  );
};

export default BlogDetailPage;