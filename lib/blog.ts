import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkMath from "remark-math";
import remarkRehype from "remark-rehype";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";

export const BLOG_DIR = path.join(process.cwd(), "content/blog");

export interface PostMeta {
    slug: string;
    title: string;
    date: string;
    description?: string;
    series?: string;
    seriesIndex?: number;
    tags?: string[];
    math?: boolean;
}

export interface Post extends PostMeta {
    content: string;
}

export function getAllPosts(): PostMeta[] {
    const files = fs.readdirSync(BLOG_DIR).filter((f) => f.endsWith(".mdx"));

    const posts = files.map((file) => {
        const slug = file.replace(/\.mdx$/, "");
        const raw = fs.readFileSync(path.join(BLOG_DIR, file), "utf-8");
        const { data } = matter(raw);
        return { slug, ...data } as PostMeta;
    });

    // Series posts sorted by seriesIndex asc; standalone posts by date desc
    const series = posts
        .filter((p) => p.series && p.seriesIndex != null)
        .sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0));

    const standalone = posts
        .filter((p) => !p.series)
        .sort((a, b) => (a.date > b.date ? -1 : 1));

    return [...standalone, ...series];
}

export function getPostBySlug(slug: string): Post | null {
    const filePath = path.join(BLOG_DIR, `${slug}.mdx`);
    if (!fs.existsSync(filePath)) return null;
    const raw = fs.readFileSync(filePath, "utf-8");
    const { data, content } = matter(raw);
    return { slug, content, ...data } as Post;
}

export function getSeriesNeighbors(slug: string): {
    prev: PostMeta | null;
    next: PostMeta | null;
} {
    const post = getPostBySlug(slug);
    if (!post?.series) return { prev: null, next: null };

    const seriesPosts = getAllPosts()
        .filter((p) => p.series === post.series)
        .sort((a, b) => (a.seriesIndex ?? 0) - (b.seriesIndex ?? 0));

    const idx = seriesPosts.findIndex((p) => p.slug === slug);
    return {
        prev: idx > 0 ? seriesPosts[idx - 1] : null,
        next: idx < seriesPosts.length - 1 ? seriesPosts[idx + 1] : null,
    };
}

export async function renderPost(content: string): Promise<string> {
    const result = await remark()
        .use(remarkMath)
        .use(remarkRehype, { allowDangerousHtml: true })
        .use(rehypeRaw)
        .use(rehypeKatex)
        .use(rehypeSlug)      // adds id="..." to h1, h2, h3 etc.
        .use(rehypeStringify)
        .process(content);
    return result.toString();
}

export function formatDate(dateStr: string): string {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}