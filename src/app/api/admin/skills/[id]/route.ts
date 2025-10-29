import { NextRequest, NextResponse } from 'next/server'
import { deleteSkill, updateSkill } from '@/lib/dataService'

export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const skillData = await request.json()
        await updateSkill(params.id, skillData)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Skill update error:', error)
        return NextResponse.json(
            { error: 'Failed to update skill' },
            { status: 500 }
        )
    }
}

export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        await deleteSkill(params.id)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Skill deletion error:', error)
        return NextResponse.json(
            { error: 'Failed to delete skill' },
            { status: 500 }
        )
    }
}