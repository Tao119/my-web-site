import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// 許可される画像形式
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
];

// 最大ファイルサイズ (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024;

// アップロードディレクトリのベースパス
const UPLOAD_BASE_DIR = path.join(process.cwd(), 'public', 'uploads');

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File;
        const folder = formData.get('folder') as string || 'images';

        if (!file) {
            return NextResponse.json(
                { error: 'ファイルが選択されていません' },
                { status: 400 }
            );
        }

        // ファイルタイプの検証
        if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
            return NextResponse.json(
                { error: `サポートされていないファイル形式です。${ALLOWED_IMAGE_TYPES.join(', ')} のみ対応しています。` },
                { status: 400 }
            );
        }

        // ファイルサイズの検証
        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json(
                { error: 'ファイルサイズが大きすぎます。最大5MBまでです。' },
                { status: 400 }
            );
        }

        // ファイル名を生成（重複を避けるためUUIDを使用）
        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        // アップロードディレクトリを作成
        const uploadDir = path.join(UPLOAD_BASE_DIR, folder);
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // ファイルパス
        const filePath = path.join(uploadDir, fileName);
        const publicPath = `/uploads/${folder}/${fileName}`;

        // ファイルを保存
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        await writeFile(filePath, buffer);

        // レスポンス
        return NextResponse.json({
            success: true,
            data: {
                url: publicPath,
                path: `uploads/${folder}/${fileName}`,
                name: fileName,
                size: file.size,
                type: file.type
            }
        });

    } catch (error) {
        console.error('画像アップロードエラー:', error);
        return NextResponse.json(
            { error: 'アップロードに失敗しました' },
            { status: 500 }
        );
    }
}

// 画像削除用のDELETEエンドポイント
export async function DELETE(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const imagePath = searchParams.get('path');

        if (!imagePath) {
            return NextResponse.json(
                { error: '削除するファイルパスが指定されていません' },
                { status: 400 }
            );
        }

        const fullPath = path.join(process.cwd(), 'public', imagePath);

        if (existsSync(fullPath)) {
            const fs = await import('fs/promises');
            await fs.unlink(fullPath);

            return NextResponse.json({
                success: true,
                message: 'ファイルが削除されました'
            });
        } else {
            return NextResponse.json(
                { error: 'ファイルが見つかりません' },
                { status: 404 }
            );
        }

    } catch (error) {
        console.error('画像削除エラー:', error);
        return NextResponse.json(
            { error: '削除に失敗しました' },
            { status: 500 }
        );
    }
}