import { NextResponse } from 'next/server'
import { getProjects } from '@/lib/dataService'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const allProjects = await getProjects(false)
        const projects = allProjects.filter(p => p.published !== false)
        return NextResponse.json({ projects })
    } catch (error) {
        console.error('Portfolio projects fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch projects' },
            { status: 500 }
        )
    }
}
