import { NextRequest, NextResponse } from "next/server";
import { getProject, updateProject, deleteProject } from "@/lib/dataService";

// GET /api/admin/projects/[id] - Get single project
export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const project = await getProject(id);

        if (!project) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            project,
        });
    } catch (error) {
        console.error("Error fetching project:", error);
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

        // Check if project exists
        const existing = await getProject(id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        const updateData = {
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
        };

        await updateProject(id, updateData);

        // Fetch updated document
        const updatedProject = await getProject(id);

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

// PATCH /api/admin/projects/[id] - Partial update (e.g., order, featured, published)
export async function PATCH(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const { id } = params;
        const body = await request.json();

        const existing = await getProject(id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        await updateProject(id, body);

        const updatedProject = await getProject(id);

        return NextResponse.json({
            success: true,
            message: "Project updated successfully",
            project: updatedProject,
        });
    } catch (error) {
        console.error("Error patching project:", error);
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

        // Check if project exists
        const existing = await getProject(id);
        if (!existing) {
            return NextResponse.json(
                { success: false, error: "Project not found" },
                { status: 404 }
            );
        }

        await deleteProject(id);

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
