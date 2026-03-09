import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPosts, renderPost, formatDate } from "@/lib/blog";
import TableOfContents from "@/components/blog/TableOfContent";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
    const posts = getAllPosts();
    return posts.map((p) => ({ slug: p.slug }));
}

function extractH2s(content: string) {
    return content
        .split("\n")
        .filter((line) => /^##\s/.test(line))
        .map((line) => {
            const text = line.replace(/^##\s+/, "").trim();
            const id = text
                .toLowerCase()
                .replace(/[^a-z0-9\s-]/g, "")
                .trim()
                .replace(/\s+/g, "-");
            return { id, text };
        });
}

export default async function BlogPostPage({ params }: Props) {
    const { slug } = await params;
    const post = getPostBySlug(slug);
    if (!post) notFound();

    const html = await renderPost(post.content);
    const toc = extractH2s(post.content);

    return (
        <div className="max-w-6xl mx-auto px-10 md:px-16 pt-28 pb-24">
            <div className="flex gap-16">

                {/* ── Main content — pure server, no hydration issues ── */}
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
                            {formatDate(post.date)}
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

                {/* ── TOC: isolated client component, won't affect server HTML ── */}
                <TableOfContents toc={toc} />

            </div>
        </div>
    );
}