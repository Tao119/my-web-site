"use client";

import React, { useState, useEffect } from 'react';
import { useColorContrast } from './AccessibilityUtils';

interface AccessibilityIssue {
    type: 'contrast' | 'alt' | 'heading' | 'focus' | 'aria';
    severity: 'error' | 'warning' | 'info';
    element: string;
    message: string;
    suggestion: string;
}

interface AccessibilityTesterProps {
    isVisible: boolean;
    onClose: () => void;
}

export const AccessibilityTester: React.FC<AccessibilityTesterProps> = ({
    isVisible,
    onClose
}) => {
    const [issues, setIssues] = useState<AccessibilityIssue[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [activeTab, setActiveTab] = useState<'issues' | 'contrast' | 'keyboard'>('issues');
    const { checkContrast, isAccessible } = useColorContrast();

    const scanForIssues = () => {
        setIsScanning(true);
        const foundIssues: AccessibilityIssue[] = [];

        // 画像のalt属性チェック
        const images = document.querySelectorAll('img');
        images.forEach((img, index) => {
            if (!img.alt) {
                foundIssues.push({
                    type: 'alt',
                    severity: 'error',
                    element: `img[${index}]`,
                    message: '画像にalt属性がありません',
                    suggestion: 'alt属性を追加して画像の説明を提供してください'
                });
            }
        });

        // 見出しの階層チェック
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        let lastLevel = 0;
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.charAt(1));
            if (level > lastLevel + 1) {
                foundIssues.push({
                    type: 'heading',
                    severity: 'warning',
                    element: `${heading.tagName.toLowerCase()}[${index}]`,
                    message: '見出しレベルがスキップされています',
                    suggestion: '見出しは順序立てて使用してください（h1→h2→h3...）'
                });
            }
            lastLevel = level;
        });

        // フォーカス可能な要素のチェック
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        focusableElements.forEach((element, index) => {
            const computedStyle = window.getComputedStyle(element);
            if (computedStyle.outline === 'none' && !element.classList.contains('accessible-button')) {
                foundIssues.push({
                    type: 'focus',
                    severity: 'warning',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: 'フォーカス表示が無効化されています',
                    suggestion: 'キーボードユーザーのためにフォーカス表示を提供してください'
                });
            }
        });

        // ARIA属性のチェック
        const elementsWithAriaLabel = document.querySelectorAll('[aria-label]');
        elementsWithAriaLabel.forEach((element, index) => {
            const ariaLabel = element.getAttribute('aria-label');
            if (!ariaLabel || ariaLabel.trim() === '') {
                foundIssues.push({
                    type: 'aria',
                    severity: 'error',
                    element: `${element.tagName.toLowerCase()}[${index}]`,
                    message: 'aria-label属性が空です',
                    suggestion: '意味のあるaria-labelを提供してください'
                });
            }
        });

        setIssues(foundIssues);
        setIsScanning(false);
    };

    const getSeverityIcon = (severity: AccessibilityIssue['severity']) => {
        switch (severity) {
            case 'error': return '🔴';
            case 'warning': return '🟡';
            case 'info': return '🔵';
            default: return '⚪';
        }
    };

    const getTypeLabel = (type: AccessibilityIssue['type']) => {
        switch (type) {
            case 'contrast': return 'コントラスト';
            case 'alt': return '代替テキスト';
            case 'heading': return '見出し構造';
            case 'focus': return 'フォーカス';
            case 'aria': return 'ARIA属性';
            default: return 'その他';
        }
    };

    const testKeyboardNavigation = () => {
        const focusableElements = document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        let currentIndex = 0;
        const highlightElement = (element: Element) => {
            // 既存のハイライトを削除
            document.querySelectorAll('.a11y-highlight').forEach(el => {
                el.classList.remove('a11y-highlight');
            });

            // 新しい要素をハイライト
            element.classList.add('a11y-highlight');
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        };

        const nextElement = () => {
            if (currentIndex < focusableElements.length - 1) {
                currentIndex++;
                highlightElement(focusableElements[currentIndex]);
            }
        };

        const prevElement = () => {
            if (currentIndex > 0) {
                currentIndex--;
                highlightElement(focusableElements[currentIndex]);
            }
        };

        // 最初の要素をハイライト
        if (focusableElements.length > 0) {
            highlightElement(focusableElements[0]);
        }

        return { nextElement, prevElement, total: focusableElements.length };
    };

    useEffect(() => {
        if (isVisible) {
            scanForIssues();
        }
    }, [isVisible]);

    if (!isVisible) return null;

    return (
        <div className="accessibility-tester">
            <div className="accessibility-tester__overlay" onClick={onClose} />
            <div className="accessibility-tester__panel">
                <div className="accessibility-tester__header">
                    <h2 className="accessibility-tester__title">
                        アクセシビリティチェッカー
                    </h2>
                    <button
                        className="accessibility-tester__close"
                        onClick={onClose}
                        aria-label="アクセシビリティチェッカーを閉じる"
                    >
                        ×
                    </button>
                </div>

                <div className="accessibility-tester__tabs">
                    <button
                        className={`accessibility-tester__tab ${activeTab === 'issues' ? 'accessibility-tester__tab--active' : ''}`}
                        onClick={() => setActiveTab('issues')}
                    >
                        問題点 ({issues.length})
                    </button>
                    <button
                        className={`accessibility-tester__tab ${activeTab === 'contrast' ? 'accessibility-tester__tab--active' : ''}`}
                        onClick={() => setActiveTab('contrast')}
                    >
                        コントラスト
                    </button>
                    <button
                        className={`accessibility-tester__tab ${activeTab === 'keyboard' ? 'accessibility-tester__tab--active' : ''}`}
                        onClick={() => setActiveTab('keyboard')}
                    >
                        キーボード
                    </button>
                </div>

                <div className="accessibility-tester__content">
                    {activeTab === 'issues' && (
                        <div className="accessibility-tester__issues">
                            <div className="accessibility-tester__actions">
                                <button
                                    className="accessibility-tester__scan-button"
                                    onClick={scanForIssues}
                                    disabled={isScanning}
                                >
                                    {isScanning ? '検査中...' : '再検査'}
                                </button>
                            </div>

                            {issues.length === 0 ? (
                                <div className="accessibility-tester__no-issues">
                                    <div className="accessibility-tester__success-icon">✅</div>
                                    <p>アクセシビリティの問題は見つかりませんでした！</p>
                                </div>
                            ) : (
                                <div className="accessibility-tester__issues-list">
                                    {issues.map((issue, index) => (
                                        <div key={index} className="accessibility-tester__issue">
                                            <div className="accessibility-tester__issue-header">
                                                <span className="accessibility-tester__issue-severity">
                                                    {getSeverityIcon(issue.severity)}
                                                </span>
                                                <span className="accessibility-tester__issue-type">
                                                    {getTypeLabel(issue.type)}
                                                </span>
                                                <span className="accessibility-tester__issue-element">
                                                    {issue.element}
                                                </span>
                                            </div>
                                            <p className="accessibility-tester__issue-message">
                                                {issue.message}
                                            </p>
                                            <p className="accessibility-tester__issue-suggestion">
                                                💡 {issue.suggestion}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'contrast' && (
                        <div className="accessibility-tester__contrast">
                            <p>コントラスト比チェック機能（開発中）</p>
                            <div className="accessibility-tester__contrast-info">
                                <h3>WCAG 2.1 ガイドライン</h3>
                                <ul>
                                    <li>AA レベル: 4.5:1 以上</li>
                                    <li>AAA レベル: 7:1 以上</li>
                                </ul>
                            </div>
                        </div>
                    )}

                    {activeTab === 'keyboard' && (
                        <div className="accessibility-tester__keyboard">
                            <p>キーボードナビゲーションテスト</p>
                            <div className="accessibility-tester__keyboard-controls">
                                <button
                                    className="accessibility-tester__keyboard-button"
                                    onClick={() => {
                                        const { nextElement, prevElement } = testKeyboardNavigation();
                                        // キーボードイベントリスナーを追加
                                    }}
                                >
                                    テスト開始
                                </button>
                            </div>
                            <div className="accessibility-tester__keyboard-info">
                                <h3>キーボードナビゲーション</h3>
                                <ul>
                                    <li>Tab: 次の要素</li>
                                    <li>Shift + Tab: 前の要素</li>
                                    <li>Enter/Space: アクティベート</li>
                                    <li>Escape: 閉じる/キャンセル</li>
                                </ul>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AccessibilityTester;