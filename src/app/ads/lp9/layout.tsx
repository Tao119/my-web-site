import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - ウェルネスグッズセット | 初回50%OFF',
    description: 'アロマディフューザー・マッサージローラー・アイマスクセット。初回限定50%OFF、送料無料。',
    openGraph: {
        title: '特別オファー - ウェルネスグッズセット',
        description: 'アロマディフューザー・マッサージローラー・アイマスクセット',
        type: 'website',
    },
};

export default function LP9Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp9" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
