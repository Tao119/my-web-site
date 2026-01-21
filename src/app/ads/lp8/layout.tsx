import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - プレミアム日本茶定期便 | 初回65%OFF',
    description: '茶師厳選の高級日本茶を毎月お届け。初回限定65%OFF、送料無料、いつでも解約OK。',
    openGraph: {
        title: '特別オファー - プレミアム日本茶定期便',
        description: '茶師厳選の高級日本茶を毎月お届け',
        type: 'website',
    },
};

export default function LP8Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp8" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
