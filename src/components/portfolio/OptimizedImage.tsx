"use client";

import React, { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { SkeletonLoader } from './SkeletonLoader';

interface OptimizedImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    className?: string;
    priority?: boolean;
    quality?: number;
    placeholder?: 'blur' | 'empty';
    blurDataURL?: string;
    sizes?: string;
    fill?: boolean;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
    objectPosition?: string;
    loading?: 'lazy' | 'eager';
    onLoad?: () => void;
    onError?: () => void;
    fallbackSrc?: string;
    showSkeleton?: boolean;
    skeletonHeight?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
    src,
    alt,
    width,
    height,
    className = '',
    priority = false,
    quality = 75,
    placeholder = 'empty',
    blurDataURL,
    sizes,
    fill = false,
    objectFit = 'cover',
    objectPosition = 'center',
    loading = 'lazy',
    onLoad,
    onError,
    fallbackSrc = '/placeholder-image.jpg',
    showSkeleton = true,
    skeletonHeight = '200px',
}) => {
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const [imageSrc, setImageSrc] = useState(src);
    const [isInView, setIsInView] = useState(false);
    const imgRef = useRef<HTMLDivElement>(null);

    // Intersection Observer for lazy loading
    useEffect(() => {
        if (priority || loading === 'eager') {
            setIsInView(true);
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true);
                    observer.disconnect();
                }
            },
            {
                rootMargin: '50px', // Load image 50px before it comes into view
                threshold: 0.1,
            }
        );

        if (imgRef.current) {
            observer.observe(imgRef.current);
        }

        return () => observer.disconnect();
    }, [priority, loading]);

    const handleLoad = () => {
        setIsLoading(false);
        onLoad?.();
    };

    const handleError = () => {
        setHasError(true);
        setIsLoading(false);
        if (imageSrc !== fallbackSrc) {
            setImageSrc(fallbackSrc);
        }
        onError?.();
    };

    const imageProps = {
        src: imageSrc,
        alt,
        className: `optimized-image ${className}`,
        priority,
        quality,
        placeholder,
        blurDataURL,
        sizes,
        fill,
        style: fill ? undefined : { objectFit, objectPosition },
        onLoad: handleLoad,
        onError: handleError,
        ...(width && height && !fill ? { width, height } : {}),
    };

    return (
        <div
            ref={imgRef}
            className={`optimized-image-container ${isLoading ? 'optimized-image-container--loading' : ''} ${hasError ? 'optimized-image-container--error' : ''}`}
            style={fill ? { position: 'relative' } : undefined}
        >
            {/* Skeleton loader */}
            {isLoading && showSkeleton && (
                <div className="optimized-image__skeleton">
                    <SkeletonLoader
                        variant="rectangular"
                        height={skeletonHeight}
                        className="optimized-image__skeleton-loader"
                    />
                </div>
            )}

            {/* Image */}
            {isInView && (
                <Image
                    {...imageProps}
                    className={`${imageProps.className} ${isLoading ? 'optimized-image--loading' : 'optimized-image--loaded'}`}
                />
            )}

            {/* Error state */}
            {hasError && imageSrc === fallbackSrc && (
                <div className="optimized-image__error">
                    <div className="optimized-image__error-icon">📷</div>
                    <div className="optimized-image__error-text">画像を読み込めませんでした</div>
                </div>
            )}
        </div>
    );
};

// プリロード用のコンポーネント
interface ImagePreloaderProps {
    images: string[];
    priority?: boolean;
}

export const ImagePreloader: React.FC<ImagePreloaderProps> = ({
    images,
    priority = false,
}) => {
    useEffect(() => {
        if (priority) {
            // 重要な画像は即座にプリロード
            images.forEach(src => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = src;
                document.head.appendChild(link);
            });
        } else {
            // その他の画像は遅延プリロード
            const preloadImages = () => {
                images.forEach(src => {
                    const img = new window.Image();
                    img.src = src;
                });
            };

            // ページロード後にプリロード
            if (document.readyState === 'complete') {
                setTimeout(preloadImages, 1000);
            } else {
                window.addEventListener('load', () => {
                    setTimeout(preloadImages, 1000);
                });
            }
        }
    }, [images, priority]);

    return null;
};

// レスポンシブ画像コンポーネント
interface ResponsiveImageProps extends Omit<OptimizedImageProps, 'width' | 'height' | 'sizes'> {
    breakpoints: {
        mobile: { width: number; height: number };
        tablet: { width: number; height: number };
        desktop: { width: number; height: number };
    };
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
    breakpoints,
    ...props
}) => {
    const sizes = `
        (max-width: 768px) ${breakpoints.mobile.width}px,
        (max-width: 1024px) ${breakpoints.tablet.width}px,
        ${breakpoints.desktop.width}px
    `;

    return (
        <OptimizedImage
            {...props}
            width={breakpoints.desktop.width}
            height={breakpoints.desktop.height}
            sizes={sizes}
        />
    );
};

// サムネイル画像コンポーネント
interface ThumbnailImageProps extends Omit<OptimizedImageProps, 'fill'> {
    aspectRatio?: string;
}

export const ThumbnailImage: React.FC<ThumbnailImageProps> = ({
    aspectRatio = '16/9',
    className = '',
    ...props
}) => {
    return (
        <div
            className={`thumbnail-image-container ${className}`}
            style={{ aspectRatio }}
        >
            <OptimizedImage
                {...props}
                fill
                objectFit="cover"
                className="thumbnail-image"
            />
        </div>
    );
};

// 画像ギャラリー用のコンポーネント
interface ImageGalleryProps {
    images: Array<{
        src: string;
        alt: string;
        caption?: string;
    }>;
    columns?: number;
    gap?: string;
    className?: string;
}

export const ImageGallery: React.FC<ImageGalleryProps> = ({
    images,
    columns = 3,
    gap = '1rem',
    className = '',
}) => {
    const [selectedImage, setSelectedImage] = useState<number | null>(null);

    const handleImageClick = (index: number) => {
        setSelectedImage(index);
    };

    const handleCloseModal = () => {
        setSelectedImage(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent) => {
        if (event.key === 'Escape') {
            handleCloseModal();
        } else if (event.key === 'ArrowLeft' && selectedImage !== null && selectedImage > 0) {
            setSelectedImage(selectedImage - 1);
        } else if (event.key === 'ArrowRight' && selectedImage !== null && selectedImage < images.length - 1) {
            setSelectedImage(selectedImage + 1);
        }
    };

    return (
        <>
            <div
                className={`image-gallery ${className}`}
                style={{
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columns}, 1fr)`,
                    gap,
                }}
            >
                {images.map((image, index) => (
                    <div
                        key={index}
                        className="image-gallery__item"
                        onClick={() => handleImageClick(index)}
                        onKeyDown={(e) => e.key === 'Enter' && handleImageClick(index)}
                        tabIndex={0}
                        role="button"
                        aria-label={`画像を拡大表示: ${image.alt}`}
                    >
                        <OptimizedImage
                            src={image.src}
                            alt={image.alt}
                            fill
                            objectFit="cover"
                            className="image-gallery__image"
                        />
                        {image.caption && (
                            <div className="image-gallery__caption">
                                {image.caption}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Modal */}
            {selectedImage !== null && (
                <div
                    className="image-gallery__modal"
                    onClick={handleCloseModal}
                    onKeyDown={handleKeyDown}
                    tabIndex={0}
                    role="dialog"
                    aria-modal="true"
                    aria-label="画像拡大表示"
                >
                    <div className="image-gallery__modal-content">
                        <button
                            className="image-gallery__modal-close"
                            onClick={handleCloseModal}
                            aria-label="モーダルを閉じる"
                        >
                            ×
                        </button>
                        <OptimizedImage
                            src={images[selectedImage].src}
                            alt={images[selectedImage].alt}
                            fill
                            objectFit="contain"
                            className="image-gallery__modal-image"
                            priority
                        />
                        {images[selectedImage].caption && (
                            <div className="image-gallery__modal-caption">
                                {images[selectedImage].caption}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </>
    );
};