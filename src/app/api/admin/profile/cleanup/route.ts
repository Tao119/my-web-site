import { NextResponse } from 'next/server'
import { getFirestoreInstance } from '@/lib/firebase'

export async function POST() {
    try {
        const db = getFirestoreInstance()
        const { doc, getDoc, setDoc } = await import('firebase/firestore')

        // 現在のデータを取得
        const docRef = doc(db, 'profile', 'main')
        const docSnap = await getDoc(docRef)

        if (docSnap.exists()) {
            const data = docSnap.data()

            // データ構造を正規化
            const socialLinks = data.socialLinks || data.profile?.socialLinks || {};

            // 不要なプロパティを削除
            const cleanSocialLinks: any = {};
            if (socialLinks.github) cleanSocialLinks.github = socialLinks.github;
            if (socialLinks.linkedin) cleanSocialLinks.linkedin = socialLinks.linkedin;
            if (socialLinks.facebook) cleanSocialLinks.facebook = socialLinks.facebook;
            if (socialLinks.x) cleanSocialLinks.x = socialLinks.x;
            if (socialLinks.instagram) cleanSocialLinks.instagram = socialLinks.instagram;

            const cleanData = {
                name: data.name || data.profile?.name || '',
                nameEn: data.nameEn || data.profile?.nameEn || '',
                title: data.title || data.profile?.title || '',
                bio: data.bio || data.profile?.bio || '',
                email: data.email || data.profile?.email || '',
                location: data.location || data.profile?.location || '',
                avatar: data.avatar || data.profile?.avatar || '',
                socialLinks: cleanSocialLinks,
                experience: data.experience || data.profile?.experience || [],
                education: data.education || data.profile?.education || [],
                updatedAt: new Date().toISOString()
            }

            // クリーンなデータで上書き
            await setDoc(docRef, cleanData)

            return NextResponse.json({
                success: true,
                message: 'Profile data cleaned up successfully',
                data: cleanData
            })
        } else {
            return NextResponse.json({
                success: false,
                message: 'Profile document not found'
            }, { status: 404 })
        }
    } catch (error: any) {
        console.error('Profile cleanup error:', error)
        return NextResponse.json({
            success: false,
            error: error.message
        }, { status: 500 })
    }
}