import { NextRequest, NextResponse } from 'next/server'
import { getAdminBucket } from '@/lib/firebaseAdmin'

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

        // File → Buffer に変換
        const arrayBuffer = await file.arrayBuffer()
        const buffer = Buffer.from(arrayBuffer)

        // Firebase Admin SDK でアップロード
        const bucket = getAdminBucket()
        const fileRef = bucket.file(fileName)

        await fileRef.save(buffer, {
            metadata: {
                contentType: file.type,
            },
        })

        // 公開URLを取得（署名付きURLではなくFirebase Storage公開URL形式）
        await fileRef.makePublic()
        const bucketName = bucket.name
        const url = `https://storage.googleapis.com/${bucketName}/${fileName}`

        return NextResponse.json({
            success: true,
            url,
            originalName: file.name,
            size: file.size,
            type: file.type,
            message: 'ファイルが正常にアップロードされました'
        })

    } catch (error: unknown) {
        console.error('File upload error:', error)
        const message = error instanceof Error ? error.message : 'ファイルのアップロードに失敗しました'
        return NextResponse.json(
            {
                success: false,
                error: message
            },
            { status: 500 }
        )
    }
}
