// データサービス - Firestoreとモックデータのフォールバック機能
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    orderBy,
    where,
    limit
} from 'firebase/firestore'
import { getFirestoreInstance, checkFirestoreConnection as checkConnection } from './firebase'
import {
    mockProfile,
    mockSkills,
    mockProjects,
    mockBlogPosts,
    shouldUseMockData
} from './mockData'
import { Profile, Project, BlogPost, Skill } from '@/types/portfolio'
import { convertToValidUrl } from './imageUpload'

// プロフィールデータの取得
export const getProfile = async (forceRefresh = false): Promise<Profile> => {
    try {
        // Firestore接続を確認
        const isConnected = await checkConnection()
        if (!isConnected) {
            console.warn('Firestore not connected, returning empty profile')
            return createEmptyProfile()
        }

        const db = getFirestoreInstance()
        const docRef = doc(db, 'profile', 'main')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()

            // データ構造を正規化（デフォルト値は空文字や空配列）
            let profileData = {
                id: docSnap.id,
                name: data.name || data.profile?.name || '',
                nameEn: data.nameEn || data.profile?.nameEn || '',
                title: data.title || data.profile?.title || '',
                bio: data.bio || data.profile?.bio || '',
                email: data.email || data.profile?.email || '',
                location: data.location || data.profile?.location || '',
                avatar: data.avatar || data.profile?.avatar || '',
                socialLinks: data.socialLinks || data.profile?.socialLinks || {},
                experience: data.experience || data.profile?.experience || [],
                education: data.education || data.profile?.education || [],
                createdAt: data.createdAt || new Date(),
                updatedAt: data.updatedAt || new Date()
            }

            // 画像URLを適切に変換
            if (profileData.avatar && profileData.avatar.startsWith('/uploads/')) {
                try {
                    profileData.avatar = await convertToValidUrl(profileData.avatar)
                } catch (error) {
                    console.warn('Failed to convert avatar URL:', error)
                    // 変換に失敗した場合は元のURLを保持
                }
            }

            console.log('Loaded profile from Firestore:', profileData)
            return profileData as Profile
        } else {
            console.warn('Profile document not found, returning empty profile')
            return createEmptyProfile()
        }
    } catch (error: any) {
        console.error('Error fetching profile:', error)
        // エラーの場合は空のプロフィールを返す
        return createEmptyProfile()
    }
}

// 空のプロフィールを作成
const createEmptyProfile = (): Profile => ({
    id: 'empty',
    name: '',
    nameEn: '',
    title: '',
    bio: '',
    email: '',
    location: '',
    avatar: '',
    socialLinks: {},
    experience: [],
    education: [],
    createdAt: new Date(),
    updatedAt: new Date()
})

// プロフィールデータの更新
export const updateProfile = async (profileData: Partial<Profile>): Promise<void> => {
    try {
        // 接続確認
        const isConnected = await checkConnection()
        if (!isConnected) {
            console.warn('Firestore not connected, skipping profile update')
            return
        }

        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'profile', 'main')

        await setDoc(docRef, {
            ...profileData,
            updatedAt: new Date().toISOString()
        }, { merge: true })

        console.log('Profile updated successfully')
    } catch (error: any) {
        console.error('Failed to update profile:', error)

        // 権限エラーの場合は詳細情報を表示
        if (error.code === 'permission-denied') {
            console.error('Permission denied. Please check Firestore security rules.')
            console.error('Current rules should allow all reads/writes for development.')
        }

        throw error
    }
}

// スキルデータの更新
export const updateSkills = async (skills: Skill[]): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')

        // 各スキルを個別に保存
        for (const skill of skills) {
            const docRef = doc(db, 'skills', skill.id)
            await setDoc(docRef, {
                ...skill,
                updatedAt: new Date().toISOString()
            })
        }
    } catch (error) {
        console.error('Failed to update skills:', error)
        throw error
    }
}

// スキル追加
export const addSkill = async (skill: Skill): Promise<string> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')

        // スキル名からIDを生成
        const skillId = skill.id || skill.name.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20) || `skill_${Date.now()}`;

        const docRef = doc(db, 'skills', skillId)

        await setDoc(docRef, {
            ...skill,
            id: skillId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        return skillId
    } catch (error) {
        console.error('Failed to add skill:', error)
        throw error
    }
}

// 個別スキル更新
export const updateSkill = async (skillId: string, skillData: Partial<Skill>): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'skills', skillId)

        await setDoc(docRef, {
            ...skillData,
            id: skillId,
            updatedAt: new Date().toISOString()
        }, { merge: true })
    } catch (error) {
        console.error('Failed to update skill:', error)
        throw error
    }
}

// スキル削除
export const deleteSkill = async (skillId: string): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { deleteDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'skills', skillId)
        await deleteDoc(docRef)
    } catch (error) {
        console.error('Failed to delete skill:', error)
        throw error
    }
}

// スキルデータの取得
export const getSkills = async (): Promise<Skill[]> => {
    try {
        // 接続確認
        const isConnected = await checkConnection()
        if (!isConnected) {
            console.warn('Firestore not connected, returning empty skills array')
            return []
        }

        const db = getFirestoreInstance()
        const skillsRef = collection(db, 'skills')

        // まずorderフィールドでソートを試行
        let q = query(skillsRef, orderBy('order', 'asc'))
        let querySnapshot

        try {
            querySnapshot = await getDocs(q)
        } catch (error) {
            // orderフィールドが存在しない場合はlevelでソート
            console.warn('Order field not found, falling back to level sorting')
            q = query(skillsRef, orderBy('level', 'desc'))
            querySnapshot = await getDocs(q)
        }

        let skills = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Skill[]

        // orderフィールドが存在する場合はそれでソート、存在しない場合はlevelでソート
        skills.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order
            }
            // orderが設定されていない場合はlevelの降順
            return (b.level || 0) - (a.level || 0)
        })

        console.log(`Loaded ${skills.length} skills from Firestore`)
        return skills
    } catch (error: any) {
        console.error('Error fetching skills:', error)
        // エラーの場合は空配列を返す（モックデータは使わない）
        return []
    }
}

// プロジェクト追加
export const addProject = async (project: Project): Promise<string> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')

        // プロジェクト名からIDを生成
        const projectId = project.id || project.title.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20) || `project_${Date.now()}`;

        const docRef = doc(db, 'projects', projectId)

        await setDoc(docRef, {
            ...project,
            id: projectId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        return projectId
    } catch (error) {
        console.error('Failed to add project:', error)
        throw error
    }
}

// プロジェクト更新
export const updateProject = async (projectId: string, projectData: Partial<Project>): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'projects', projectId)

        await setDoc(docRef, {
            ...projectData,
            id: projectId,
            updatedAt: new Date().toISOString()
        }, { merge: true })
    } catch (error) {
        console.error('Failed to update project:', error)
        throw error
    }
}

// プロジェクト削除
export const deleteProject = async (projectId: string): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { deleteDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'projects', projectId)
        await deleteDoc(docRef)
    } catch (error) {
        console.error('Failed to delete project:', error)
        throw error
    }
}

// プロジェクトデータの取得
export const getProjects = async (featuredOnly = false): Promise<Project[]> => {
    try {
        // 接続確認
        const isConnected = await checkConnection()
        if (!isConnected) {
            console.warn('Firestore not connected, returning empty projects array')
            return []
        }

        const db = getFirestoreInstance()
        const projectsRef = collection(db, 'projects')
        let q = query(projectsRef, orderBy('createdAt', 'desc'))

        if (featuredOnly) {
            q = query(projectsRef, where('featured', '==', true), orderBy('createdAt', 'desc'))
        }

        const querySnapshot = await getDocs(q)
        let projects = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as Project[]

        // 画像URLを適切に変換
        projects = await Promise.all(projects.map(async (project) => {
            if (project.thumbnail && project.thumbnail.startsWith('/uploads/')) {
                try {
                    project.thumbnail = await convertToValidUrl(project.thumbnail)
                } catch (error) {
                    console.warn('Failed to convert project thumbnail URL:', error)
                }
            }

            if (project.images) {
                project.images = await Promise.all(project.images.map(async (imageUrl) => {
                    if (imageUrl.startsWith('/uploads/')) {
                        try {
                            return await convertToValidUrl(imageUrl)
                        } catch (error) {
                            console.warn('Failed to convert project image URL:', error)
                            return imageUrl
                        }
                    }
                    return imageUrl
                }))
            }

            return project
        }))

        console.log(`Loaded ${projects.length} projects from Firestore${featuredOnly ? ' (featured only)' : ''}`)
        return projects
    } catch (error: any) {
        console.error('Error fetching projects:', error)
        // エラーの場合は空配列を返す（モックデータは使わない）
        return []
    }
}

// 単一プロジェクトの取得
export const getProject = async (id: string): Promise<Project | null> => {
    try {
        const db = getFirestoreInstance()
        const docRef = doc(db, 'projects', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as Project
        } else {
            // モックデータから検索
            const mockProject = mockProjects.find(p => p.id === id)
            if (mockProject) {
                console.warn(`Project ${id} not found in Firestore, using mock data`)
                return mockProject
            }
            return null
        }
    } catch (error) {
        console.warn('Error fetching project data:', error)
        if (shouldUseMockData(error)) {
            console.log('Using mock project data due to connection issues')
            const mockProject = mockProjects.find(p => p.id === id)
            return mockProject || null
        }
        throw error
    }
}

// ブログ記事一覧の取得
export const getBlogPosts = async (publishedOnly = true, limitCount?: number): Promise<BlogPost[]> => {
    try {
        // 接続確認
        const isConnected = await checkConnection()
        if (!isConnected) {
            console.warn('Firestore not connected, returning empty blog posts array')
            return []
        }

        const db = getFirestoreInstance()
        const postsRef = collection(db, 'blog')
        let q = query(postsRef, orderBy('createdAt', 'desc'))

        if (publishedOnly) {
            q = query(postsRef, where('published', '==', true), orderBy('createdAt', 'desc'))
        }

        if (limitCount) {
            q = query(q, limit(limitCount))
        }

        const querySnapshot = await getDocs(q)
        const posts = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        })) as BlogPost[]

        // orderフィールド優先でクライアントサイドソート（composite index回避）
        posts.sort((a, b) => {
            if (a.order !== undefined && b.order !== undefined) {
                return a.order - b.order
            }
            if (a.order !== undefined) return -1
            if (b.order !== undefined) return 1
            const dateA = new Date(a.publishedAt || a.createdAt).getTime()
            const dateB = new Date(b.publishedAt || b.createdAt).getTime()
            return dateB - dateA
        })

        return posts
    } catch (error: any) {
        console.error('Error fetching blog posts:', error)
        // エラーの場合は空配列を返す（モックデータは使わない）
        return []
    }
}

// 単一ブログ記事の取得
export const getBlogPost = async (id: string): Promise<BlogPost | null> => {
    try {
        const db = getFirestoreInstance()
        const docRef = doc(db, 'blog', id)
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            return { id: docSnap.id, ...docSnap.data() } as BlogPost
        } else {
            // モックデータから検索
            const mockPost = mockBlogPosts.find(p => p.id === id || p.slug === id)
            if (mockPost) {
                console.warn(`Blog post ${id} not found in Firestore, using mock data`)
                return mockPost
            }
            return null
        }
    } catch (error) {
        console.warn('Error fetching blog post data:', error)
        if (shouldUseMockData(error)) {
            console.log('Using mock blog post data due to connection issues')
            const mockPost = mockBlogPosts.find(p => p.id === id || p.slug === id)
            return mockPost || null
        }
        throw error
    }
}

// 注目記事の取得
export const getFeaturedBlogPosts = async (limitCount = 3): Promise<BlogPost[]> => {
    try {
        const db = getFirestoreInstance()
        const postsRef = collection(db, 'blog')
        const q = query(
            postsRef,
            where('published', '==', true),
            where('featured', '==', true),
            orderBy('createdAt', 'desc'),
            limit(limitCount)
        )

        const querySnapshot = await getDocs(q)

        if (!querySnapshot.empty) {
            return querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            })) as BlogPost[]
        } else {
            console.warn('No featured blog posts found, using mock data')
            return mockBlogPosts
                .filter(p => p.published && p.featured)
                .slice(0, limitCount)
        }
    } catch (error) {
        console.warn('Error fetching featured blog posts data:', error)
        if (shouldUseMockData(error)) {
            console.log('Using mock featured blog posts data due to connection issues')
            return mockBlogPosts
                .filter(p => p.published && p.featured)
                .slice(0, limitCount)
        }
        throw error
    }
}

// ブログ投稿追加
export const addBlogPost = async (post: BlogPost): Promise<string> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')

        // ブログタイトルからIDを生成
        const postId = post.id || post.title.toLowerCase()
            .replace(/[^a-z0-9]/g, '')
            .substring(0, 20) || `post_${Date.now()}`;

        const docRef = doc(db, 'blog', postId)

        await setDoc(docRef, {
            ...post,
            id: postId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        })

        return postId
    } catch (error) {
        console.error('Failed to add blog post:', error)
        throw error
    }
}

// ブログ投稿更新
export const updateBlogPost = async (postId: string, postData: Partial<BlogPost>): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { setDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'blog', postId)

        await setDoc(docRef, {
            ...postData,
            id: postId,
            updatedAt: new Date().toISOString()
        }, { merge: true })
    } catch (error) {
        console.error('Failed to update blog post:', error)
        throw error
    }
}

// ブログ投稿削除
export const deleteBlogPost = async (postId: string): Promise<void> => {
    try {
        const db = getFirestoreInstance()
        const { deleteDoc } = await import('firebase/firestore')
        const docRef = doc(db, 'blog', postId)
        await deleteDoc(docRef)
    } catch (error) {
        console.error('Failed to delete blog post:', error)
        throw error
    }
}

// 接続状態の確認
export const checkFirestoreConnection = async (): Promise<boolean> => {
    try {
        // 軽量なクエリで接続確認
        const db = getFirestoreInstance()
        const testRef = collection(db, 'connection-test')
        const q = query(testRef, limit(1))
        await getDocs(q)
        return true
    } catch (error) {
        console.warn('Firestore connection check failed:', error)
        return false
    }
}

// オフライン状態の監視
export const monitorOnlineStatus = (callback: (isOnline: boolean) => void) => {
    if (typeof window === 'undefined') return

    const handleOnline = () => callback(true)
    const handleOffline = () => callback(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 初期状態を通知
    callback(navigator.onLine)

    // クリーンアップ関数を返す
    return () => {
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
    }
}