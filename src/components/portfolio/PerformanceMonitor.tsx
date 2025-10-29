"use client";

import React, { useEffect, useState, useCallback } from 'react';

interface PerformanceMetrics {
    fcp: number | null; // First Contentful Paint
    lcp: number | null; // Largest Contentful Paint
    fid: number | null; // First Input Delay
    cls: number | null; // Cumulative Layout Shift
    ttfb: number | null; // Time to First Byte
}

interface PerformanceMonitorProps {
    onMetricsUpdate?: (metrics: PerformanceMetrics) => void;
    enableConsoleLogging?: boolean;
    enableVisualIndicator?: boolean;
}

export const PerformanceMonitor: React.FC<PerformanceMonitorProps> = ({
    onMetricsUpdate,
    enableConsoleLogging = false,
    enableVisualIndicator = false,
}) => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
    });

    const [isVisible, setIsVisible] = useState(false);

    const updateMetrics = useCallback((newMetrics: Partial<PerformanceMetrics>) => {
        setMetrics(prev => {
            const updated = { ...prev, ...newMetrics };
            onMetricsUpdate?.(updated);
            return updated;
        });
    }, [onMetricsUpdate]);

    const logMetric = useCallback((name: string, value: number) => {
        if (enableConsoleLogging) {
            console.log(`Performance Metric - ${name}: ${value.toFixed(2)}ms`);
        }
    }, [enableConsoleLogging]);

    useEffect(() => {
        // Web Vitals の測定
        const measureWebVitals = () => {
            // First Contentful Paint
            const fcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const fcpEntry = entries.find(entry => entry.name === 'first-contentful-paint');
                if (fcpEntry) {
                    const fcp = fcpEntry.startTime;
                    updateMetrics({ fcp });
                    logMetric('First Contentful Paint', fcp);
                }
            });

            // Largest Contentful Paint
            const lcpObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                const lastEntry = entries[entries.length - 1];
                if (lastEntry) {
                    const lcp = lastEntry.startTime;
                    updateMetrics({ lcp });
                    logMetric('Largest Contentful Paint', lcp);
                }
            });

            // First Input Delay
            const fidObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (entry.processingStart && entry.startTime) {
                        const fid = entry.processingStart - entry.startTime;
                        updateMetrics({ fid });
                        logMetric('First Input Delay', fid);
                    }
                });
            });

            // Cumulative Layout Shift
            let clsValue = 0;
            const clsObserver = new PerformanceObserver((list) => {
                const entries = list.getEntries();
                entries.forEach((entry: any) => {
                    if (!entry.hadRecentInput) {
                        clsValue += entry.value;
                    }
                });
                updateMetrics({ cls: clsValue });
                logMetric('Cumulative Layout Shift', clsValue);
            });

            try {
                fcpObserver.observe({ entryTypes: ['paint'] });
                lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
                fidObserver.observe({ entryTypes: ['first-input'] });
                clsObserver.observe({ entryTypes: ['layout-shift'] });
            } catch (error) {
                console.warn('Performance Observer not supported:', error);
            }

            // Time to First Byte (Navigation Timing API)
            if (performance.timing) {
                const ttfb = performance.timing.responseStart - performance.timing.navigationStart;
                updateMetrics({ ttfb });
                logMetric('Time to First Byte', ttfb);
            }

            return () => {
                fcpObserver.disconnect();
                lcpObserver.disconnect();
                fidObserver.disconnect();
                clsObserver.disconnect();
            };
        };

        const cleanup = measureWebVitals();
        return cleanup;
    }, [updateMetrics, logMetric]);

    // リソース使用量の監視
    useEffect(() => {
        const monitorResources = () => {
            if ('memory' in performance) {
                const memory = (performance as any).memory;
                if (enableConsoleLogging) {
                    console.log('Memory Usage:', {
                        used: `${(memory.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                        total: `${(memory.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
                        limit: `${(memory.jsHeapSizeLimit / 1024 / 1024).toFixed(2)} MB`,
                    });
                }
            }
        };

        const interval = setInterval(monitorResources, 10000); // 10秒ごと
        return () => clearInterval(interval);
    }, [enableConsoleLogging]);

    const getMetricStatus = (metric: keyof PerformanceMetrics, value: number | null) => {
        if (value === null) return 'unknown';

        switch (metric) {
            case 'fcp':
                return value < 1800 ? 'good' : value < 3000 ? 'needs-improvement' : 'poor';
            case 'lcp':
                return value < 2500 ? 'good' : value < 4000 ? 'needs-improvement' : 'poor';
            case 'fid':
                return value < 100 ? 'good' : value < 300 ? 'needs-improvement' : 'poor';
            case 'cls':
                return value < 0.1 ? 'good' : value < 0.25 ? 'needs-improvement' : 'poor';
            case 'ttfb':
                return value < 800 ? 'good' : value < 1800 ? 'needs-improvement' : 'poor';
            default:
                return 'unknown';
        }
    };

    if (!enableVisualIndicator) return null;

    return (
        <div className={`performance-monitor ${isVisible ? 'performance-monitor--visible' : ''}`}>
            <button
                className="performance-monitor__toggle"
                onClick={() => setIsVisible(!isVisible)}
                aria-label="パフォーマンスメトリクスを表示/非表示"
            >
                📊
            </button>

            {isVisible && (
                <div className="performance-monitor__panel">
                    <h3 className="performance-monitor__title">Performance Metrics</h3>
                    <div className="performance-monitor__metrics">
                        {Object.entries(metrics).map(([key, value]) => {
                            const status = getMetricStatus(key as keyof PerformanceMetrics, value);
                            return (
                                <div key={key} className={`performance-monitor__metric performance-monitor__metric--${status}`}>
                                    <span className="performance-monitor__metric-name">
                                        {key.toUpperCase()}
                                    </span>
                                    <span className="performance-monitor__metric-value">
                                        {value !== null ? `${value.toFixed(2)}${key === 'cls' ? '' : 'ms'}` : 'N/A'}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

// パフォーマンス最適化のためのヒント表示コンポーネント
interface PerformanceHintsProps {
    metrics: PerformanceMetrics;
}

export const PerformanceHints: React.FC<PerformanceHintsProps> = ({ metrics }) => {
    const getHints = () => {
        const hints: string[] = [];

        if (metrics.fcp && metrics.fcp > 3000) {
            hints.push('First Contentful Paint が遅いです。画像の最適化やCSSの最小化を検討してください。');
        }

        if (metrics.lcp && metrics.lcp > 4000) {
            hints.push('Largest Contentful Paint が遅いです。重要なリソースのプリロードを検討してください。');
        }

        if (metrics.fid && metrics.fid > 300) {
            hints.push('First Input Delay が長いです。JavaScriptの実行時間を短縮してください。');
        }

        if (metrics.cls && metrics.cls > 0.25) {
            hints.push('Cumulative Layout Shift が大きいです。画像やフォントのサイズを事前に指定してください。');
        }

        if (metrics.ttfb && metrics.ttfb > 1800) {
            hints.push('Time to First Byte が遅いです。サーバーの応答時間を改善してください。');
        }

        return hints;
    };

    const hints = getHints();

    if (hints.length === 0) {
        return (
            <div className="performance-hints performance-hints--good">
                <h4>✅ パフォーマンスは良好です！</h4>
            </div>
        );
    }

    return (
        <div className="performance-hints performance-hints--needs-improvement">
            <h4>💡 パフォーマンス改善のヒント</h4>
            <ul>
                {hints.map((hint, index) => (
                    <li key={index}>{hint}</li>
                ))}
            </ul>
        </div>
    );
};

// カスタムフック
export const usePerformanceMetrics = () => {
    const [metrics, setMetrics] = useState<PerformanceMetrics>({
        fcp: null,
        lcp: null,
        fid: null,
        cls: null,
        ttfb: null,
    });

    const updateMetrics = useCallback((newMetrics: PerformanceMetrics) => {
        setMetrics(newMetrics);
    }, []);

    return { metrics, updateMetrics };
};