import { NextRequest, NextResponse } from "next/server";
import {
    collection,
    query,
    where,
    getDocs,
} from "firebase/firestore";
import { getFirestoreInstance } from "@/lib/firebase";
import { getBlogPost, updateBlogPost, deleteBlogPost } from "@/lib/dataService";

// GET /api/admin/blog/posts/[id] - Get single blog post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const post = await getBlogPost(id);

        if (!post) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            post,
        });
    } catch (error) {
        console.error("Error fetching blog post:", error);
        return NextResponse.json(
            { success: false, error: "Failed to fetch blog post" },
            { status: 500 }
        );
    }
}

// PUT /api/admin/blog/posts/[id] - Update blog post
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate required fields
        if (!body.title || !body.slug || !body.content) {
            return NextResponse.json(
                { success: false, error: "Title, slug, and content are required" },
                { status: 400 }
            );
        }

        // Check if slug already exists (excluding current post)
        const db = getFirestoreInstance();
        const existingQuery = query(
            collection(db, "blog"),
            where("slug", "==", body.slug)
        );
        const existingDocs = await getDocs(existingQuery);
        const conflictingPost = existingDocs.docs.find(doc => doc.id !== id);
        if (conflictingPost) {
            return NextResponse.json(
                { success: false, error: "A post with this slug already exists" },
                { status: 400 }
            );
        }

        // Check if post exists
        const existing = await getBlogPost(id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        const updateData: Record<string, unknown> = {
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt || "",
            content: body.content,
            thumbnail: body.thumbnail || "",
            category: body.category || "",
            tags: body.tags || [],
            readTime: body.readTime || 0,
            published: body.published || false,
        };

        // Update publishedAt only if publishing for the first time
        if (body.published && !existing.published) {
            updateData.publishedAt = new Date().toISOString();
        } else if (!body.published) {
            updateData.publishedAt = null;
        }

        await updateBlogPost(id, updateData);

        // Fetch updated document
        const updatedPost = await getBlogPost(id);

        return NextResponse.json({
            success: true,
            message: "Blog post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update blog post" },
            { status: 500 }
        );
    }
}

// PATCH /api/admin/blog/posts/[id] - Partial update (e.g., toggle publish status)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const existing = await getBlogPost(id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        const updateData: Record<string, unknown> = { ...body };

        // Handle publishedAt when toggling publish status
        if (typeof body.published === "boolean") {
            if (body.published && !existing.published) {
                updateData.publishedAt = new Date().toISOString();
            } else if (!body.published) {
                updateData.publishedAt = null;
            }
        }

        await updateBlogPost(id, updateData);

        // Fetch updated document
        const updatedPost = await getBlogPost(id);

        return NextResponse.json({
            success: true,
            message: "Blog post updated successfully",
            post: updatedPost,
        });
    } catch (error) {
        console.error("Error updating blog post:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update blog post" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/blog/posts/[id] - Delete blog post
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;

        const existing = await getBlogPost(id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        await deleteBlogPost(id);

        return NextResponse.json({
            success: true,
            message: "Blog post deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting blog post:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete blog post" },
            { status: 500 }
        );
    }
}
