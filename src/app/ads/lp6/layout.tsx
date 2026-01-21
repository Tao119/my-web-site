import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - ヨガアイテムセット | 初回55%OFF',
    description: 'プロ推奨のヨガマット・ブロック・ストラップセット。初回限定55%OFF、送料無料。',
    openGraph: {
        title: '特別オファー - ヨガアイテムセット',
        description: 'プロ推奨のヨガマット・ブロック・ストラップセット',
        type: 'website',
    },
};

export default function LP6Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp6" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
