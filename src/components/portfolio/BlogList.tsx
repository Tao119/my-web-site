"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { BlogPost } from '@/types/portfolio';
import { formatDate, calculateReadingTime } from '@/lib/utils';

interface BlogListProps {
  posts: BlogPost[];
  showCount?: number;
  showViewAll?: boolean;
}

const BlogList: React.FC<BlogListProps> = ({
  posts,
  showCount = 3,
  showViewAll = true
}) => {
  const displayPosts = showCount > 0 ? posts.slice(0, showCount) : posts;

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="neo-card bg-gray-50 dark:bg-gray-800 max-w-md mx-auto">
          <h3 className="text-xl font-bold mb-2">ブログ記事がありません</h3>
          <p className="text-gray-600 dark:text-gray-400">
            管理画面からブログ記事を追加してください。
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Blog Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayPosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>

      {/* View All Button */}
      {showViewAll && posts.length > showCount && (
        <div className="text-center">
          <Link
            href="/portfolio/blog"
            className="neo-button bg-white hover:bg-gray-50 text-black inline-flex items-center gap-2"
          >
            すべての記事を見る
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
};

interface BlogCardProps {
  post: BlogPost;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  return (
    <Link href={`/portfolio/blog/${post.slug}`} className="block group">
      <article className="neo-card bg-white dark:bg-gray-800 overflow-hidden h-full hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-300 group-hover:-translate-x-1 group-hover:-translate-y-1">
        {/* Thumbnail */}
        <div className="relative h-48 overflow-hidden">
          <Image
            src={post.thumbnail || '/placeholder-blog.svg'}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />

          {/* Category Badge */}
          <div className="absolute top-4 left-4">
            <span className="bg-yellow-400 text-black px-3 py-1 text-sm font-bold border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              {post.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Title */}
          <h3 className="text-xl font-bold mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3 text-sm leading-relaxed">
            {post.excerpt}
          </p>

          {/* Meta Information */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-4">
              {/* Published Date */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span>{formatDate(post.publishedAt)}</span>
              </div>

              {/* Read Time */}
              <div className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{post.readTime}分</span>
              </div>
            </div>

            {/* Read More Arrow */}
            <div className="text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {post.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 text-xs font-medium border border-gray-300 dark:border-gray-600"
                >
                  #{tag}
                </span>
              ))}
              {post.tags.length > 3 && (
                <span className="text-gray-500 dark:text-gray-400 text-xs">
                  +{post.tags.length - 3}
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
};

export default BlogList;