import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/dataService'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const profile = await getProfile()
        return NextResponse.json(profile)
    } catch (error) {
        console.error('Portfolio profile fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}
