"use client";

import React, { useState, useRef, useCallback } from 'react';
import { uploadImage, deleteImage, UploadProgress } from '@/lib/imageUpload';
import Image from 'next/image';

interface ImageUploadProps {
    onUploadComplete: (url: string) => void;
    onUploadError?: (error: string) => void;
    folder?: string;
    currentImage?: string;
    className?: string;
    accept?: string;
    disabled?: boolean;
    showPreview?: boolean;
    multiple?: boolean;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
    onUploadComplete,
    onUploadError,
    folder = 'images',
    currentImage,
    className = '',
    accept = 'image/*',
    disabled = false,
    showPreview = true,
    multiple = false
}) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragOver, setDragOver] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(currentImage || null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpload = useCallback(async (file: File) => {
        setUploading(true);
        setProgress(0);

        try {
            // プレビュー表示
            if (showPreview) {
                const preview = URL.createObjectURL(file);
                setPreviewUrl(preview);
            }

            // 統合アップロード機能を使用（ローカル/Firebase自動判定）
            const result = await uploadImage(
                file,
                folder,
                (progress: UploadProgress) => {
                    setProgress(progress.progress);
                }
            );

            onUploadComplete(result.url);
            setPreviewUrl(result.url);

        } catch (error) {
            console.error('Upload error:', error);
            onUploadError?.(error instanceof Error ? error.message : 'アップロードに失敗しました');
            setPreviewUrl(currentImage || null);
        } finally {
            setUploading(false);
            setProgress(0);
        }
    }, [folder, onUploadComplete, onUploadError, currentImage, showPreview]);

    const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleDrop = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);

        const file = event.dataTransfer.files[0];
        if (file) {
            handleUpload(file);
        }
    }, [handleUpload]);

    const handleDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(true);
    }, []);

    const handleDragLeave = useCallback((event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        setDragOver(false);
    }, []);

    const handleClick = useCallback(() => {
        if (!disabled && !uploading) {
            fileInputRef.current?.click();
        }
    }, [disabled, uploading]);

    const handleRemove = useCallback(async () => {
        if (previewUrl && previewUrl.startsWith('/uploads/')) {
            try {
                // ローカルアップロードされた画像の場合
                const path = previewUrl.replace('/uploads/', 'uploads/');
                await deleteImage(path);
            } catch (error) {
                console.warn('Failed to delete image:', error);
            }
        }
        setPreviewUrl(null);
        onUploadComplete('');
    }, [previewUrl, onUploadComplete]);

    return (
        <div className={`c-image-upload ${className}`}>
            <div
                className={`c-image-upload__dropzone ${dragOver ? 'c-image-upload__dropzone--drag-over' : ''} ${disabled ? 'c-image-upload__dropzone--disabled' : ''}`}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={handleClick}
            >
                {previewUrl && showPreview ? (
                    <div className="c-image-upload__preview">
                        <Image
                            src={previewUrl}
                            alt="Preview"
                            width={200}
                            height={200}
                            className="c-image-upload__preview-image"
                        />
                        {!uploading && (
                            <button
                                type="button"
                                className="c-image-upload__remove"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleRemove();
                                }}
                            >
                                ×
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="c-image-upload__placeholder">
                        <div className="c-image-upload__icon">📷</div>
                        <p className="c-image-upload__text">
                            {uploading ? 'アップロード中...' : 'クリックまたはドラッグして画像をアップロード'}
                        </p>
                    </div>
                )}

                {uploading && (
                    <div className="c-image-upload__progress">
                        <div className="c-image-upload__progress-track">
                            <div
                                className="c-image-upload__progress-bar"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                        <span className="c-image-upload__progress-text">
                            {Math.round(progress)}%
                        </span>
                    </div>
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept={accept}
                onChange={handleFileSelect}
                className="c-image-upload__input"
                disabled={disabled || uploading}
                multiple={multiple}
            />
        </div>
    );
};

export default ImageUpload;