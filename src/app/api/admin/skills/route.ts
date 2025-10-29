import { NextRequest, NextResponse } from 'next/server'
import { getSkills, updateSkills, addSkill } from '@/lib/dataService'

export async function GET() {
    try {
        const skills = await getSkills()
        return NextResponse.json({ skills })
    } catch (error) {
        console.error('Skills fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const skillData = await request.json()
        const skillId = await addSkill(skillData)
        return NextResponse.json({ id: skillId, success: true })
    } catch (error) {
        console.error('Skill creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create skill' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const { skills } = await request.json()
        await updateSkills(skills)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Skills update error:', error)
        return NextResponse.json(
            { error: 'Failed to update skills' },
            { status: 500 }
        )
    }
}