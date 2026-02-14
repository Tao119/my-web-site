"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/portfolio';
import { formatDate, isValidImageUrl } from '@/lib/utils';

interface BlogListProps {
  posts: BlogPost[];
  showCount?: number;
}

const BlogList: React.FC<BlogListProps> = ({
  posts,
  showCount = 6,
}) => {
  const displayPosts = showCount > 0 ? posts.slice(0, showCount) : posts;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="neo-card bg-gray-50 dark:bg-gray-800 max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">記事がありません</h3>
          <p className="text-gray-600 dark:text-gray-400">
            管理画面から記事を追加してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post, index) => (
          <ArticleCard key={post.id} post={post} index={index} />
        ))}
      </div>

      {posts.length > showCount && (
        <div className="text-center">
          <Link
            href="/portfolio/blog"
            className="neo-button inline-flex items-center gap-2 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-black dark:text-white px-6 py-3 font-bold"
          >
            すべての記事を見る
            <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

interface ArticleCardProps {
  post: BlogPost;
  index: number;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ post, index }) => {
  const href = post.externalUrl || `/portfolio/blog/${post.slug}`;
  const isExternal = !!post.externalUrl;
  const [imgError, setImgError] = useState(false);

  const cardContent = (
    <article
      className="h-full overflow-hidden border-4 border-black dark:border-white bg-white dark:bg-gray-800 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] dark:shadow-[6px_6px_0px_0px_rgba(255,255,255,0.15)] transition-all duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1 group-hover:shadow-[10px_10px_0px_0px_rgba(0,0,0,1)] dark:group-hover:shadow-[10px_10px_0px_0px_rgba(255,255,255,0.2)]"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 dark:from-blue-900 dark:via-indigo-800 dark:to-purple-900">
        {post.thumbnail && isValidImageUrl(post.thumbnail) && !imgError ? (
          <img
            src={post.thumbnail}
            alt={post.title}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={() => setImgError(true)}
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <svg className="w-12 h-12 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
        )}

        {/* Category badge overlay */}
        {post.category && (
          <span className="absolute top-3 left-3 bg-yellow-400 text-black px-2.5 py-1 text-xs font-black border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-wide">
            {post.category}
          </span>
        )}

        {/* External badge */}
        {isExternal && (
          <span className="absolute top-3 right-3 bg-white text-black px-2 py-1 text-xs font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <svg className="w-3 h-3 inline-block mr-0.5 -mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
            外部
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-black mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {/* Meta */}
        <div className="flex items-center justify-between mb-3">
          {post.publishedAt && (
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(post.publishedAt)}
            </span>
          )}
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 border border-gray-200 dark:border-gray-600"
              >
                #{tag}
              </span>
            ))}
            {post.tags.length > 3 && (
              <span className="text-xs text-gray-400 dark:text-gray-500 px-1">
                +{post.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </article>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block group">
        {cardContent}
      </a>
    );
  }

  return (
    <Link href={href} className="block group">
      {cardContent}
    </Link>
  );
};

export default BlogList;
