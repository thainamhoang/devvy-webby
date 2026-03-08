import { notFound } from "next/navigation";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import { getAllPosts, getPostBySlug, getSeriesNeighbors, formatDate } from "@/lib/blog";
import Prose from "@/components/blog/Prose";
import type { Metadata } from "next";
import { renderPost } from "@/lib/blog";

// Import KaTeX CSS globally — add this to your layout.tsx instead if preferred
import "katex/dist/katex.min.css";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) return {};
    return {
        title: `${post.title} — Thai-Nam Hoang`,
        description: post.description,
    };
}

const mdxOptions = {
    mdxOptions: {
        remarkPlugins: [remarkMath],
        rehypePlugins: [[rehypeKatex, { strict: false }]],
        format: "md" as const,
    },
};

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const html = await renderPost(post.content);
    const { prev, next } = getSeriesNeighbors(slug);

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-10 md:px-16">
                <div className="max-w-3xl mx-auto">

                    {/* ── Main content ── */}
                    <article>
                        {/* Back link */}
                        <Link
                            href="/blog"
                            className="inline-flex items-center gap-2 font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200 mb-10"
                        >
                            ← All posts
                        </Link>

                        {/* Series badge */}
                        {post.series && (
                            <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-accent)] mb-3">
                                {post.series}
                                {post.seriesIndex != null && ` · Post ${post.seriesIndex}`}
                            </p>
                        )}

                        {/* Title */}
                        <h1 className="font-[family-name:var(--font-fraunces)] text-3xl md:text-4xl lg:text-5xl text-[var(--color-ink)] leading-[1.1] mb-4">
                            {post.title}
                        </h1>

                        {/* Meta row */}
                        <div className="flex flex-wrap items-center gap-4 mb-8 pb-8 border-b border-[var(--color-border)]">
                            <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)]">
                                {formatDate(post.date)}
                            </span>
                            {post.tags?.map((tag) => (
                                <span
                                    key={tag}
                                    className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-0.5"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {/* Body */}
                        <Prose>
                            {/* <MDXRemote source={post.content} {...mdxOptions} /> */}
                            <div dangerouslySetInnerHTML={{ __html: html }} />
                        </Prose>

                        {/* ── Series navigation ── */}
                        {(prev || next) && (
                            <nav className="mt-16 pt-8 border-t border-[var(--color-border)] grid grid-cols-2 gap-4">
                                <div>
                                    {prev && (
                                        <Link
                                            href={`/blog/${prev.slug}`}
                                            className="group flex flex-col gap-1"
                                        >
                                            <span className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                                                ← Previous
                                            </span>
                                            <span className="font-[family-name:var(--font-fraunces)] text-sm text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                                                {prev.title}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                                <div className="text-right">
                                    {next && (
                                        <Link
                                            href={`/blog/${next.slug}`}
                                            className="group flex flex-col gap-1 items-end"
                                        >
                                            <span className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)] group-hover:text-[var(--color-accent)] transition-colors">
                                                Next →
                                            </span>
                                            <span className="font-[family-name:var(--font-fraunces)] text-sm text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors leading-snug">
                                                {next.title}
                                            </span>
                                        </Link>
                                    )}
                                </div>
                            </nav>
                        )}
                    </article>
                </div>
            </div>
        </main>
    );
}

/* ── Series sidebar ───────────────────────────────────────────────────────── */

function SeriesSidebar({
    currentSlug,
    seriesName,
}: {
    currentSlug: string;
    seriesName: string;
}) {
    const all = getAllPosts();
    const seriesPosts = all
        .filter((p) => p.series === seriesName && p.seriesIndex != null)
        .sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0));

    if (seriesPosts.length === 0) return null;

    return (
        <div>
            <p className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)] mb-3">
                {seriesName}
            </p>
            <ul className="space-y-1">
                {seriesPosts.map((p) => {
                    const isCurrent = p.slug === currentSlug;
                    return (
                        <li key={p.slug}>
                            <Link
                                href={`/blog/${p.slug}`}
                                className={[
                                    "flex items-start gap-2 py-1.5 transition-colors duration-200 text-xs leading-snug",
                                    isCurrent
                                        ? "text-[var(--color-ink)] font-medium pointer-events-none"
                                        : "text-[var(--color-muted)] hover:text-[var(--color-ink)]",
                                ].join(" ")}
                            >
                                <span className="font-[family-name:var(--font-dm-mono)] text-[9px] text-[var(--color-accent)] shrink-0 mt-0.5 w-4">
                                    {p.seriesIndex}
                                </span>
                                <span className={isCurrent ? "font-[family-name:var(--font-fraunces)]" : ""}>
                                    {p.title}
                                </span>
                                {isCurrent && (
                                    <span className="ml-auto shrink-0 w-1 h-1 rounded-full bg-[var(--color-accent)] mt-1.5" />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}