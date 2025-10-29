import { NextResponse } from 'next/server'

// 仮のカテゴリデータ
const categories = [
    'Technology',
    'Web Development',
    'React',
    'Next.js',
    'TypeScript',
    'Design',
    'Tutorial'
]

export async function GET() {
    try {
        return NextResponse.json({ categories })
    } catch (error) {
        console.error('Categories fetch error:', error)
        return NextResponse.json(
            { error: 'Failed to fetch categories' },
            { status: 500 }
        )
    }
}