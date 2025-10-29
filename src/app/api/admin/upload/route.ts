import { NextRequest, NextResponse } from 'next/server'
import { uploadImage } from '@/lib/storageUtils'

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

        // Firebase Storageにアップロード
        const url = await uploadImage(file, type as any)

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