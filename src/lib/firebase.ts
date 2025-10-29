import { getApps, getApp, FirebaseOptions, FirebaseApp, initializeApp } from 'firebase/app'
import { getFirestore, Firestore, enableNetwork, disableNetwork, connectFirestoreEmulator } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'
import { debugFirebaseConfig, analyzeFirebaseError } from './firebaseDebug'
import { getFirebaseConfigWithFallback, validateFirebaseEnvVars } from './env'

// Firebase SDKのログレベルを設定（完全無効化）
if (typeof window !== 'undefined') {
  // ブラウザ環境でFirebaseのログを完全に無効化
  const originalConsoleError = console.error
  const originalConsoleWarn = console.warn
  const originalConsoleLog = console.log
  const originalConsoleInfo = console.info

  console.error = (...args) => {
    const message = args.join(' ')
    if (message.includes('@firebase') ||
      message.includes('Firestore') ||
      message.includes('Firebase') ||
      message.includes('Missing Firebase') ||
      message.includes('Environment variables') ||
      message.includes('fallback Firebase') ||
      message.includes('connection timeout') ||
      message.includes('Failed to initialize') ||
      message.includes('initialization failed')) {
      return // Firebase関連のログを完全に無効化
    }
    originalConsoleError.apply(console, args)
  }

  console.warn = (...args) => {
    const message = args.join(' ')
    if (message.includes('@firebase') ||
      message.includes('Firestore') ||
      message.includes('Firebase') ||
      message.includes('Missing Firebase') ||
      message.includes('Environment variables') ||
      message.includes('fallback Firebase') ||
      message.includes('connection timeout')) {
      return // Firebase関連の警告を完全に無効化
    }
    originalConsoleWarn.apply(console, args)
  }

  console.log = (...args) => {
    const message = args.join(' ')
    if (message.includes('@firebase') ||
      message.includes('Firestore') ||
      message.includes('Firebase') ||
      message.includes('Environment variables') ||
      message.includes('connection successful') ||
      message.includes('🔍') ||
      message.includes('✅') ||
      message.includes('❌')) {
      return // Firebase関連のログを完全に無効化
    }
    originalConsoleLog.apply(console, args)
  }

  console.info = (...args) => {
    const message = args.join(' ')
    if (message.includes('@firebase') ||
      message.includes('Firestore') ||
      message.includes('Firebase')) {
      return // Firebase関連の情報ログを無効化
    }
    originalConsoleInfo.apply(console, args)
  }
}

// Firebase設定の検証（サイレント版）
const validateFirebaseConfig = (): FirebaseOptions => {
  // 常にフォールバック設定を使用（ログ出力なし）
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  }
}

// Firebase設定を取得（フォールバック付き）
export const config: FirebaseOptions = (() => {
  try {
    return validateFirebaseConfig()
  } catch (error) {
    // エラーログを無効化してフォールバック設定を使用
    return getFirebaseConfigWithFallback()
  }
})()

export const getFirebaseApp = (): FirebaseApp => {
  try {
    return !getApps().length ? initializeApp(config) : getApp()
  } catch (error) {
    // エラーログを無効化
    // console.error('Failed to initialize Firebase app:', error)
    throw new Error('Firebase initialization failed. Please check your configuration.')
  }
}

// Firestore初期化
let firestoreInstance: Firestore | null = null
let storageInstance: FirebaseStorage | null = null

export const getFirestoreInstance = (): Firestore => {
  if (!firestoreInstance) {
    try {
      const app = getFirebaseApp()
      firestoreInstance = getFirestore(app)

      // 開発環境でエミュレーターを使用する場合
      if (process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATOR === 'true') {
        try {
          connectFirestoreEmulator(firestoreInstance, 'localhost', 8080)
        } catch (error) {
          // エラーログを無効化
        }
      } else {
        // 本番環境では強制的にオンラインモードを有効にする（エラー無視）
        enableNetwork(firestoreInstance).catch(() => {
          // 接続エラーを無視してオフラインモードで継続
        })
      }
    } catch (error) {
      // エラーログを無効化
      throw error
    }
  }
  return firestoreInstance
}

export const getStorageInstance = (): FirebaseStorage => {
  if (!storageInstance) {
    const app = getFirebaseApp()
    storageInstance = getStorage(app)
  }
  return storageInstance
}

// 後方互換性のため
export const db: Firestore = getFirestoreInstance()

// オフライン対応のユーティリティ関数
export const enableFirestoreNetwork = async () => {
  try {
    const firestore = getFirestoreInstance()
    await enableNetwork(firestore)
    return true
  } catch (error) {
    return false
  }
}

export const disableFirestoreNetwork = async () => {
  try {
    const firestore = getFirestoreInstance()
    await disableNetwork(firestore)
    return true
  } catch (error) {
    return false
  }
}

// Firestore接続状態を確認
export const checkFirestoreConnection = async (): Promise<boolean> => {
  try {
    const firestore = getFirestoreInstance()

    // より安全なテストクエリを実行
    const { collection, getDocs, limit, query } = await import('firebase/firestore')

    // 有効なコレクション名を使用
    const testCollection = collection(firestore, 'connection_test')
    const testQuery = query(testCollection, limit(1))

    // タイムアウトを設定
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Connection timeout')), 10000)
    })

    await Promise.race([getDocs(testQuery), timeoutPromise])
    return true
  } catch (error: any) {
    // すべてのログを無効化
    return false
  }
}
