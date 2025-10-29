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
import { Project } from "@/types/portfolio";

// GET /api/admin/projects/[id] - Get single project
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        const data = docSnap.data();
        const project: Project = {
            id: docSnap.id,
            ...data,
            createdAt: data.createdAt?.toDate() || new Date(),
            updatedAt: data.updatedAt?.toDate() || new Date(),
        } as Project;

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Failed to fetch project" },
            { status: 500 }
        );
    }
}

// PUT /api/admin/projects/[id] - Update project
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        // Validate required fields
        if (!body.title) {
            return NextResponse.json(
                { success: false, error: "Title is required" },
                { status: 400 }
            );
        }

        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        const updateData: any = {
            title: body.title,
            description: body.description || "",
            thumbnail: body.thumbnail || "",
            images: body.images || [],
            technologies: body.technologies || [],
            githubUrl: body.githubUrl || "",
            demoUrl: body.demoUrl || "",
            category: body.category || "",
            featured: body.featured || false,
            status: body.status || "completed",
            startDate: body.startDate || null,
            endDate: body.endDate || null,
            order: body.order || 0,
            published: body.published !== undefined ? body.published : true,
            updatedAt: serverTimestamp(),
        };

        await updateDoc(docRef, updateData);

        // Fetch updated document
        const updatedDoc = await getDoc(docRef);
        const updatedData = updatedDoc.data();
        const updatedProject: Project = {
            id: updatedDoc.id,
            ...updatedData,
            createdAt: updatedData?.createdAt?.toDate() || new Date(),
            updatedAt: updatedData?.updatedAt?.toDate() || new Date(),
        } as Project;

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error updating project:", error);
        return NextResponse.json(
            { success: false, error: "Failed to update project" },
            { status: 500 }
        );
    }
}

// DELETE /api/admin/projects/[id] - Delete project
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const docRef = doc(db, "projects", id);
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        await deleteDoc(docRef);

        return NextResponse.json({
            success: true,
            message: "Project deleted successfully",
        });
    } catch (error) {
        console.error("Error deleting project:", error);
        return NextResponse.json(
            { success: false, error: "Failed to delete project" },
            { status: 500 }
        );
    }
}