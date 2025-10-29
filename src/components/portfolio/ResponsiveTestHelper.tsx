"use client";

import React, { useState, useEffect } from 'react';

interface DevicePreset {
    name: string;
    width: number;
    height: number;
    category: 'mobile' | 'tablet' | 'desktop';
    icon: string;
}

interface ResponsiveTestHelperProps {
    isVisible: boolean;
    onClose: () => void;
}

const devicePresets: DevicePreset[] = [
    // Mobile
    { name: 'iPhone SE', width: 375, height: 667, category: 'mobile', icon: '📱' },
    { name: 'iPhone 12', width: 390, height: 844, category: 'mobile', icon: '📱' },
    { name: 'iPhone 12 Pro Max', width: 428, height: 926, category: 'mobile', icon: '📱' },
    { name: 'Samsung Galaxy S21', width: 384, height: 854, category: 'mobile', icon: '📱' },

    // Tablet
    { name: 'iPad Mini', width: 768, height: 1024, category: 'tablet', icon: '📱' },
    { name: 'iPad Air', width: 820, height: 1180, category: 'tablet', icon: '📱' },
    { name: 'iPad Pro 11"', width: 834, height: 1194, category: 'tablet', icon: '📱' },
    { name: 'iPad Pro 12.9"', width: 1024, height: 1366, category: 'tablet', icon: '📱' },

    // Desktop
    { name: 'Laptop Small', width: 1366, height: 768, category: 'desktop', icon: '💻' },
    { name: 'Laptop Medium', width: 1440, height: 900, category: 'desktop', icon: '💻' },
    { name: 'Desktop HD', width: 1920, height: 1080, category: 'desktop', icon: '🖥️' },
    { name: 'Desktop 4K', width: 2560, height: 1440, category: 'desktop', icon: '🖥️' },
];

export const ResponsiveTestHelper: React.FC<ResponsiveTestHelperProps> = ({
    isVisible,
    onClose
}) => {
    const [currentDevice, setCurrentDevice] = useState<DevicePreset | null>(null);
    const [customWidth, setCustomWidth] = useState<string>('');
    const [customHeight, setCustomHeight] = useState<string>('');
    const [activeCategory, setActiveCategory] = useState<'all' | 'mobile' | 'tablet' | 'desktop'>('all');
    const [currentViewport, setCurrentViewport] = useState({ width: 0, height: 0 });

    useEffect(() => {
        const updateViewport = () => {
            setCurrentViewport({
                width: window.innerWidth,
                height: window.innerHeight
            });
        };

        updateViewport();
        window.addEventListener('resize', updateViewport);
        return () => window.removeEventListener('resize', updateViewport);
    }, []);

    const applyDeviceSize = (device: DevicePreset) => {
        setCurrentDevice(device);

        // ブラウザウィンドウのサイズを変更（開発者ツールでのテスト用）
        if (window.outerWidth && window.outerHeight) {
            const newWidth = device.width + (window.outerWidth - window.innerWidth);
            const newHeight = device.height + (window.outerHeight - window.innerHeight);

            try {
                window.resizeTo(newWidth, newHeight);
            } catch (error) {
                // ブラウザがリサイズを許可しない場合は、開発者ツールでの手動調整を促す
                alert(`ブラウザウィンドウを ${device.width}x${device.height} にリサイズしてください。\n開発者ツールのデバイスモードを使用することをお勧めします。`);
            }
        }
    };

    const applyCustomSize = () => {
        const width = parseInt(customWidth);
        const height = parseInt(customHeight);

        if (width > 0 && height > 0) {
            const customDevice: DevicePreset = {
                name: 'カスタム',
                width,
                height,
                category: width < 768 ? 'mobile' : width < 1024 ? 'tablet' : 'desktop',
                icon: '📐'
            };
            applyDeviceSize(customDevice);
        }
    };

    const getFilteredDevices = () => {
        if (activeCategory === 'all') return devicePresets;
        return devicePresets.filter(device => device.category === activeCategory);
    };

    const getCurrentBreakpoint = () => {
        const width = currentViewport.width;
        if (width < 576) return 'xs (< 576px)';
        if (width < 768) return 'sm (576px - 767px)';
        if (width < 992) return 'md (768px - 991px)';
        if (width < 1200) return 'lg (992px - 1199px)';
        if (width < 1400) return 'xl (1200px - 1399px)';
        return 'xxl (≥ 1400px)';
    };

    const testTouchInteractions = () => {
        // タッチイベントのシミュレーション
        const touchableElements = document.querySelectorAll('button, a, [role="button"]');

        touchableElements.forEach((element, index) => {
            const rect = element.getBoundingClientRect();
            const size = Math.min(rect.width, rect.height);

            // 44px未満の要素をハイライト（Appleのガイドライン）
            if (size < 44) {
                element.classList.add('touch-target-small');
                setTimeout(() => {
                    element.classList.remove('touch-target-small');
                }, 3000);
            }
        });

        alert(`タッチターゲットのサイズをチェックしました。\n44px未満の要素が赤くハイライトされています。`);
    };

    if (!isVisible) return null;

    return (
        <div className="responsive-test-helper">
            <div className="responsive-test-helper__overlay" onClick={onClose} />
            <div className="responsive-test-helper__panel">
                <div className="responsive-test-helper__header">
                    <h2 className="responsive-test-helper__title">
                        レスポンシブテストヘルパー
                    </h2>
                    <button
                        className="responsive-test-helper__close"
                        onClick={onClose}
                        aria-label="レスポンシブテストヘルパーを閉じる"
                    >
                        ×
                    </button>
                </div>

                <div className="responsive-test-helper__content">
                    {/* 現在のビューポート情報 */}
                    <div className="responsive-test-helper__current">
                        <h3>現在のビューポート</h3>
                        <div className="responsive-test-helper__viewport-info">
                            <span className="responsive-test-helper__size">
                                {currentViewport.width} × {currentViewport.height}
                            </span>
                            <span className="responsive-test-helper__breakpoint">
                                {getCurrentBreakpoint()}
                            </span>
                        </div>
                        {currentDevice && (
                            <div className="responsive-test-helper__active-device">
                                <span className="responsive-test-helper__device-icon">
                                    {currentDevice.icon}
                                </span>
                                <span className="responsive-test-helper__device-name">
                                    {currentDevice.name}
                                </span>
                            </div>
                        )}
                    </div>

                    {/* カテゴリフィルター */}
                    <div className="responsive-test-helper__categories">
                        {(['all', 'mobile', 'tablet', 'desktop'] as const).map(category => (
                            <button
                                key={category}
                                className={`responsive-test-helper__category ${activeCategory === category ? 'responsive-test-helper__category--active' : ''
                                    }`}
                                onClick={() => setActiveCategory(category)}
                            >
                                {category === 'all' ? 'すべて' :
                                    category === 'mobile' ? 'モバイル' :
                                        category === 'tablet' ? 'タブレット' : 'デスクトップ'}
                            </button>
                        ))}
                    </div>

                    {/* デバイスプリセット */}
                    <div className="responsive-test-helper__devices">
                        <h3>デバイスプリセット</h3>
                        <div className="responsive-test-helper__device-grid">
                            {getFilteredDevices().map((device, index) => (
                                <button
                                    key={index}
                                    className={`responsive-test-helper__device ${currentDevice?.name === device.name ? 'responsive-test-helper__device--active' : ''
                                        }`}
                                    onClick={() => applyDeviceSize(device)}
                                >
                                    <span className="responsive-test-helper__device-icon">
                                        {device.icon}
                                    </span>
                                    <div className="responsive-test-helper__device-info">
                                        <span className="responsive-test-helper__device-name">
                                            {device.name}
                                        </span>
                                        <span className="responsive-test-helper__device-size">
                                            {device.width} × {device.height}
                                        </span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* カスタムサイズ */}
                    <div className="responsive-test-helper__custom">
                        <h3>カスタムサイズ</h3>
                        <div className="responsive-test-helper__custom-inputs">
                            <input
                                type="number"
                                placeholder="幅"
                                value={customWidth}
                                onChange={(e) => setCustomWidth(e.target.value)}
                                className="responsive-test-helper__input"
                            />
                            <span>×</span>
                            <input
                                type="number"
                                placeholder="高さ"
                                value={customHeight}
                                onChange={(e) => setCustomHeight(e.target.value)}
                                className="responsive-test-helper__input"
                            />
                            <button
                                onClick={applyCustomSize}
                                className="responsive-test-helper__apply-btn"
                                disabled={!customWidth || !customHeight}
                            >
                                適用
                            </button>
                        </div>
                    </div>

                    {/* テスト機能 */}
                    <div className="responsive-test-helper__tests">
                        <h3>テスト機能</h3>
                        <div className="responsive-test-helper__test-buttons">
                            <button
                                onClick={testTouchInteractions}
                                className="responsive-test-helper__test-btn"
                            >
                                タッチターゲットテスト
                            </button>
                            <button
                                onClick={() => {
                                    document.body.classList.toggle('responsive-grid-overlay');
                                }}
                                className="responsive-test-helper__test-btn"
                            >
                                グリッドオーバーレイ
                            </button>
                            <button
                                onClick={() => {
                                    window.open('/portfolio', '_blank', `width=${currentViewport.width},height=${currentViewport.height}`);
                                }}
                                className="responsive-test-helper__test-btn"
                            >
                                新しいウィンドウで開く
                            </button>
                        </div>
                    </div>

                    {/* ブレークポイント情報 */}
                    <div className="responsive-test-helper__breakpoints">
                        <h3>ブレークポイント</h3>
                        <div className="responsive-test-helper__breakpoint-list">
                            <div className="responsive-test-helper__breakpoint-item">
                                <span className="responsive-test-helper__bp-name">xs</span>
                                <span className="responsive-test-helper__bp-range">&lt; 576px</span>
                            </div>
                            <div className="responsive-test-helper__breakpoint-item">
                                <span className="responsive-test-helper__bp-name">sm</span>
                                <span className="responsive-test-helper__bp-range">576px - 767px</span>
                            </div>
                            <div className="responsive-test-helper__breakpoint-item">
                                <span className="responsive-test-helper__bp-name">md</span>
                                <span className="responsive-test-helper__bp-range">768px - 991px</span>
                            </div>
                            <div className="responsive-test-helper__breakpoint-item">
                                <span className="responsive-test-helper__bp-name">lg</span>
                                <span className="responsive-test-helper__bp-range">992px - 1199px</span>
                            </div>
                            <div className="responsive-test-helper__breakpoint-item">
                                <span className="responsive-test-helper__bp-name">xl</span>
                                <span className="responsive-test-helper__bp-range">1200px - 1399px</span>
                            </div>
                            <div className="responsive-test-helper__breakpoint-item">
                                <span className="responsive-test-helper__bp-name">xxl</span>
                                <span className="responsive-test-helper__bp-range">≥ 1400px</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResponsiveTestHelper;