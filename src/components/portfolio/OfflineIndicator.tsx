"use client";

import React, { useState, useEffect } from 'react';
import { monitorOnlineStatus } from '@/lib/dataService';

interface OfflineIndicatorProps {
    className?: string;
}

export const OfflineIndicator: React.FC<OfflineIndicatorProps> = ({ className = '' }) => {
    const [isOnline, setIsOnline] = useState(true);
    const [showIndicator, setShowIndicator] = useState(false);

    useEffect(() => {
        const cleanup = monitorOnlineStatus((online) => {
            setIsOnline(online);

            if (!online) {
                setShowIndicator(true);
            } else {
                // オンラインに戻った時は少し遅延してから非表示にする
                setTimeout(() => setShowIndicator(false), 3000);
            }
        });

        return cleanup;
    }, []);

    if (!showIndicator) return null;

    return (
        <div className={`offline-indicator ${!isOnline ? 'offline-indicator--offline' : 'offline-indicator--online'} ${className}`}>
            <div className="offline-indicator__content">
                {!isOnline ? (
                    <>
                        <span className="offline-indicator__icon">📡</span>
                        <span className="offline-indicator__text">
                            オフラインモード - モックデータを表示中
                        </span>
                    </>
                ) : (
                    <>
                        <span className="offline-indicator__icon">✅</span>
                        <span className="offline-indicator__text">
                            オンラインに復帰しました
                        </span>
                    </>
                )}
            </div>
        </div>
    );
};

export default OfflineIndicator;