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

    return envVars;
};