import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: '特別オファー - プログラミングスクール | 初月70%OFF',
    description: '現役エンジニアによるマンツーマン指導。初月限定70%OFF、転職サポート付き。',
    openGraph: {
        title: '特別オファー - プログラミングスクール',
        description: '現役エンジニアによるマンツーマン指導',
        type: 'website',
    },
};

export default function LP4Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="tracking-lp4" strategy="afterInteractive">
                {`
          // 広告タグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
