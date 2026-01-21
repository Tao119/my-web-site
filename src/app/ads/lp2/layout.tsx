import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - オンライン英会話 | 初月50%OFF',
    description: 'ネイティブ講師とマンツーマンレッスン。初月限定50%OFF、無料体験レッスン付き。',
    openGraph: {
        title: '特別オファー - オンライン英会話',
        description: 'ネイティブ講師とマンツーマンレッスン',
        type: 'website',
    },
};

export default function LP2Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp2" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
