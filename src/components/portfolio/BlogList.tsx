"use client";

import React from 'react';
import Link from 'next/link';
import { BlogPost } from '@/types/portfolio';
import { formatDate } from '@/lib/utils';

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
    <div className="space-y-4">
      <div className="divide-y divide-gray-200 dark:divide-gray-700 border-2 border-black dark:border-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] dark:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)] bg-white dark:bg-gray-800">
        {displayPosts.map((post) => (
          <ArticleRow key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
};

interface ArticleRowProps {
  post: BlogPost;
}

const ArticleRow: React.FC<ArticleRowProps> = ({ post }) => {
  const href = post.externalUrl || `/portfolio/blog/${post.slug}`;
  const isExternal = !!post.externalUrl;

  const rowContent = (
    <>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          {post.category && (
            <span className="shrink-0 bg-yellow-400 text-black px-2 py-0.5 text-xs font-bold border border-black">
              {post.category}
            </span>
          )}
          <h3 className="text-base font-bold truncate group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-1">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs text-gray-500 dark:text-gray-400"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3 shrink-0">
        {post.publishedAt && (
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">
            {formatDate(post.publishedAt)}
          </span>
        )}
        {isExternal ? (
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        ) : (
          <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
      </div>
    </>
  );

  const className = "flex items-center justify-between gap-4 px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors group";

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
        {rowContent}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {rowContent}
    </Link>
  );
};

export default BlogList;
