// Firebase設定の確実な読み込み
import { FirebaseOptions } from 'firebase/app';

// 環境変数を直接読み込む関数
const getEnvVar = (name: string): string => {
    if (typeof window !== 'undefined') {
        // ブラウザ環境では window オブジェクトから取得
        return (window as any).__NEXT_DATA__?.props?.pageProps?.env?.[name] ||
            process.env[name] ||
            '';
    }
    return process.env[name] || '';
};

// Firebase設定を取得
export const getFirebaseConfig = (): FirebaseOptions => {
    // 直接環境変数を読み込み
    const config = {
        apiKey: getEnvVar('NEXT_PUBLIC_FIREBASE_API_KEY'),
        authDomain: getEnvVar('NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN'),
        projectId: getEnvVar('NEXT_PUBLIC_FIREBASE_PROJECT_ID'),
        storageBucket: getEnvVar('NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET'),
        messagingSenderId: getEnvVar('NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID'),
        appId: getEnvVar('NEXT_PUBLIC_FIREBASE_APP_ID'),
    };

    // ログ出力を無効化
    // console.log('🔥 Firebase Config Loaded:', {
    //     apiKey: config.apiKey ? `${config.apiKey.substring(0, 8)}...` : 'Missing',
    //     authDomain: config.authDomain || 'Missing',
    //     projectId: config.projectId || 'Missing',
    //     storageBucket: config.storageBucket || 'Missing',
    //     messagingSenderId: config.messagingSenderId || 'Missing',
    //     appId: config.appId || 'Missing',
    // });

    return config;
};

// 設定の検証
export const validateConfig = (config: FirebaseOptions): boolean => {
    const required = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
    const missing = required.filter(key => !config[key as keyof FirebaseOptions]);

    if (missing.length > 0) {
        // ログ出力を無効化
        return false;
    }

    // ログ出力を無効化
    return true;
};