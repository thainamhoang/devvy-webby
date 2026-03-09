"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";

interface TocItem {
    id: string;
    text: string;
}

function TableOfContents({ toc }: { toc: TocItem[] }) {
    const [activeId, setActiveId] = useState<string>("");
    const observerRef = useRef<IntersectionObserver | null>(null);

    useEffect(() => {
        if (toc.length === 0) return;

        const headingEls = toc
            .map(({ id }) => document.getElementById(id))
            .filter(Boolean) as HTMLElement[];

        observerRef.current = new IntersectionObserver(
            (entries) => {
                // Find the topmost visible heading
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

                if (visible.length > 0) {
                    setActiveId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-80px 0px -60% 0px",
                threshold: 0,
            }
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

export default function BlogPostClient({
    html,
    toc,
    post,
}: {
    html: string;
    toc: TocItem[];
    post: {
        title: string;
        date: string;
        series?: string;
        seriesIndex?: number;
        tags?: string[];
        formattedDate: string;
    };
}) {
    return (
        <div className="max-w-6xl mx-auto px-10 md:px-16 pt-28 pb-24">
            <div className="flex gap-16">

                {/* ── Main content ── */}
                <div className="flex-1 min-w-0">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-1.5 font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200 mb-10"
                    >
                        ← All Posts
                    </Link>

                    {post.series && (
                        <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-accent)] mb-4">
                            {post.series}
                        </p>
                    )}

                    <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl leading-[1.1] text-[var(--color-ink)] mb-5">
                        {post.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-3 mb-10">
                        <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)]">
                            {post.formattedDate}
                        </span>
                        {post.tags?.map((tag) => (
                            <span
                                key={tag}
                                className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest px-2 py-0.5 border border-[var(--color-border)] text-[var(--color-muted)]"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>

                    <hr className="border-[var(--color-border)] mb-10" />

                    <div
                        className="prose-content font-[family-name:var(--font-lora)] text-[var(--color-ink)] leading-relaxed

                            [&_h2]:font-[family-name:var(--font-fraunces)] [&_h2]:text-2xl [&_h2]:font-normal [&_h2]:text-[var(--color-ink)] [&_h2]:mt-12 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-[var(--color-border)]
                            [&_h3]:font-[family-name:var(--font-fraunces)] [&_h3]:text-lg [&_h3]:font-normal [&_h3]:text-[var(--color-ink)] [&_h3]:mt-8 [&_h3]:mb-3

                            [&_p]:mb-5 [&_p]:text-base

                            [&_strong]:text-[var(--color-ink)] [&_strong]:font-semibold
                            [&_em]:italic

                            [&_ul]:mb-5 [&_ul]:pl-5 [&_ul>li]:mb-1.5 [&_ul>li]:list-disc [&_ul>li]:marker:text-[var(--color-accent)]
                            [&_ol]:mb-5 [&_ol]:pl-5 [&_ol>li]:mb-1.5 [&_ol>li]:list-decimal

                            [&_blockquote]:border-l-2 [&_blockquote]:border-[var(--color-accent)] [&_blockquote]:pl-4 [&_blockquote]:text-[var(--color-muted)] [&_blockquote]:italic [&_blockquote]:my-6

                            [&_code]:font-[family-name:var(--font-dm-mono)] [&_code]:text-sm [&_code]:bg-[var(--color-ink)]/5 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded-sm
                            [&_pre]:bg-[var(--color-ink)]/[0.04] [&_pre]:border [&_pre]:border-[var(--color-border)] [&_pre]:rounded-sm [&_pre]:p-5 [&_pre]:overflow-x-auto [&_pre]:my-6 [&_pre>code]:bg-transparent [&_pre>code]:p-0

                            [&_table]:w-full [&_table]:my-6 [&_table]:text-sm [&_table]:border-collapse
                            [&_th]:font-[family-name:var(--font-dm-mono)] [&_th]:text-xs [&_th]:uppercase [&_th]:tracking-widest [&_th]:text-[var(--color-muted)] [&_th]:text-left [&_th]:pb-2 [&_th]:border-b [&_th]:border-[var(--color-border)]
                            [&_td]:py-2 [&_td]:pr-4 [&_td]:border-b [&_td]:border-[var(--color-border)]/50
                            [&_tr:last-child_td]:border-b-0

                            [&_hr]:border-[var(--color-border)] [&_hr]:my-10

                            [&_a]:text-[var(--color-ink)] [&_a]:underline [&_a]:underline-offset-4 [&_a]:decoration-[var(--color-border)] hover:[&_a]:decoration-[var(--color-accent)]

                            [&_.katex-display]:overflow-x-auto [&_.katex-display]:py-2
                        "
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                </div>

                {/* ── Sticky TOC ── */}
                <TableOfContents toc={toc} />
            </div>
        </div>
    );
}