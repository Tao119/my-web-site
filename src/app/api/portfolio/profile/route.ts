import { NextResponse } from 'next/server'
import { getProfile } from '@/lib/dataService'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const profile = await getProfile()
        // アバターURLにhttps://がない場合は付与
        if (profile.avatar && !profile.avatar.startsWith('http') && !profile.avatar.startsWith('/')) {
            profile.avatar = `https://${profile.avatar}`
        }
        return NextResponse.json(profile)
    } catch (error) {
        console.error('Portfolio profile fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}
