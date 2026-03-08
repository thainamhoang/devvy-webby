"use client";

import Link from "next/link";
import { useEffect, useRef, useMemo } from "react";
import GradientDescent from "@/components/math/GradientDescent";
import KLDivergence from "@/components/math/KLDivergence";
import MonteCarlo from "@/components/math/MonteCarlo";

const ROLES = ["ML Researcher", "Systems Builder", "Math Enjoyer"];

export default function HeroSection() {
    const roleRef = useRef<HTMLSpanElement>(null);

    useEffect(() => {
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;
        let timeout: ReturnType<typeof setTimeout>;

        function tick() {
            const el = roleRef.current;
            if (!el) return;

            const current = ROLES[roleIndex];

            if (!deleting) {
                el.textContent = current.slice(0, charIndex + 1);
                charIndex++;
                if (charIndex === current.length) {
                    deleting = true;
                    timeout = setTimeout(tick, 2200);
                    return;
                }
                timeout = setTimeout(tick, 80);
            } else {
                el.textContent = current.slice(0, charIndex - 1);
                charIndex--;
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % ROLES.length;
                    timeout = setTimeout(tick, 400);
                    return;
                }
                timeout = setTimeout(tick, 45);
            }
        }

        timeout = setTimeout(tick, 600);
        return () => clearTimeout(timeout);
    }, []);

    const MathViz = useMemo(() => {
        const options = [GradientDescent, MonteCarlo, KLDivergence];
        return options[Math.floor(Math.random() * options.length)];
    }, []);

    return (
        <section className="relative min-h-screen flex flex-col justify-center pt-16 overflow-hidden">
            {/* Subtle background grain */}
            <div
                className="pointer-events-none absolute inset-0 opacity-[0.025]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                    backgroundSize: "200px 200px",
                }}
            />

            <div className="max-w-6xl mx-auto px-10 md:px-16 w-full">
                <div className="grid lg:grid-cols-[1fr_420px] gap-12 lg:gap-16 items-start">

                    {/* ── Left: content ── */}
                    <div>
                        {/* Eyebrow */}
                        <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-8 opacity-0 animate-[fadeUp_0.6s_0.1s_ease_forwards]">
                            Lausanne / Ho Chi Minh City
                        </p>

                        {/* Main tagline */}
                        <h1 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-6xl lg:text-7xl leading-[1.05] text-[var(--color-ink)] max-w-4xl opacity-0 animate-[fadeUp_0.7s_0.25s_ease_forwards]">
                            I build machines
                            <br />
                            that{" "}
                            <em className="not-italic text-[var(--color-accent)]">
                                learn.
                            </em>
                        </h1>

                        {/* Typewriter sub-role */}
                        <p className="mt-6 font-[family-name:var(--font-dm-mono)] text-sm text-[var(--color-muted)] opacity-0 animate-[fadeUp_0.7s_0.4s_ease_forwards]">
                            <span ref={roleRef} />
                            <span className="inline-block w-px h-4 bg-[var(--color-accent)] ml-0.5 align-middle animate-[blink_1s_step-end_infinite]" />
                        </p>

                        {/* Bio line */}
                        <p className="mt-8 max-w-xl text-base md:text-lg text-[var(--color-muted)] leading-relaxed opacity-0 animate-[fadeUp_0.7s_0.5s_ease_forwards]">
                        Machine Learning @{" "}
                            <a
                                href="https://www.epfl.ch/schools/ic/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[var(--color-ink)] underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-[var(--color-accent)] transition-colors duration-200"
                            >
                                EPFL
                            </a>
                            , working to make the world understand mathematics a little
                            better — one gradient at a time.
                        </p>

                        {/* CTAs */}
                        <div className="mt-12 flex flex-wrap gap-4 opacity-0 animate-[fadeUp_0.7s_0.65s_ease_forwards]">
                            <Link
                                href="/project"
                                className="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-[var(--color-cream)] font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors duration-300"
                            >
                                View Project
                                <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                            </Link>
                            <Link
                                href="/blog"
                                className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-[var(--color-ink)] font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest hover:border-[var(--color-ink)] transition-colors duration-300"
                            >
                                Blog
                            </Link>
                        </div>
                    </div>

                    {/* ── Right: gradient descent viz ── */}
                    <div className="hidden lg:flex flex-col h-[480px] opacity-0 animate-[fadeUp_0.8s_0.5s_ease_forwards]">
                        <MathViz />
                    </div>

                </div>
            </div>

            <style>{`
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes blink {
                    0%, 100% { opacity: 1; }
                    50%       { opacity: 0; }
                }
            `}</style>
        </section>
    );
}