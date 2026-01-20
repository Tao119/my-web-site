import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '特別オファー - プレミアムコーヒー定期便',
    description: '厳選された世界のコーヒー豆を毎月お届け',
};

export default function AdsLayout({ children }: { children: ReactNode }) {
    return (
        <>
            {/* 広告タグは各ページのheadタグ内に埋め込んでください */}
            {children}
        </>
    );
}
