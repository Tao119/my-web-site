import { ReactNode } from 'react';
import type { Metadata } from 'next';
import Script from 'next/script';

export const metadata: Metadata = {
    title: 'ご購入ありがとうございます | 読書グッズセット',
    description: 'ご注文が完了しました。確認メールをご確認ください。',
    robots: {
        index: false,
        follow: false,
    },
};

export default function CV7Layout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグをここに追加 */}
            <Script id="conversion-cv7" strategy="afterInteractive">
                {`
          // コンバージョンタグのコードをここに記述
        `}
            </Script>

            {children}
        </>
    );
}
