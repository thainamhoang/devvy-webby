"use client";

import { useState, useEffect, useCallback } from "react";

export interface LightboxImage {
    src: string;
    caption: string;
}

interface LightboxProps {
    images: LightboxImage[];
    initialIndex?: number;
    onClose: () => void;
}

export default function Lightbox({ images, initialIndex = 0, onClose }: LightboxProps) {
    const [current, setCurrent] = useState(initialIndex);

    const handleKeyDown = useCallback(
        (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowRight") setCurrent((i) => (i + 1) % images.length);
            if (e.key === "ArrowLeft") setCurrent((i) => (i - 1 + images.length) % images.length);
        },
        [images.length, onClose]
    );

    useEffect(() => {
        document.addEventListener("keydown", handleKeyDown);
        document.body.style.overflow = "hidden";
        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [handleKeyDown]);

    const img = images[current];
    const hasMultiple = images.length > 1;

    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center"
            onClick={onClose}
        >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-[var(--color-ink)]/90 backdrop-blur-sm" />

            {/* Panel */}
            <div
                className="relative z-10 max-w-4xl w-full mx-6 flex flex-col"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className="absolute -top-10 right-0 font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] transition-colors"
                >
                    Close ×
                </button>

                {/* Image */}
                <div className="bg-[var(--color-ink)] border border-[var(--color-border)]/30 overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src={img.src}
                        alt={img.caption}
                        className="w-full max-h-[65vh] object-contain"
                    />
                </div>

                {/* Caption + counter */}
                <div className="mt-4 px-1 flex items-start justify-between gap-6">
                    <p className="text-sm text-[var(--color-cream)]/70 leading-relaxed max-w-2xl font-[family-name:var(--font-lora)] italic">
                        {img.caption}
                    </p>
                    {hasMultiple && (
                        <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-cream)]/40 shrink-0 mt-0.5">
                            {current + 1} / {images.length}
                        </span>
                    )}
                </div>

                {/* Prev / Next */}
                {hasMultiple && (
                    <div className="flex gap-3 mt-5">
                        <button
                            onClick={() => setCurrent((i) => (i - 1 + images.length) % images.length)}
                            className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest px-4 py-2 border border-[var(--color-cream)]/20 text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] hover:border-[var(--color-cream)]/50 transition-colors"
                        >
                            ← Prev
                        </button>
                        <button
                            onClick={() => setCurrent((i) => (i + 1) % images.length)}
                            className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest px-4 py-2 border border-[var(--color-cream)]/20 text-[var(--color-cream)]/60 hover:text-[var(--color-cream)] hover:border-[var(--color-cream)]/50 transition-colors"
                        >
                            Next →
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}