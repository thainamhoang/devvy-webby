import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Blog — Thai-Nam Hoang",
    description: "Mathematical notes and write-ups on machine learning, optimization, and the mathematics of data.",
};

export default function BlogIndexPage() {
    const posts = getAllPosts();

    // Group posts by series
    const seriesMap = new Map<string, typeof posts>();
    const standalone: typeof posts = [];

    for (const post of posts) {
        if (post.series) {
            if (!seriesMap.has(post.series)) seriesMap.set(post.series, []);
            seriesMap.get(post.series)!.push(post);
        } else {
            standalone.push(post);
        }
    }

    return (
        <main className="min-h-screen pt-32 pb-24">
            <div className="max-w-6xl mx-auto px-10 md:px-16">

                {/* Header */}
                <div className="mb-16 max-w-2xl">
                    <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-4">
                        Writing
                    </p>
                    <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl text-[var(--color-ink)] leading-tight mb-6">
                        Blog
                    </h1>
                    <p className="text-[var(--color-muted)] leading-relaxed">
                        Mathematical notes on optimization, machine learning theory, and the mathematics of data —
                        written as I work through{" "}
                        <span className="text-[var(--color-ink)]">EE-556 at EPFL</span>.
                        Rigorous but readable; proofs included.
                    </p>
                </div>

                {/* Series sections */}
                {Array.from(seriesMap.entries()).map(([seriesName, seriesPosts]) => {
                    const sorted = [...seriesPosts].sort(
                        (a, b) => (b.seriesIndex ?? 0) - (a.seriesIndex ?? 0)
                    );

                    return (
                        <section key={seriesName} className="mb-16">
                            {/* Series label */}
                            <div className="flex items-center gap-4 mb-8">
                                <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-accent)]">
                                    Series
                                </p>
                                <div className="flex-1 h-px bg-[var(--color-border)]" />
                                <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                                    {sorted.length} {sorted.length === 1 ? "post" : "posts"}
                                </p>
                            </div>

                            <h2 className="font-[family-name:var(--font-fraunces)] text-xl text-[var(--color-ink)] mb-6">
                                {seriesName}
                            </h2>

                            <div className="space-y-px">
                                {sorted.map((post) => (
                                    <PostRow key={post.slug} post={post} />
                                ))}
                            </div>
                        </section>
                    );
                })}

                {/* Standalone posts */}
                {standalone.length > 0 && (
                    <section>
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex-1 h-px bg-[var(--color-border)]" />
                        </div>
                        <div className="space-y-px">
                            {standalone.map((post) => (
                                <PostRow key={post.slug} post={post} />
                            ))}
                        </div>
                    </section>
                )}

                {posts.length === 0 && (
                    <p className="font-[family-name:var(--font-dm-mono)] text-sm text-[var(--color-muted)]">
                        No posts yet.
                    </p>
                )}
            </div>
        </main>
    );
}

function PostRow({ post }: { post: ReturnType<typeof getAllPosts>[number] }) {
    return (
        <Link
            href={`/blog/${post.slug}`}
            className="group flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-8 py-5 border-b border-[var(--color-border)] hover:border-[var(--color-ink)] transition-colors duration-200"
        >
            {/* Index / date */}
            <div className="shrink-0 w-28">
                <span className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                    {formatDate(post.date)}
                </span>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <h3 className="font-[family-name:var(--font-fraunces)] text-base text-[var(--color-ink)] group-hover:text-[var(--color-accent)] transition-colors duration-200 leading-snug mb-1">
                    {post.title}
                </h3>
                <p className="text-sm text-[var(--color-muted)] leading-relaxed line-clamp-2">
                    {post.description}
                </p>

                {/* Tags */}
                {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {post.tags.map((tag) => (
                            <span
                                key={tag}
                                className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)] border border-[var(--color-border)] px-2 py-0.5"
                            >
                                {tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>

            {/* Arrow */}
            <span className="hidden sm:block shrink-0 font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)] group-hover:text-[var(--color-ink)] group-hover:translate-x-1 transition-all duration-200 mt-0.5">
                →
            </span>
        </Link>
    );
}