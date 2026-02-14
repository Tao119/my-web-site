import { NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/dataService'

export const dynamic = 'force-dynamic'

export async function GET() {
    try {
        const allPosts = await getBlogPosts(false)
        const posts = allPosts.filter(p => p.published !== false)
        return NextResponse.json({ posts })
    } catch (error) {
        console.error('Portfolio blog fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
        )
    }
}
