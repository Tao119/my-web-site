import { NextRequest, NextResponse } from "next/server";
import {
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    serverTimestamp,
    collection,
    query,
    where,
    getDocs
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { BlogPost } from "@/types/portfolio";

// GET /api/admin/blog/posts/[id] - Get single blog post
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        const data = docSnap.data();
        const post: BlogPost = {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
            publishedAt: data.publishedAt?.toDate() || null,
        } as BlogPost;

        return NextResponse.json({
            success: true,
            post,
        });
    } catch (error) {
        // エラーログを無効化
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

        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        const updateData: any = {
            title: body.title,
            slug: body.slug,
            excerpt: body.excerpt || "",
            content: body.content,
            thumbnail: body.thumbnail || "",
            category: body.category || "",
            tags: body.tags || [],
            readTime: body.readTime || 0,
            published: body.published || false,
            updatedAt: serverTimestamp(),
        };

        // Update publishedAt only if publishing for the first time
        const currentData = docSnap.data();
        if (body.published && !currentData.published) {
            updateData.publishedAt = serverTimestamp();
        } else if (!body.published) {
            updateData.publishedAt = null;
        }

        await updateDoc(docRef, updateData);

        // Fetch updated document
        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();
        const updatedPost: BlogPost = {
            id: updatedDoc.id,
            ...updatedData,
            createdAt: updatedData?.createdAt?.toDate() || new Date(),
            updatedAt: updatedData?.updatedAt?.toDate() || new Date(),
            publishedAt: updatedData?.publishedAt?.toDate() || null,
        } as BlogPost;

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

        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        const updateData: any = {
            ...body,
            updatedAt: serverTimestamp(),
        };

        // Handle publishedAt when toggling publish status
        if (typeof body.published === "boolean") {
            const currentData = docSnap.data();
            if (body.published && !currentData.published) {
                updateData.publishedAt = serverTimestamp();
            } else if (!body.published) {
                updateData.publishedAt = null;
            }
        }

        await updateDoc(docRef, updateData);

        // Fetch updated document
        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();
        const updatedPost: BlogPost = {
            id: updatedDoc.id,
            ...updatedData,
            createdAt: updatedData?.createdAt?.toDate() || new Date(),
            updatedAt: updatedData?.updatedAt?.toDate() || new Date(),
            publishedAt: updatedData?.publishedAt?.toDate() || null,
        } as BlogPost;

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
        const docRef = doc(db, "blog", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Blog post not found" },
                { status: 404 }
            );
        }

        await deleteDoc(docRef);

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