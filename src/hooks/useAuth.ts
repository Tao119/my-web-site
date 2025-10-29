import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface SessionInfo {
    email?: string;
    createdAt?: string;
    expiresAt?: string;
}

interface AuthState {
    isAuthenticated: boolean;
    isLoading: boolean;
    session?: SessionInfo;
}

export const useAuth = () => {
    const [authState, setAuthState] = useState<AuthState>({
        isAuthenticated: false,
        isLoading: true, // 初期化時はローディング状態
    });
    const router = useRouter();

    // Alias for backward compatibility
    const user = authState.session ? {
        id: "admin",
        username: "admin",
        lastLogin: authState.session.createdAt,
    } : null;

    // 初期化時に認証状態を確認
    useEffect(() => {
        const checkAuth = () => {
            // ローカルストレージから認証状態を復元
            const savedAuth = localStorage.getItem('admin-authenticated');
            if (savedAuth === 'true') {
                setAuthState({
                    isAuthenticated: true,
                    isLoading: false,
                    session: {
                        email: 'tao.dama.art@gmail.com',
                        createdAt: new Date().toISOString(),
                        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間
                    }
                });
            } else {
                setAuthState({
                    isAuthenticated: false,
                    isLoading: false,
                });
            }
        };

        // 少し遅延を入れて初期化
        const timer = setTimeout(checkAuth, 100);
        return () => clearTimeout(timer);
    }, []);

    const login = async (password: string): Promise<{ success: boolean; error?: string }> => {
        // シンプルなパスワード確認
        if (password === 'password') {
            const session = {
                email: 'tao.dama.art@gmail.com',
                createdAt: new Date().toISOString(),
                expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24時間
            };

            // ローカルストレージに保存
            localStorage.setItem('admin-authenticated', 'true');

            setAuthState({
                isAuthenticated: true,
                isLoading: false,
                session,
            });

            return { success: true };
        } else {
            return { success: false, error: 'パスワードが正しくありません' };
        }
    };

    const logout = async () => {
        setAuthState({
            isAuthenticated: false,
            isLoading: false,
            session: undefined,
        });

        // ローカルストレージから削除
        localStorage.removeItem('admin-authenticated');

        router.push('/portfolio/admin');
    };

    const changePassword = async (currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string; message?: string }> => {
        // シンプルな実装（実際のパスワード変更はなし）
        if (currentPassword === 'password') {
            return { success: true, message: 'パスワードが変更されました（デモ用）' };
        } else {
            return { success: false, error: '現在のパスワードが正しくありません' };
        }
    };

    const getSessionTimeRemaining = () => {
        if (!authState.session?.expiresAt) return null;
        const expiresAt = new Date(authState.session.expiresAt);
        const now = new Date();
        const remaining = expiresAt.getTime() - now.getTime();
        return remaining > 0 ? remaining : 0;
    };

    const checkAuthStatus = async () => {
        // 何もしない（互換性のため）
    };

    return {
        ...authState,
        user,
        login,
        logout,
        checkAuthStatus,
        changePassword,
        getSessionTimeRemaining,
    };
};