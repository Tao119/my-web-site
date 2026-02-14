import { NextResponse } from 'next/server'
import { getSkills } from '@/lib/dataService'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const skills = await getSkills()
        return NextResponse.json({ skills })
    } catch (error) {
        console.error('Portfolio skills fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch skills' },
            { status: 500 }
        )
    }
}
