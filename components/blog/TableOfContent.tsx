"use client";

import { useEffect, useState, useRef } from "react";

export interface TocItem {
    id: string;
    text: string;
}

export default function TableOfContents({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string>("");
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (toc.length === 0) return;

        const headingEls = toc
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            { rootMargin: "-80px 0px -60% 0px", threshold: 0 }
        );

        headingEls.forEach((el) => observerRef.current!.observe(el));
        return () => observerRef.current?.disconnect();
    }, [toc]);

    if (toc.length === 0) return null;

    return (
        <aside className="hidden xl:block w-52 shrink-0 self-start sticky top-28">
            <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-4">
                Contents
            </p>
            <nav>
                <ul className="flex flex-col gap-2.5">
                    {toc.map(({ id, text }) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className={[
                                    "font-[family-name:var(--font-dm-mono)] text-[11px] leading-snug transition-colors duration-150 block",
                                    activeId === id
                                        ? "text-[var(--color-accent)]"
                                        : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                                ].join(" ")}
                            >
                                {text}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>
        </aside>
    );
}