import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - フィットネスアプリ | 初回30日無料',
    description: 'プロトレーナー監修のワークアウト動画見放題。初回30日無料、いつでも解約OK。',
    openGraph: {
        title: '特別オファー - フィットネスアプリ',
        description: 'プロトレーナー監修のワークアウト動画見放題',
        type: 'website',
    },
};

export default function LP3Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp3" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
