import { NextResponse } from 'next/server'
import { getFirestoreInstance } from '@/lib/firebase'

export async function GET() {
    try {
        const db = getFirestoreInstance()
        const { doc, setDoc, getDoc } = await import('firebase/firestore')

        // テスト用ドキュメントを作成
        const testDocRef = doc(db, 'test', 'connection')

        // 書き込みテスト
        await setDoc(testDocRef, {
            message: 'Firestore connection test',
            timestamp: new Date().toISOString()
        })

        // 読み込みテスト
        const docSnap = await getDoc(testDocRef)

        if (docSnap.exists()) {
            return NextResponse.json({
                success: true,
                message: 'Firestore connection and permissions working correctly',
                data: docSnap.data()
            })
        } else {
            return NextResponse.json({
                success: false,
                message: 'Document was not created or could not be read'
            })
        }
    } catch (error: any) {
        console.error('Firestore test error:', error)
        return NextResponse.json({
            success: false,
            error: error.message,
            code: error.code
        }, { status: 500 })
    }
}