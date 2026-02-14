import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getStorage } from 'firebase-admin/storage'

let adminApp: App | null = null

function getAdminApp(): App {
    if (adminApp) return adminApp

    const existingApps = getApps()
    if (existingApps.length > 0) {
        adminApp = existingApps[0]
        return adminApp
    }

    const serviceAccountKey = process.env.FIREBASE_SERVICE_ACCOUNT_KEY
    if (!serviceAccountKey) {
        throw new Error('FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set')
    }

    try {
        const serviceAccount = JSON.parse(
            Buffer.from(serviceAccountKey, 'base64').toString('utf-8')
        )

        adminApp = initializeApp({
            credential: cert(serviceAccount),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'ito-game.firebasestorage.app',
        })

        return adminApp
    } catch (error) {
        throw new Error('Failed to initialize Firebase Admin SDK. Check FIREBASE_SERVICE_ACCOUNT_KEY format.')
    }
}

export function getAdminStorage() {
    const app = getAdminApp()
    return getStorage(app)
}

export function getAdminBucket() {
    const storage = getAdminStorage()
    return storage.bucket()
}
