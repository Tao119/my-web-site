import { NextRequest, NextResponse } from 'next/server'
import { getProfile, updateProfile } from '@/lib/dataService'

export async function GET() {
    try {
        const profile = await getProfile()
        return NextResponse.json(profile)
    } catch (error) {
        console.error('Profile fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch profile' },
            { status: 500 }
        )
    }
}

export async function PUT(request: NextRequest) {
    try {
        const profileData = await request.json()
        await updateProfile(profileData)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Profile update error:', error)
        return NextResponse.json(
            { error: 'Failed to update profile' },
            { status: 500 }
        )
    }
}