"use client";

import { useState, useEffect, useMemo } from "react";
import { getBlogPosts } from "@/lib/dataService";
import Link from "next/link";
import { BlogPost } from "@/types/portfolio";
import { formatDate, debounce, isValidImageUrl } from "@/lib/utils";
// Simple SVG icon components
const MagnifyingGlassIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
  </svg>
);

const ChevronLeftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const POSTS_PER_PAGE = 6;

const BlogPage = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState<"order" | "publishedAt" | "title">("order");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const postsList = await getBlogPosts(true); // published only
      setPosts(postsList);
    } catch {
      // Firestore未接続時は空配列のまま
    } finally {
      setLoading(false);
    }
  };

  // Debounced search function
  const debouncedSearch = useMemo(
    () => debounce((query: string) => {
      setSearchQuery(query);
      setCurrentPage(1);
    }, 300),
    []
  );

  // Extract all categories and tags
  const allCategories = Array.from(
    new Set(posts.map(post => post.category))
  ).sort();

  const allTags = Array.from(
    new Set(posts.flatMap(post => post.tags))
  ).sort();

  // Filter and sort posts
  const filteredAndSortedPosts = useMemo(() => {
    let filtered = posts;

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(post => post.category === selectedCategory);
    }

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(post => post.tags.includes(selectedTag));
    }

    // Sort posts
    if (sortBy !== "order") {
      filtered.sort((a, b) => {
        if (sortBy === "publishedAt") {
          const dateA = new Date(a.publishedAt).getTime();
          const dateB = new Date(b.publishedAt).getTime();
          return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
        } else {
          return sortOrder === "desc"
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        }
      });
    }
    // sortBy === "order" の場合はAPIから返された順序（order優先）を維持

    return filtered;
  }, [posts, searchQuery, selectedCategory, selectedTag, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredAndSortedPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedTag(null);
    setSearchQuery("");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="neo-section bg-yellow-400 border-b-4 border-black">
        <div className="neo-container">
          <div className="text-center py-12">
            <h1 className="text-4xl md:text-6xl font-black mb-4 text-black">
              BLOG
            </h1>
            <p className="text-lg md:text-xl font-bold text-black max-w-2xl mx-auto">
              技術記事、開発日記、学習メモなど
            </p>
          </div>
        </div>
      </div>

      <div className="neo-container py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="記事を検索..."
                className="neo-input w-full pl-12 pr-4 py-3 text-black"
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 justify-center">
            {/* Sort Options */}
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm">並び順:</span>
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [newSortBy, newSortOrder] = e.target.value.split('-') as [typeof sortBy, typeof sortOrder];
                  setSortBy(newSortBy);
                  setSortOrder(newSortOrder);
                }}
                className="neo-input text-sm px-3 py-2"
              >
                <option value="order-asc">おすすめ順</option>
                <option value="publishedAt-desc">新しい順</option>
                <option value="publishedAt-asc">古い順</option>
                <option value="title-asc">タイトル順</option>
              </select>
            </div>

            {/* Clear Filters */}
            {(selectedCategory || selectedTag || searchQuery) && (
              <button
                onClick={clearFilters}
                className="neo-button bg-red-400 hover:bg-red-500 text-black text-sm px-4 py-2"
              >
                フィルターをクリア
              </button>
            )}
          </div>

          {/* Category Filter */}
          {allCategories.length > 0 && (
            <div className="text-center">
              <div className="inline-flex flex-wrap gap-2 justify-center">
                <button
                  className={`neo-button text-sm px-4 py-2 ${!selectedCategory
                    ? "bg-blue-400 text-black"
                    : "bg-white hover:bg-gray-50 text-black"
                    }`}
                  onClick={() => {
                    setSelectedCategory(null);
                    setCurrentPage(1);
                  }}
                >
                  すべて
                </button>
                {allCategories.map((category) => (
                  <button
                    key={category}
                    className={`neo-button text-sm px-4 py-2 ${selectedCategory === category
                      ? "bg-blue-400 text-black"
                      : "bg-white hover:bg-gray-50 text-black"
                      }`}
                    onClick={() => {
                      setSelectedCategory(category);
                      setCurrentPage(1);
                    }}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tag Filter */}
          {allTags.length > 0 && (
            <div className="text-center">
              <div className="inline-flex flex-wrap gap-2 justify-center max-w-4xl">
                {allTags.map((tag) => (
                  <button
                    key={tag}
                    className={`text-xs px-3 py-1 border-2 border-black font-medium transition-all ${selectedTag === tag
                      ? "bg-pink-400 text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700 hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      }`}
                    onClick={() => {
                      setSelectedTag(selectedTag === tag ? null : tag);
                      setCurrentPage(1);
                    }}
                  >
                    #{tag}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Results Info */}
        <div className="text-center mb-8">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredAndSortedPosts.length}件の記事が見つかりました
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="text-center py-12">
            <div className="neo-card bg-gray-50 dark:bg-gray-800 max-w-md mx-auto">
              <div className="animate-pulse">
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Blog Posts Grid */}
            {paginatedPosts.length === 0 ? (
              <div className="text-center py-12">
                <div className="neo-card bg-gray-50 dark:bg-gray-800 max-w-md mx-auto">
                  <h3 className="text-xl font-bold mb-2">記事が見つかりません</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    検索条件を変更してお試しください。
                  </p>
                  <button
                    onClick={clearFilters}
                    className="neo-button bg-blue-400 hover:bg-blue-500 text-black"
                  >
                    フィルターをクリア
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {paginatedPosts.map((post) => (
                  <BlogPostCard key={post.id} post={post} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="neo-button bg-white hover:bg-gray-50 text-black disabled:opacity-50 disabled:cursor-not-allowed p-2"
                >
                  <ChevronLeftIcon className="w-5 h-5" />
                </button>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`neo-button px-4 py-2 ${currentPage === page
                      ? "bg-blue-400 text-black"
                      : "bg-white hover:bg-gray-50 text-black"
                      }`}
                  >
                    {page}
                  </button>
                ))}

                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="neo-button bg-white hover:bg-gray-50 text-black disabled:opacity-50 disabled:cursor-not-allowed p-2"
                >
                  <ChevronRightIcon className="w-5 h-5" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

interface BlogPostCardProps {
  post: BlogPost;
}

const BlogPostCard: React.FC<BlogPostCardProps> = ({ post }) => {
  const href = post.externalUrl || `/portfolio/blog/${post.slug}`;
  const isExternal = !!post.externalUrl;
  const [imgError, setImgError] = useState(false);

  const hasThumbnail = post.thumbnail && isValidImageUrl(post.thumbnail) && !imgError;

  const cardContent = (
    <article className="neo-card bg-white dark:bg-gray-800 overflow-hidden h-full hover:shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] dark:hover:shadow-[12px_12px_0px_0px_rgba(255,255,255,0.2)] transition-all duration-200 group-hover:-translate-x-1 group-hover:-translate-y-1">
      {/* Thumbnail */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-yellow-400 via-orange-400 to-pink-500 dark:from-blue-900 dark:via-indigo-800 dark:to-purple-900">
        {hasThumbnail ? (
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
            外部記事
          </span>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-black mb-3 line-clamp-2 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {/* Meta Information */}
        <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-3">
          <div className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-xs">{formatDate(post.publishedAt)}</span>
          </div>

          {isExternal ? (
            <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          )}
        </div>

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {post.tags.slice(0, 4).map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 border border-gray-200 dark:border-gray-600"
              >
                #{tag}
              </span>
            ))}
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

export default BlogPage;
