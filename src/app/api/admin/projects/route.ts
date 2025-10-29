import { NextRequest, NextResponse } from 'next/server'
import { getProjects, addProject } from '@/lib/dataService'

export async function GET() {
    try {
        const projects = await getProjects(false) // 管理画面では全プロジェクトを取得
        return NextResponse.json({ projects })
    } catch (error) {
        console.error('Projects fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const projectData = await request.json()
        const projectId = await addProject(projectData)
        return NextResponse.json({ id: projectId, success: true })
    } catch (error) {
        console.error('Project creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create project' },
            { status: 500 }
        )
    }
}