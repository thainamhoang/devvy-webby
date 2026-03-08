"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";

const timeline = [
    {
        year: "2019",
        place: "Beloit, WI, USA",
        label: "Landed in cornfields",
        body: "Left Ho Chi Minh City on a full scholarship to Beloit College, Wisconsin. Population: 36,000. Corn: plentiful. Culture shock: immense.",
    },
    {
        year: "2020–21",
        place: "Ho Chi Minh City, Vietnam",
        label: "Built fintech during a pandemic",
        body: "While the world panic-bought toilet paper, I was writing fullstack code for MoMo — Vietnam's largest fintech app — scaling campaigns to 21 million users between Zoom lectures.",
    },
    {
        year: "2022",
        place: "Madison, WI, USA",
        label: "Satellites & wildfires",
        body: "Research internship at UW-Madison building deep generative models on GOES-16/17 satellite imagery for early wildfire detection. Presented at AAAI with NASA and NOAA. Still surreal.",
    },
    {
        year: "2022",
        place: "Beloit, WI, USA",
        label: "Out in three",
        body: "Finished a double major in CS and Math in three years. Partly ambition, partly Wisconsin winters leaving very few alternatives.",
    },
    {
        year: "2023",
        place: "Remote / Ho Chi Minh City, Vietnam",
        label: "Blockchain & LLMs",
        body: "Joined The Data Nerd as Lead Engineer. Built real-time blockchain analytics pipelines, LLM-powered interfaces, and helped the team raise $500K in angel investment. Still not sure how.",
    },
    {
        year: "2023–now",
        place: "Lausanne, VD, Switzerland",
        label: "The Alps are not normal",
        body: "Master's in Data Science at EPFL. Satellite trajectory prediction, reinforcement learning, and pretending it's completely normal to see the Alps on the way to class.",
    },
];

const skills = [
    "PyTorch", "LLMs", "Computer Vision", "RL",
    "FastAPI", "React", "TypeScript", "Satellite Imagery",
    "RAG", "Docker", "HPC / Slurm", "AWS",
];

function useIntersection(ref: React.RefObject<Element | null>, threshold = 0.15) {
    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    (entry.target as HTMLElement).style.opacity = "1";
                    (entry.target as HTMLElement).style.transform = "translateY(0)";
                    obs.unobserve(entry.target);
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [ref, threshold]);
}

function FadeUp({
    children,
    delay = 0,
    className = "",
}: {
    children: React.ReactNode;
    delay?: number;
    className?: string;
}) {
    const ref = useRef<HTMLDivElement>(null);
    useIntersection(ref);
    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: 0,
                transform: "translateY(24px)",
                transition: `opacity 0.7s ${delay}s ease, transform 0.7s ${delay}s ease`,
            }}
        >
            {children}
        </div>
    );
}

export default function AboutPage() {
    return (
        <main className="bg-[var(--color-cream)] text-[var(--color-ink)] pt-24 pb-24">

            {/* HERO */}
            <section className="max-w-6xl mx-auto px-10 md:px-16 mb-32">
                <FadeUp delay={0.1}>
                    <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-6">
                        About
                    </p>
                </FadeUp>

                <FadeUp delay={0.2}>
                    <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl leading-[1.05] max-w-3xl mb-10">
                        Hi, I&apos;m Thai&#8209;Nam.
                    </h1>
                </FadeUp>

                <FadeUp delay={0.35}>
                    <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-[var(--color-muted)] mb-6">
                        I grew up in Ho Chi Minh City, which means I learned to navigate
                        chaotic traffic before I learned calculus. Both turned out to be
                        useful.
                    </p>
                </FadeUp>

                <FadeUp delay={0.45}>
                    <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-[var(--color-muted)] mb-6">
                        At 18, I left Vietnam on a scholarship to Beloit College in
                        Wisconsin — a small liberal arts school in the middle of
                        cornfields, approximately as far from home as physically possible.
                        While the rest of the world was on lockdown, I was writing full-stack
                        code for MoMo, Vietnam&apos;s largest fintech app, helping scale
                        campaigns to 21 million users between classes. I finished a double
                        major in three years. Wisconsin winters helped with focus.
                    </p>
                </FadeUp>

                <FadeUp delay={0.55}>
                    <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-[var(--color-muted)] mb-6">
                        After graduation I went back to Ho Chi Minh City and joined The
                        Data Nerd, where I led a team building real-time blockchain
                        analytics pipelines and LLM-powered interfaces. Somewhere in there
                        a startup raised half a million dollars, which still surprises me
                        more than anyone.
                    </p>
                </FadeUp>

                <FadeUp delay={0.65}>
                    <p className="text-lg md:text-xl leading-relaxed max-w-2xl text-[var(--color-muted)] mb-10">
                        Then I thought: <em>why stop now?</em> So I moved to Lausanne for
                        a Master&apos;s in Data Science at EPFL, where I spend my days training
                        models on satellite imagery, reading papers about reinforcement
                        learning, and pretending the Alps are a normal thing to see on the
                        way to class.
                    </p>
                </FadeUp>

                <FadeUp delay={0.75}>
                    <div className="inline-block border border-[var(--color-accent)] px-6 py-4 max-w-xl">
                        <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest text-[var(--color-accent)] mb-2">
                            Currently
                        </p>
                        <p className="text-base leading-relaxed text-[var(--color-ink)]">
                            Wrapping up my Master&apos;s and looking for what comes next —
                            ideally somewhere at the intersection of research and building
                            real things.{" "}
                            <Link
                                href="mailto:namhoangthai2607@gmail.com"
                                className="underline underline-offset-4 decoration-[var(--color-border)] hover:decoration-[var(--color-accent)] transition-colors"
                            >
                                If that sounds like your team, I&apos;d love to talk.
                            </Link>
                        </p>
                    </div>
                </FadeUp>
            </section>

            {/* DIVIDER */}
            <div className="max-w-6xl mx-auto px-10 md:px-16 mb-24">
                <div className="w-full h-px bg-[var(--color-border)]" />
            </div>

            {/* TIMELINE */}
            <section className="max-w-6xl mx-auto px-10 md:px-16 mb-32">
                <FadeUp>
                    <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-12">
                        The story, in order
                    </p>
                </FadeUp>

                <div className="relative">
                    <div className="absolute left-[5.5rem] top-0 bottom-0 w-px bg-[var(--color-border)] hidden md:block" />

                    <ol className="flex flex-col gap-12">
                        {timeline.map((item, i) => (
                            <FadeUp key={i} delay={i * 0.08}>
                                <li className="md:grid md:grid-cols-[6rem_2rem_1fr] md:gap-x-6 gap-y-1">
                                    <div className="text-right hidden md:block">
                                        <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)] leading-6">
                                            {item.year}
                                        </span>
                                    </div>
                                    <div className="relative hidden md:flex items-start justify-center pt-1.5">
                                        <div className="w-2 h-2 rounded-full bg-[var(--color-accent)] z-10" />
                                    </div>
                                    <div>
                                        <div className="flex items-baseline gap-3 mb-1 md:hidden">
                                            <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)]">
                                                {item.year}
                                            </span>
                                            <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-accent)]">
                                                {item.place}
                                            </span>
                                        </div>
                                        <p className="font-[family-name:var(--font-fraunces)] text-lg mb-1">
                                            {item.label}
                                        </p>
                                        <p className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-accent)] mb-2 hidden md:block">
                                            {item.place}
                                        </p>
                                        <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-xl">
                                            {item.body}
                                        </p>
                                    </div>
                                </li>
                            </FadeUp>
                        ))}
                    </ol>
                </div>
            </section>

            {/* DIVIDER */}
            <div className="max-w-6xl mx-auto px-10 md:px-16 mb-24">
                <div className="w-full h-px bg-[var(--color-border)]" />
            </div>

            {/* SKILLS */}
            <section className="max-w-6xl mx-auto px-10 md:px-16 mb-32">
                <FadeUp>
                    <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-muted)] mb-8">
                        Things I work with
                    </p>
                </FadeUp>
                <FadeUp delay={0.1}>
                    <div className="flex flex-wrap gap-3">
                        {skills.map((s) => (
                            <span
                                key={s}
                                className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest px-4 py-2 border border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)] transition-colors duration-200 cursor-default"
                            >
                                {s}
                            </span>
                        ))}
                    </div>
                </FadeUp>
            </section>

            {/* DIVIDER */}
            <div className="max-w-6xl mx-auto px-10 md:px-16 mb-24">
                <div className="w-full h-px bg-[var(--color-border)]" />
            </div>

            {/* CTA */}
            <section className="max-w-6xl mx-auto px-10 md:px-16">
                <FadeUp>
                    <h2 className="font-[family-name:var(--font-fraunces)] text-4xl md:text-5xl mb-6 max-w-xl leading-tight">
                        Let&apos;s build something worth remembering.
                    </h2>
                </FadeUp>
                <FadeUp delay={0.15}>
                    <p className="text-base text-[var(--color-muted)] max-w-md mb-10 leading-relaxed">
                        Open to full-time roles in ML research, applied AI, or anything at
                        the edge of math and product. Based in Lausanne, open to
                        relocation.
                    </p>
                </FadeUp>
                <FadeUp delay={0.25}>
                    <div className="flex flex-wrap gap-4">
                        <a
                            href="mailto:namhoangthai2607@gmail.com"
                            className="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-[var(--color-cream)] font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors duration-300"
                        >
                            Say hello
                            <span className="transition-transform duration-300 group-hover:translate-x-1">
                                →
                            </span>
                        </a>
                        <a
                            href="https://linkedin.com/in/thainamhoang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-[var(--color-ink)] font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest hover:border-[var(--color-ink)] transition-colors duration-300"
                        >
                            LinkedIn
                        </a>
                        <a
                            href="https://github.com/thainamhoang"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-2 px-6 py-3 border border-[var(--color-border)] text-[var(--color-ink)] font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest hover:border-[var(--color-ink)] transition-colors duration-300"
                        >
                            GitHub
                        </a>
                    </div>
                </FadeUp>
            </section>
        </main>
    );
}