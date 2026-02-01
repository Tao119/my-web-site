import { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
    title: '【医師監修】睡眠の質を劇的に改善する7つの習慣 | 健康ライフマガジン',
    description: '睡眠の専門医が推奨する、今日から実践できる睡眠の質を改善する方法を詳しく解説。質の高い睡眠で健康的な毎日を手に入れましょう。',
    openGraph: {
        title: '【医師監修】睡眠の質を劇的に改善する7つの習慣',
        description: '睡眠の専門医が推奨する、今日から実践できる睡眠の質を改善する方法',
        type: 'article',
    },
};

export default function RF10Layout({ children }: { children: ReactNode }) {
    return <>{children}</>;
}
