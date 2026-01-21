import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'お申し込みありがとうございます | フィットネスアプリ',
    description: 'ご登録が完了しました。確認メールをご確認ください。',
    robots: {
        index: false,
        follow: false,
    },
};

export default function CV3Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="conversion-cv3" strategy="afterInteractive">
                {`
          // コンバージョンタグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
