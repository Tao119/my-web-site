"use client";

import { useState, useRef } from "react";
import { uploadImage } from '@/lib/imageUpload';
import { ImageUpload } from "../ImageUpload";

interface MarkdownEditorProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

export const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
    value,
    onChange,
    placeholder = "Markdownで記事の本文を入力...",
    className = "",
}) => {
    const [activeTab, setActiveTab] = useState<"edit" | "preview">("edit");
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const renderMarkdownPreview = (markdown: string) => {
        // Basic markdown to HTML conversion for preview
        // In a real implementation, you'd use a library like marked or remark
        return markdown
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            .replace(/!\[([^\]]*)\]\(([^)]*)\)/gim, '<img alt="$1" src="$2" />')
            .replace(/\[([^\]]*)\]\(([^)]*)\)/gim, '<a href="$2">$1</a>')
            .replace(/```([^`]*)```/gim, '<pre><code>$1</code></pre>')
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            .replace(/^\* (.*$)/gim, '<li>$1</li>')
            .replace(/^\d+\. (.*$)/gim, '<li>$1</li>')
            .replace(/\n/gim, '<br>');
    };

    const insertMarkdown = (before: string, after: string = "") => {
        const textarea = document.getElementById("markdown-textarea") as HTMLTextAreaElement;
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = value.substring(start, end);
        const newText = value.substring(0, start) + before + selectedText + after + value.substring(end);

        onChange(newText);

        // Restore cursor position
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    const handleImageUpload = async (file: File) => {
        try {
            setUploading(true);
            const result = await uploadImage(file, 'blog');
            const imageMarkdown = `![${file.name}](${result.url})`;
            insertMarkdown(imageMarkdown);
        } catch (error) {
            console.error('Image upload failed:', error);
            alert('画像のアップロードに失敗しました');
        } finally {
            setUploading(false);
        }
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            handleImageUpload(file);
        }
    };

    const toolbarButtons = [
        { label: "H1", action: () => insertMarkdown("# ") },
        { label: "H2", action: () => insertMarkdown("## ") },
        { label: "H3", action: () => insertMarkdown("### ") },
        { label: "B", action: () => insertMarkdown("**", "**") },
        { label: "I", action: () => insertMarkdown("*", "*") },
        { label: "Code", action: () => insertMarkdown("`", "`") },
        { label: "Link", action: () => insertMarkdown("[", "](url)") },
        { label: "Image", action: handleImageButtonClick, disabled: uploading },
        { label: "List", action: () => insertMarkdown("- ") },
    ];

    return (
        <div className={`c-markdown-editor ${className}`}>
            <div className="c-markdown-editor__header">
                <div className="c-markdown-editor__tabs">
                    <button
                        onClick={() => setActiveTab("edit")}
                        className={`c-markdown-editor__tab ${activeTab === "edit" ? "c-markdown-editor__tab--active" : ""}`}
                    >
                        編集
                    </button>
                    <button
                        onClick={() => setActiveTab("preview")}
                        className={`c-markdown-editor__tab ${activeTab === "preview" ? "c-markdown-editor__tab--active" : ""}`}
                    >
                        プレビュー
                    </button>
                </div>

                {activeTab === "edit" && (
                    <div className="c-markdown-editor__toolbar">
                        {toolbarButtons.map((button, index) => (
                            <button
                                key={index}
                                onClick={button.action}
                                disabled={button.disabled}
                                className="c-markdown-editor__toolbar-btn"
                                title={button.label}
                            >
                                {button.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="c-markdown-editor__content">
                {activeTab === "edit" ? (
                    <textarea
                        id="markdown-textarea"
                        value={value}
                        onChange={(e) => onChange(e.target.value)}
                        placeholder={placeholder}
                        className="c-markdown-editor__textarea"
                        rows={20}
                    />
                ) : (
                    <div
                        className="c-markdown-editor__preview"
                        dangerouslySetInnerHTML={{ __html: renderMarkdownPreview(value) }}
                    />
                )}
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};