"use client";

interface AuthGuardProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
    children,
    fallback = <div className="c-auth-guard__loading">認証確認中...</div>
}) => {
    // 認証機能を一旦省いて、直接子コンポーネントを表示
    return <>{children}</>;
};