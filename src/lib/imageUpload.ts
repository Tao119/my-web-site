// 統合画像アップロード機能（Firebase Storage + ローカルファイルシステム対応）
import { getStorageInstance } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable, UploadTaskSnapshot } from 'firebase/storage'
import { v4 as uuidv4 } from 'uuid'

// 環境判定
const isLocalEnvironment = () => {
    // 本番環境では常にFirebase Storageを使用
    if (process.env.NODE_ENV === 'production') {
        return false
    }
    // 開発環境でも明示的にローカルストレージを有効にした場合のみローカルを使用
    return process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_LOCAL_STORAGE === 'true'
}

export interface UploadProgress {
    progress: number
    bytesTransferred: number
    totalBytes: number
}

export interface UploadResult {
    url: string
    path: string
    name: string
    size: number
}

// 許可される画像形式
const ALLOWED_IMAGE_TYPES = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif'
]

// 最大ファイルサイズ (5MB)
const MAX_FILE_SIZE = 5 * 1024 * 1024

// ファイルバリデーション
export const validateImageFile = (file: File): { valid: boolean; error?: string } => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        return {
            valid: false,
            error: `サポートされていないファイル形式です。${ALLOWED_IMAGE_TYPES.join(', ')} のみ対応しています。`
        }
    }

    if (file.size > MAX_FILE_SIZE) {
        return {
            valid: false,
            error: `ファイルサイズが大きすぎます。最大5MBまでです。`
        }
    }

    return { valid: true }
}

// 画像をリサイズする関数
export const resizeImage = (file: File, maxWidth: number = 1200, maxHeight: number = 1200, quality: number = 0.8): Promise<File> => {
    return new Promise((resolve) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            // アスペクト比を保持してリサイズ
            let { width, height } = img

            if (width > height) {
                if (width > maxWidth) {
                    height = (height * maxWidth) / width
                    width = maxWidth
                }
            } else {
                if (height > maxHeight) {
                    width = (width * maxHeight) / height
                    height = maxHeight
                }
            }

            canvas.width = width
            canvas.height = height

            // 画像を描画
            ctx?.drawImage(img, 0, 0, width, height)

            // Blobに変換
            canvas.toBlob((blob) => {
                if (blob) {
                    const resizedFile = new File([blob], file.name, {
                        type: file.type,
                        lastModified: Date.now()
                    })
                    resolve(resizedFile)
                } else {
                    resolve(file) // リサイズに失敗した場合は元のファイルを返す
                }
            }, file.type, quality)
        }

        img.src = URL.createObjectURL(file)
    })
}

// ローカル環境での画像アップロード
const uploadImageLocal = async (
    file: File,
    folder: string = 'images',
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('folder', folder)

    // プログレス更新をシミュレート
    onProgress?.({
        progress: 0,
        bytesTransferred: 0,
        totalBytes: file.size
    })

    try {
        const response = await fetch('/api/upload/image', {
            method: 'POST',
            body: formData
        })

        // プログレス更新
        onProgress?.({
            progress: 50,
            bytesTransferred: file.size * 0.5,
            totalBytes: file.size
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'アップロードに失敗しました')
        }

        const result = await response.json()

        // プログレス完了
        onProgress?.({
            progress: 100,
            bytesTransferred: file.size,
            totalBytes: file.size
        })

        return result.data
    } catch (error) {
        throw new Error(`ローカルアップロードエラー: ${error}`)
    }
}

// Firebase環境での画像アップロード
const uploadImageFirebase = async (
    file: File,
    folder: string = 'images',
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    try {
        const storage = getStorageInstance()

        // ファイル名を生成（重複を避けるためUUIDを使用）
        const fileExtension = file.name.split('.').pop()
        const fileName = `${uuidv4()}.${fileExtension}`
        const filePath = `${folder}/${fileName}`

        // Storage参照を作成
        const storageRef = ref(storage, filePath)

        // アップロードタスクを作成
        const uploadTask = uploadBytesResumable(storageRef, file)

        return new Promise((resolve, reject) => {
            uploadTask.on(
                'state_changed',
                (snapshot: UploadTaskSnapshot) => {
                    // プログレス更新
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    onProgress?.({
                        progress,
                        bytesTransferred: snapshot.bytesTransferred,
                        totalBytes: snapshot.totalBytes
                    })
                },
                (error) => {
                    reject(new Error(`アップロードに失敗しました: ${error.message}`))
                },
                async () => {
                    try {
                        // アップロード完了後、ダウンロードURLを取得
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        resolve({
                            url: downloadURL,
                            path: filePath,
                            name: fileName,
                            size: file.size
                        })
                    } catch (error) {
                        reject(new Error(`ダウンロードURLの取得に失敗しました: ${error}`))
                    }
                }
            )
        })
    } catch (error) {
        throw new Error(`Firebaseアップロードエラー: ${error}`)
    }
}

// 単一画像のアップロード（環境自動判定）
export const uploadImage = async (
    file: File,
    folder: string = 'images',
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    // ファイルバリデーション
    const validation = validateImageFile(file)
    if (!validation.valid) {
        throw new Error(validation.error)
    }

    // 環境に応じてアップロード方法を選択
    if (isLocalEnvironment()) {
        return uploadImageLocal(file, folder, onProgress)
    } else {
        return uploadImageFirebase(file, folder, onProgress)
    }
}

// 複数画像の一括アップロード
export const uploadMultipleImages = async (
    files: File[],
    folder: string = 'images',
    onProgress?: (fileIndex: number, progress: UploadProgress) => void
): Promise<UploadResult[]> => {
    const results: UploadResult[] = []

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        try {
            const result = await uploadImage(file, folder, (progress) => {
                onProgress?.(i, progress)
            })
            results.push(result)
        } catch (error) {
            // エラーログを無効化
            throw error
        }
    }

    return results
}

// ローカル環境での画像削除
const deleteImageLocal = async (imagePath: string): Promise<void> => {
    try {
        const response = await fetch(`/api/upload/image?path=${encodeURIComponent(imagePath)}`, {
            method: 'DELETE'
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || '削除に失敗しました')
        }
    } catch (error) {
        throw new Error(`ローカル削除エラー: ${error}`)
    }
}

// Firebase環境での画像削除
const deleteImageFirebase = async (imagePath: string): Promise<void> => {
    try {
        const storage = getStorageInstance()
        const imageRef = ref(storage, imagePath)
        await deleteObject(imageRef)
    } catch (error) {
        throw new Error(`Firebase削除エラー: ${error}`)
    }
}

// 画像の削除（環境自動判定）
export const deleteImage = async (imagePath: string): Promise<void> => {
    if (isLocalEnvironment()) {
        return deleteImageLocal(imagePath)
    } else {
        return deleteImageFirebase(imagePath)
    }
}

// プロフィール画像専用のアップロード（リサイズ付き）
export const uploadProfileImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    // プロフィール画像は正方形にリサイズ
    const resizedFile = await resizeImage(file, 400, 400, 0.9)
    return uploadImage(resizedFile, 'profiles', onProgress)
}

// プロジェクト画像専用のアップロード
export const uploadProjectImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    // プロジェクト画像は16:9の比率でリサイズ
    const resizedFile = await resizeImage(file, 1200, 675, 0.85)
    return uploadImage(resizedFile, 'projects', onProgress)
}

// ブログ画像専用のアップロード
export const uploadBlogImage = async (
    file: File,
    onProgress?: (progress: UploadProgress) => void
): Promise<UploadResult> => {
    const resizedFile = await resizeImage(file, 1200, 800, 0.85)
    return uploadImage(resizedFile, 'blog', onProgress)
}

// 画像URLからファイルパスを抽出
export const extractPathFromUrl = (url: string): string | null => {
    try {
        const urlObj = new URL(url)
        const pathMatch = urlObj.pathname.match(/\/o\/(.+?)\?/)
        return pathMatch ? decodeURIComponent(pathMatch[1]) : null
    } catch (error) {
        // エラーログを無効化
        return null
    }
}

// Firebase Storage パスからダウンロードURLを取得
export const getDownloadUrlFromPath = async (storagePath: string): Promise<string> => {
    try {
        if (isLocalEnvironment()) {
            // ローカル環境では直接パスを返す
            return `/uploads/${storagePath}`
        }

        const storage = getStorageInstance()
        const storageRef = ref(storage, storagePath)
        return await getDownloadURL(storageRef)
    } catch (error) {
        throw new Error(`ダウンロードURLの取得に失敗しました: ${error}`)
    }
}

// 既存のFirebase Storage URLを有効なダウンロードURLに変換
export const convertToValidUrl = async (url: string): Promise<string> => {
    try {
        // 既に有効なHTTPSのURLの場合はそのまま返す
        if (url.startsWith('https://') && !url.startsWith('/uploads/')) {
            return url
        }

        // ローカルパス（/uploads/で始まる）の場合
        if (url.startsWith('/uploads/')) {
            if (isLocalEnvironment()) {
                // ローカル環境ではそのまま返す
                return url
            } else {
                // 本番環境では対応するFirebase Storage URLを取得
                // /uploads/profiles/filename.jpg -> profiles/filename.jpg
                const storagePath = url.replace('/uploads/', '')
                return await getDownloadUrlFromPath(storagePath)
            }
        }

        // Firebase Storage URLからパスを抽出
        const path = extractPathFromUrl(url)
        if (!path) {
            throw new Error('無効なFirebase Storage URLです')
        }

        // 新しいダウンロードURLを取得
        return await getDownloadUrlFromPath(path)
    } catch (error) {
        console.error('URL変換エラー:', error)
        // フォールバック: 元のURLを返す
        return url
    }
}