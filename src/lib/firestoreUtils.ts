// Firestore接続とデータ操作のユーティリティ関数
import { getFirestoreInstance, checkFirestoreConnection } from './firebase'
import {
    collection,
    doc,
    getDocs,
    getDoc,
    setDoc,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    limit,
    DocumentData,
    QueryConstraint
} from 'firebase/firestore'

// Firestoreの接続状態を確認し、必要に応じて再接続を試行
export const ensureFirestoreConnection = async (retries = 3): Promise<boolean> => {
    for (let i = 0; i < retries; i++) {
        const isConnected = await checkFirestoreConnection()
        if (isConnected) {
            return true
        }
        // ログ出力を無効化
        // 短い遅延後に再試行
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)))
    }
    // エラーログを無効化
    return false
}

// 安全なドキュメント取得
export const safeGetDoc = async (collectionName: string, docId: string): Promise<DocumentData | null> => {
    try {
        const isConnected = await ensureFirestoreConnection()
        if (!isConnected) {
            throw new Error('Firestore connection failed')
        }

        const db = getFirestoreInstance()
        const docRef = doc(db, collectionName, docId)
        const docSnap = await getDoc(docRef)

        return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
    } catch (error) {
        // エラーログを無効化
        throw error
    }
}

// 安全なコレクション取得
export const safeGetCollection = async (
    collectionName: string,
    constraints: QueryConstraint[] = []
): Promise<DocumentData[]> => {
    try {
        const isConnected = await ensureFirestoreConnection()
        if (!isConnected) {
            throw new Error('Firestore connection failed')
        }

        const db = getFirestoreInstance()
        const collectionRef = collection(db, collectionName)
        const q = constraints.length > 0 ? query(collectionRef, ...constraints) : collectionRef
        const querySnapshot = await getDocs(q)

        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }))
    } catch (error) {
        // エラーログを無効化
        throw error
    }
}

// 安全なドキュメント作成/更新
export const safeSetDoc = async (
    collectionName: string,
    docId: string,
    data: DocumentData
): Promise<void> => {
    try {
        const isConnected = await ensureFirestoreConnection()
        if (!isConnected) {
            throw new Error('Firestore connection failed')
        }

        const db = getFirestoreInstance()
        const docRef = doc(db, collectionName, docId)
        await setDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        })
        // ログ出力を無効化
    } catch (error) {
        // エラーログを無効化
        throw error
    }
}

// 安全なドキュメント更新
export const safeUpdateDoc = async (
    collectionName: string,
    docId: string,
    data: Partial<DocumentData>
): Promise<void> => {
    try {
        const isConnected = await ensureFirestoreConnection()
        if (!isConnected) {
            throw new Error('Firestore connection failed')
        }

        const db = getFirestoreInstance()
        const docRef = doc(db, collectionName, docId)
        await updateDoc(docRef, {
            ...data,
            updatedAt: new Date().toISOString()
        })
        // ログ出力を無効化
    } catch (error) {
        // エラーログを無効化
        throw error
    }
}

// 安全なドキュメント削除
export const safeDeleteDoc = async (collectionName: string, docId: string): Promise<void> => {
    try {
        const isConnected = await ensureFirestoreConnection()
        if (!isConnected) {
            throw new Error('Firestore connection failed')
        }

        const db = getFirestoreInstance()
        const docRef = doc(db, collectionName, docId)
        await deleteDoc(docRef)
        // ログ出力を無効化
    } catch (error) {
        // エラーログを無効化
        throw error
    }
}

// バッチ操作のユーティリティ
export const safeBatchOperation = async (operations: (() => Promise<void>)[]): Promise<void> => {
    try {
        const isConnected = await ensureFirestoreConnection()
        if (!isConnected) {
            throw new Error('Firestore connection failed')
        }

        // 順次実行（並列実行だとFirestoreの制限に引っかかる可能性がある）
        for (const operation of operations) {
            await operation()
        }
        // ログ出力を無効化
    } catch (error) {
        // エラーログを無効化
        throw error
    }
}

// Firestore接続状態の監視
export const monitorFirestoreConnection = (
    onConnectionChange: (isConnected: boolean) => void,
    intervalMs: number = 30000 // 30秒間隔
) => {
    let isMonitoring = true

    const checkConnection = async () => {
        if (!isMonitoring) return

        try {
            const isConnected = await checkFirestoreConnection()
            onConnectionChange(isConnected)
        } catch (error) {
            // ログ出力を無効化
            onConnectionChange(false)
        }

        // 次のチェックをスケジュール
        if (isMonitoring) {
            setTimeout(checkConnection, intervalMs)
        }
    }

    // 初回チェック
    checkConnection()

    // 監視停止関数を返す
    return () => {
        isMonitoring = false
    }
}

// データの整合性チェック
export const validateDocumentData = (data: DocumentData, requiredFields: string[]): boolean => {
    for (const field of requiredFields) {
        if (!(field in data) || data[field] === null || data[field] === undefined) {
            // ログ出力を無効化
            return false
        }
    }
    return true
}

// Firestore エラーの分類
export const categorizeFirestoreError = (error: any): 'network' | 'permission' | 'not-found' | 'quota' | 'unknown' => {
    if (!error?.code) return 'unknown'

    switch (error.code) {
        case 'unavailable':
        case 'deadline-exceeded':
        case 'cancelled':
            return 'network'
        case 'permission-denied':
        case 'unauthenticated':
            return 'permission'
        case 'not-found':
            return 'not-found'
        case 'resource-exhausted':
            return 'quota'
        default:
            return 'unknown'
    }
}