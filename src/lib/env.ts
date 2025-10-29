// 環境変数の管理と検証（サイレント版）
export const getFirebaseEnvVars = () => {
    // ブラウザ環境でのみ実行
    if (typeof window === 'undefined') {
        return {
            apiKey: '',
            authDomain: '',
            projectId: '',
            storageBucket: '',
            messagingSenderId: '',
            appId: '',
        };
    }

    const envVars = {
        apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
        authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
        projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
        messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGE_SENDER_ID || '',
        appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
    };

    // ログ出力を無効化
    return envVars;
};

export const validateFirebaseEnvVars = () => {
    const envVars = getFirebaseEnvVars();
    const missing = Object.entries(envVars)
        .filter(([_, value]) => !value)
        .map(([key, _]) => key);

    // ログ出力を無効化
    return missing.length === 0;
};

// 開発環境用のフォールバック設定（サイレント版）
export const getFirebaseConfigWithFallback = () => {
    const envVars = getFirebaseEnvVars();

    // 環境変数が設定されていない場合のフォールバック（ログ出力なし）
    if (!envVars.apiKey && process.env.NODE_ENV === 'development') {
        return {
            apiKey: 'AIzaSyDTkHdFqtY3CDygr6A7KmuNZ0uVMK9cr2U',
            authDomain: 'ito-game.firebaseapp.com',
            projectId: 'ito-game',
            storageBucket: 'ito-game.appspot.com',
            messagingSenderId: '771842800297',
            appId: '1:771842800297:web:4b9b032ce5a2a10c9e87b8',
        };
    }

    return envVars;
};