import { NextResponse } from 'next/server'
import { getFirestoreInstance } from '@/lib/firebase'
import { mockProfile, mockSkills, mockProjects, mockBlogPosts } from '@/lib/mockData'

export async function POST() {
    try {
        const db = getFirestoreInstance()
        const { doc, setDoc, addDoc, collection } = await import('firebase/firestore')

        let results = {
            profile: false,
            skills: 0,
            projects: 0,
            blogPosts: 0
        }

        // プロフィールデータを作成
        try {
            const profileRef = doc(db, 'profile', 'main')
            await setDoc(profileRef, {
                ...mockProfile,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            results.profile = true
        } catch (error) {
            console.error('Failed to create profile:', error)
        }

        // スキルデータを作成
        try {
            const skillsRef = collection(db, 'skills')
            for (const skill of mockSkills) {
                await addDoc(skillsRef, {
                    ...skill,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                results.skills++
            }
        } catch (error) {
            console.error('Failed to create skills:', error)
        }

        // プロジェクトデータを作成
        try {
            const projectsRef = collection(db, 'projects')
            for (const project of mockProjects) {
                await addDoc(projectsRef, {
                    ...project,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                results.projects++
            }
        } catch (error) {
            console.error('Failed to create projects:', error)
        }

        // ブログ投稿データを作成
        try {
            const blogRef = collection(db, 'blog')
            for (const post of mockBlogPosts) {
                await addDoc(blogRef, {
                    ...post,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                })
                results.blogPosts++
            }
        } catch (error) {
            console.error('Failed to create blog posts:', error)
        }

        return NextResponse.json({
            success: true,
            message: 'Initial data setup completed',
            results
        })
    } catch (error: any) {
        console.error('Setup error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}