import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - 読書グッズセット | 初回45%OFF',
    description: 'プレミアムブックライト・しおり・ブックスタンドセット。初回限定45%OFF、送料無料。',
    openGraph: {
        title: '特別オファー - 読書グッズセット',
        description: 'プレミアムブックライト・しおり・ブックスタンドセット',
        type: 'website',
    },
};

export default function LP7Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp7" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
