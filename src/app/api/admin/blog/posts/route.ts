import { NextRequest, NextResponse } from 'next/server'
import { getBlogPosts } from '@/lib/dataService'

export async function GET() {
    try {
        const posts = await getBlogPosts(false) // 管理画面では未公開も含める
        return NextResponse.json({ posts })
    } catch (error) {
        console.error('Blog posts fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch blog posts' },
            { status: 500 }
        )
    }
}

export async function POST(request: NextRequest) {
    try {
        const postData = await request.json()
        const { addBlogPost } = await import('@/lib/dataService')
        const postId = await addBlogPost(postData)
        return NextResponse.json({ id: postId, success: true })
    } catch (error) {
        console.error('Blog post creation error:', error)
        return NextResponse.json(
            { error: 'Failed to create blog post' },
            { status: 500 }
        )
    }
}