import { getStorageInstance } from './firebase'
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'

// 画像ファイルの種類を定義
export type ImageType = 'profile' | 'project' | 'blog' | 'thumbnail'

// 許可される画像形式
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

// ファイル名を生成（重複を避けるためタイムスタンプを使用）
const generateFileName = (originalName: string, type: ImageType): string => {
    const timestamp = Date.now()
    const randomId = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()?.toLowerCase() || 'jpg'
    return `${type}/${timestamp}_${randomId}.${extension}`
}

// ファイルバリデーション
const validateFile = (file: File): void => {
    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
        throw new Error(`許可されていないファイル形式です。対応形式: ${ALLOWED_IMAGE_TYPES.join(', ')}`)
    }

    if (file.size > MAX_FILE_SIZE) {
        throw new Error(`ファイルサイズが大きすぎます。最大サイズ: ${MAX_FILE_SIZE / 1024 / 1024}MB`)
    }
}

// 画像をFirebase Storageにアップロード
export const uploadImage = async (
    file: File,
    type: ImageType,
    onProgress?: (progress: number) => void
): Promise<string> => {
    try {
        // ファイルバリデーション
        validateFile(file)

        const storage = getStorageInstance()
        const fileName = generateFileName(file.name, type)
        const storageRef = ref(storage, fileName)

        console.log(`Uploading image to: ${fileName}`)

        // プログレス付きアップロード
        const { uploadBytesResumable } = await import('firebase/storage')
        const uploadTask = uploadBytesResumable(storageRef, file)

        return new Promise((resolve, reject) => {
            uploadTask.on('state_changed',
                (snapshot) => {
                    // プログレス更新
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                    if (onProgress) {
                        onProgress(progress)
                    }
                },
                (error) => {
                    console.error('Upload failed:', error)
                    reject(new Error(`画像のアップロードに失敗しました: ${error.message}`))
                },
                async () => {
                    // アップロード完了
                    try {
                        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref)
                        console.log(`Image uploaded successfully: ${downloadURL}`)
                        resolve(downloadURL)
                    } catch (error: any) {
                        reject(new Error(`ダウンロードURLの取得に失敗しました: ${error.message}`))
                    }
                }
            )
        })

    } catch (error: any) {
        console.error('Image upload failed:', error)
        throw new Error(`画像のアップロードに失敗しました: ${error.message}`)
    }
}

// 複数画像のアップロード
export const uploadMultipleImages = async (
    files: File[],
    type: ImageType,
    onProgress?: (progress: number) => void
): Promise<string[]> => {
    const uploadPromises = files.map(async (file, index) => {
        const url = await uploadImage(file, type, (fileProgress) => {
            if (onProgress) {
                const totalProgress = ((index + fileProgress / 100) / files.length) * 100
                onProgress(totalProgress)
            }
        })
        return url
    })

    return Promise.all(uploadPromises)
}

// 画像を削除（URLから）
export const deleteImageByUrl = async (imageUrl: string): Promise<void> => {
    try {
        if (!imageUrl || !imageUrl.includes('firebase')) {
            console.warn('Invalid Firebase Storage URL:', imageUrl)
            return
        }

        const storage = getStorageInstance()

        // URLからパスを抽出
        const url = new URL(imageUrl)
        const pathMatch = url.pathname.match(/\/o\/(.+)\?/)
        if (!pathMatch) {
            throw new Error('Invalid Firebase Storage URL format')
        }

        const filePath = decodeURIComponent(pathMatch[1])
        const fileRef = ref(storage, filePath)

        await deleteObject(fileRef)
        console.log(`Image deleted successfully: ${filePath}`)

    } catch (error: any) {
        console.error('Image deletion failed:', error)
        // 削除エラーは致命的ではないので、ログのみ出力
    }
}

// 画像URLがFirebase Storageのものかチェック
export const isFirebaseStorageUrl = (url: string): boolean => {
    return url.includes('firebasestorage.googleapis.com') || url.includes('firebase')
}

// 画像のリサイズ（クライアントサイド）
export const resizeImage = (
    file: File,
    maxWidth: number = 1920,
    maxHeight: number = 1080,
    quality: number = 0.8
): Promise<File> => {
    return new Promise((resolve, reject) => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        const img = new Image()

        img.onload = () => {
            // アスペクト比を保持してリサイズ
            let { width, height } = img

            if (width > maxWidth) {
                height = (height * maxWidth) / width
                width = maxWidth
            }

            if (height > maxHeight) {
                width = (width * maxHeight) / height
                height = maxHeight
            }

            canvas.width = width
            canvas.height = height

            // 画像を描画
            ctx?.drawImage(img, 0, 0, width, height)

            // Blobに変換
            canvas.toBlob(
                (blob) => {
                    if (blob) {
                        const resizedFile = new File([blob], file.name, {
                            type: file.type,
                            lastModified: Date.now()
                        })
                        resolve(resizedFile)
                    } else {
                        reject(new Error('Failed to resize image'))
                    }
                },
                file.type,
                quality
            )
        }

        img.onerror = () => reject(new Error('Failed to load image'))
        img.src = URL.createObjectURL(file)
    })
}