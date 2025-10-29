// 開発環境用のモック画像アップロード機能
import { UploadProgress, UploadResult } from './imageUpload';

// 開発環境かどうかを判定
const isDevelopment = process.env.NODE_ENV === 'development';

// モック画像URLを生成
const generateMockImageUrl = (file: File, folder: string): string => {
    const timestamp = Date.now();
    const randomId = Math.random().toString(36).substring(2, 15);
    return `https://picsum.photos/800/600?random=${timestamp}&id=${randomId}`;
};

// モックアップロード関数
export const mockUploadImage = async (
    file: File,
    folder: string = 'images',
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    // プログレスをシミュレート
    const simulateProgress = () => {
        return new Promise<void>((resolve) => {
            let progress = 0;
            const interval = setInterval(() => {
                progress += Math.random() * 30;
                if (progress >= 100) {
                    progress = 100;
                    clearInterval(interval);
                    resolve();
                }

                onProgress?.({
                    progress,
                    bytesTransferred: (file.size * progress) / 100,
                    totalBytes: file.size
                });
            }, 100);
        });
    };

    // プログレスシミュレーション実行
    await simulateProgress();

    // モック結果を返す
    return {
        url: generateMockImageUrl(file, folder),
        path: `${folder}/${file.name}`,
        name: file.name,
        size: file.size
    };
};

// 開発環境用の統合アップロード関数
export const developmentSafeUpload = async (
    file: File,
    folder: string = 'images',
    onProgress?: (progress: UploadProgress) => void,
    realUploadFunction?: (file: File, folder: string, onProgress?: (progress: UploadProgress) => void) => Promise<UploadResult>
): Promise<UploadResult> => {
    if (isDevelopment) {
        console.log('🔧 開発環境: モック画像アップロードを使用');
        return mockUploadImage(file, folder, onProgress);
    }

    if (realUploadFunction) {
        return realUploadFunction(file, folder, onProgress);
    }

    throw new Error('本番環境でのアップロード関数が指定されていません');
};

// プロフィール画像用
export const mockUploadProfileImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    return mockUploadImage(file, 'profiles', onProgress);
};

// プロジェクト画像用
export const mockUploadProjectImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    return mockUploadImage(file, 'projects', onProgress);
};

// ブログ画像用
export const mockUploadBlogImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    return mockUploadImage(file, 'blog', onProgress);
};

// 開発環境での画像削除（何もしない）
export const mockDeleteImage = async (imagePath: string): Promise<void> => {
    console.log('🔧 開発環境: 画像削除をスキップ', imagePath);
    return Promise.resolve();
};