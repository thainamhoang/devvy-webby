"use client";

import Link from "next/link";
import { useState, useEffect } from "react";

const links = [
    { href: "/project", label: "Project" },
    { href: "/blog", label: "Blog" },
    // { href: "/goals", label: "30 Goals" },
    { href: "https://www.behance.net/thainamhoang_", label: "Photography", external: true },
    { href: "/about", label: "About" },
];

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false);
    const [menuOpen, setMenuOpen] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 24);
        window.addEventListener("scroll", onScroll, { passive: true });
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
                scrolled
                    ? "bg-[var(--color-cream)]/90 backdrop-blur-md border-b border-[var(--color-border)]"
                    : "bg-transparent"
            }`}
        >
            <nav className="max-w-6xl mx-auto px-10 md:px-16 h-16 flex items-center justify-between">
                {/* Logo / wordmark */}
                <Link
                    href="/"
                    className="font-[family-name:var(--font-fraunces)] text-lg text-[var(--color-ink)] hover:text-[var(--color-accent)] transition-colors duration-200"
                >
                    tnam.dev
                </Link>

                {/* Desktop nav */}
                <ul className="hidden md:flex items-center gap-8">
                    {links.map(({ href, label, external }) => (
                        <li key={href}>
                            {external ? (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
                                >
                                    {label}
                                </a>
                            ) : (
                                <Link
                                    href={href}
                                    className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>

                {/* Mobile hamburger */}
                <button
                    className="md:hidden flex flex-col gap-1.5 p-1"
                    onClick={() => setMenuOpen((v) => !v)}
                    aria-label="Toggle menu"
                >
                    <span
                        className={`block w-5 h-px bg-[var(--color-ink)] transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}
                    />
                    <span
                        className={`block w-5 h-px bg-[var(--color-ink)] transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}
                    />
                    <span
                        className={`block w-5 h-px bg-[var(--color-ink)] transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}
                    />
                </button>
            </nav>

            {/* Mobile menu */}
            <div
                className={`md:hidden overflow-hidden transition-all duration-300 ${
                    menuOpen ? "max-h-64 border-b border-[var(--color-border)]" : "max-h-0"
                } bg-[var(--color-cream)]`}
            >
                <ul className="px-6 py-4 flex flex-col gap-4">
                    {links.map(({ href, label, external }) => (
                        <li key={href}>
                            {external ? (
                                <a
                                    href={href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => setMenuOpen(false)}
                                    className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                                >
                                    {label}
                                </a>
                            ) : (
                                <Link
                                    href={href}
                                    onClick={() => setMenuOpen(false)}
                                    className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors"
                                >
                                    {label}
                                </Link>
                            )}
                        </li>
                    ))}
                </ul>
            </div>
        </header>
    );
}