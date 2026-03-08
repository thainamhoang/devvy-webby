import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeKatex from "rehype-katex";
import rehypeStringify from "rehype-stringify";
import rehypeRaw from "rehype-raw";

const BLOG_DIR = path.join(process.cwd(), "content/blog");

export async function renderPost(content: string): Promise<string> {
    const result = await remark()
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeKatex)
        .use(rehypeStringify)
        .process(content);

    return result.toString();
}

export type PostMeta = {
    slug: string;
    title: string;
    date: string;
    description: string;
    series?: string;
    seriesIndex?: number;
    tags?: string[];
};

export type Post = PostMeta & {
    content: string;
};

/** Read all posts sorted by date descending */
export function getAllPosts(): PostMeta[] {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

    return files
        .map((filename) => {
            const slug = filename.replace(/\.mdx$/, "");
            const raw = fs.readFileSync(path.join(BLOG_DIR, filename), "utf-8");
            const { data } = matter(raw);

            return {
                slug,
                title: data.title ?? slug,
                date: data.date ?? "",
                description: data.description ?? "",
                series: data.series,
                seriesIndex: data.seriesIndex,
                tags: data.tags ?? [],
            } satisfies PostMeta;
        })
        .sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Read a single post by slug */
export function getPostBySlug(slug: string): Post | null {
    const filepath = path.join(BLOG_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filepath)) return null;

    const raw = fs.readFileSync(filepath, "utf-8");
    const { data, content } = matter(raw);

    return {
        slug,
        title: data.title ?? slug,
        date: data.date ?? "",
        description: data.description ?? "",
        series: data.series,
        seriesIndex: data.seriesIndex,
        tags: data.tags ?? [],
        content,
    };
}

/** Get prev/next posts in the same series */
export function getSeriesNeighbors(
    slug: string
): { prev: PostMeta | null; next: PostMeta | null } {
    const all = getAllPosts();
    const post = all.find((p) => p.slug === slug);

    if (!post?.series || post.seriesIndex == null) {
        return { prev: null, next: null };
    }

    const seriesPosts = all
        .filter((p) => p.series === post.series && p.seriesIndex != null)
        .sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0));

    const idx = seriesPosts.findIndex((p) => p.slug === slug);

    return {
        prev: idx > 0 ? seriesPosts[idx - 1] : null,
        next: idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : null,
    };
}

/** Format a date string to "March 2025" */
export function formatDate(dateStr: string): string {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}