import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - 趣味スターターキット | 初回60%OFF',
    description: '水彩画・書道・陶芸など、新しい趣味を始めるための完全セット。初回限定60%OFF、送料無料。',
    openGraph: {
        title: '特別オファー - 趣味スターターキット',
        description: '新しい趣味を始めるための完全セット',
        type: 'website',
    },
};

export default function LP10Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp10" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
