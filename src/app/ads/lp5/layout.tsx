import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - オーガニック野菜宅配 | 初回60%OFF',
    description: '農家直送の新鮮野菜を毎週お届け。初回限定60%OFF、送料無料、いつでも解約OK。',
    openGraph: {
        title: '特別オファー - オーガニック野菜宅配',
        description: '農家直送の新鮮野菜を毎週お届け',
        type: 'website',
    },
};

export default function LP5Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp5" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
