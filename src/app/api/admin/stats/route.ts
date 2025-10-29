import { NextResponse } from 'next/server'
import { getBlogPosts, getProjects, getSkills } from '@/lib/dataService'

export async function GET() {
    try {
        const [blogPosts, projects, skills] = await Promise.all([
            getBlogPosts(false), // 全ての投稿
            getProjects(false),  // 全てのプロジェクト
            getSkills()
        ])

        const publishedPosts = blogPosts.filter(post => post.published)
        const featuredProjects = projects.filter(project => project.featured)

        const stats = {
            totalBlogPosts: blogPosts.length,
            publishedBlogPosts: publishedPosts.length,
            draftBlogPosts: blogPosts.length - publishedPosts.length,
            totalProjects: projects.length,
            featuredProjects: featuredProjects.length,
            totalSkills: skills.length,
            recentPosts: blogPosts.slice(0, 5),
            recentProjects: projects.slice(0, 5)
        }

        return NextResponse.json(stats)
    } catch (error) {
        console.error('Stats fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch stats' },
            { status: 500 }
        )
    }
}