/**
 * Prose.tsx
 *
 * Typography wrapper for rendered MDX content.
 * All styles use the site's CSS variables so they stay in sync
 * with the rest of tnam.dev automatically.
 */
export default function Prose({ children }: { children: React.ReactNode }) {
    return (
        <div className="prose-custom">
            {children}
            <style>{`
                /* ── Base ─────────────────────────────────────── */
                .prose-custom {
                    color: var(--color-ink);
                    font-size: 1rem;
                    line-height: 1.85;
                    max-width: 72ch;
                }

                /* ── Headings ─────────────────────────────────── */
                .prose-custom h1,
                .prose-custom h2,
                .prose-custom h3,
                .prose-custom h4 {
                    font-family: var(--font-fraunces), serif;
                    color: var(--color-ink);
                    line-height: 1.2;
                    margin-top: 2.5em;
                    margin-bottom: 0.75em;
                    letter-spacing: -0.01em;
                }
                .prose-custom h1 { font-size: 2rem; }
                .prose-custom h2 {
                    font-size: 1.35rem;
                    padding-bottom: 0.4em;
                    border-bottom: 1px solid var(--color-border);
                }
                .prose-custom h3 { font-size: 1.1rem; }
                .prose-custom h4 { font-size: 1rem; font-style: italic; }

                /* ── Paragraph and lists ──────────────────────── */
                .prose-custom p {
                    margin-top: 0;
                    margin-bottom: 1.4em;
                }
                .prose-custom ul,
                .prose-custom ol {
                    padding-left: 1.5em;
                    margin-bottom: 1.4em;
                }
                .prose-custom li {
                    margin-bottom: 0.4em;
                }
                .prose-custom li > p { margin-bottom: 0.4em; }

                /* ── Horizontal rule ──────────────────────────── */
                .prose-custom hr {
                    border: none;
                    border-top: 1px solid var(--color-border);
                    margin: 3em 0;
                }

                /* ── Blockquote ───────────────────────────────── */
                .prose-custom blockquote {
                    margin: 2em 0;
                    padding: 1em 1.5em;
                    border-left: 2px solid var(--color-accent);
                    background: color-mix(in srgb, var(--color-accent) 5%, transparent);
                    font-style: italic;
                    color: var(--color-muted);
                }
                .prose-custom blockquote p { margin-bottom: 0; }

                /* ── Inline code ──────────────────────────────── */
                .prose-custom :not(pre) > code {
                    font-family: var(--font-dm-mono), monospace;
                    font-size: 0.85em;
                    background: color-mix(in srgb, var(--color-ink) 7%, transparent);
                    border: 1px solid var(--color-border);
                    border-radius: 3px;
                    padding: 0.15em 0.4em;
                    color: var(--color-ink);
                }

                /* ── Code blocks ──────────────────────────────── */
                .prose-custom pre {
                    font-family: var(--font-dm-mono), monospace;
                    font-size: 0.82rem;
                    background: color-mix(in srgb, var(--color-ink) 5%, var(--color-cream));
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                    padding: 1.25em 1.5em;
                    overflow-x: auto;
                    margin: 1.75em 0;
                    line-height: 1.7;
                    color: var(--color-ink);
                }
                .prose-custom pre code {
                    background: none;
                    border: none;
                    padding: 0;
                    font-size: inherit;
                }

                /* ── Tables ───────────────────────────────────── */
                .prose-custom table {
                    width: 100%;
                    border-collapse: collapse;
                    font-family: var(--font-dm-mono), monospace;
                    font-size: 0.82rem;
                    margin: 2em 0;
                }
                .prose-custom th {
                    text-align: left;
                    font-weight: 600;
                    padding: 0.6em 1em;
                    border-bottom: 2px solid var(--color-border);
                    color: var(--color-ink);
                    text-transform: uppercase;
                    letter-spacing: 0.08em;
                    font-size: 0.75rem;
                }
                .prose-custom td {
                    padding: 0.55em 1em;
                    border-bottom: 1px solid var(--color-border);
                    color: var(--color-muted);
                    vertical-align: top;
                }
                .prose-custom tr:last-child td { border-bottom: none; }
                .prose-custom tr:hover td {
                    background: color-mix(in srgb, var(--color-accent) 4%, transparent);
                }

                /* ── Links ────────────────────────────────────── */
                .prose-custom a {
                    color: var(--color-ink);
                    text-decoration: underline;
                    text-decoration-color: var(--color-border);
                    text-underline-offset: 3px;
                    transition: text-decoration-color 0.2s;
                }
                .prose-custom a:hover {
                    text-decoration-color: var(--color-accent);
                }

                /* ── Strong / em ──────────────────────────────── */
                .prose-custom strong {
                    font-weight: 600;
                    color: var(--color-ink);
                }
                .prose-custom em { font-style: italic; }

                /* ── KaTeX math ───────────────────────────────── */
                .prose-custom .math-display {
                    overflow-x: auto;
                    margin: 2em 0;
                    padding: 1.25em 1.5em;
                    background: color-mix(in srgb, var(--color-ink) 3%, var(--color-cream));
                    border: 1px solid var(--color-border);
                    border-radius: 4px;
                }
                .prose-custom .katex-display {
                    overflow-x: auto;
                    margin: 2em 0;
                }
                .prose-custom .katex {
                    font-size: 1.05em;
                }

                /* ── Footnotes ────────────────────────────────── */
                .prose-custom .footnotes {
                    margin-top: 3em;
                    padding-top: 1.5em;
                    border-top: 1px solid var(--color-border);
                    font-size: 0.85rem;
                    color: var(--color-muted);
                }
            `}</style>
        </div>
    );
}