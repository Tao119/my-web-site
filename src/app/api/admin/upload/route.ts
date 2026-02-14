import { NextRequest, NextResponse } from 'next/server'
import { getStorageInstance } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

// 許可される画像形式
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File
        const type = formData.get('type') as string || 'blog'

        if (!file) {
            return NextResponse.json(
                { error: 'ファイルが提供されていません' },
                { status: 400 }
            )
        }

        // バリデーション
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `許可されていないファイル形式です。対応形式: ${ALLOWED_IMAGE_TYPES.join(', ')}` },
                { status: 400 }
            )
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: `ファイルサイズが大きすぎます。最大サイズ: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
                { status: 400 }
            )
        }

        // ファイル名を生成
        const timestamp = Date.now()
        const randomId = Math.random().toString(36).substring(2, 15)
        const extension = file.name.split('.').pop()?.toLowerCase() || 'jpg'
        const fileName = `${type}/${timestamp}_${randomId}.${extension}`

        // File → Uint8Array に変換（サーバーサイドで動作させるため）
        const arrayBuffer = await file.arrayBuffer()
        const uint8Array = new Uint8Array(arrayBuffer)

        // uploadBytes を使用（uploadBytesResumable はブラウザXHRが必要で動作しない）
        const storage = getStorageInstance()
        const storageRef = ref(storage, fileName)
        await uploadBytes(storageRef, uint8Array, {
            contentType: file.type,
        })

        const url = await getDownloadURL(storageRef)

        return NextResponse.json({
            success: true,
            url,
            originalName: file.name,
            size: file.size,
            type: file.type,
            message: 'ファイルが正常にアップロードされました'
        })

    } catch (error: any) {
        console.error('File upload error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'ファイルのアップロードに失敗しました'
            },
            { status: 500 }
        )
    }
}
