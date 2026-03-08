"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Lightbox, { type LightboxImage } from "@/components/ui/project/Lightbox";

// ─── Types ───────────────────────────────────────────────────────────────────

interface Project {
    slug: string;
    title: string;
    tagline: string;
    year: string;
    tags: string[];
    context: string;
    description: string;
    images?: LightboxImage[];
    metrics?: string[];
}

// ─── Data ────────────────────────────────────────────────────────────────────

const projects: Project[] = [
    {
        slug: "epfl-chat-tutor",
        title: "EPFL Chat Tutor",
        tagline: "Lightweight LLM-based tutoring system for STEM education",
        year: "2025",
        tags: ["LLMs", "DPO", "RAG", "Quantization", "EPFL"],
        context: "CS-552 Modern NLP · EPFL",
        description:
            "Built a lightweight LLM-based tutoring system for STEM education at EPFL. Fine-tuned Qwen3-0.6B-Base using Direct Preference Optimization (DPO) for open-ended questions and Supervised Fine-Tuning (SFT) for multiple-choice tasks. Integrated a RAG module with a 47.3k-document STEM corpus (FAISS + all-MiniLM-L6-v2) to reduce hallucinations. Applied post-training quantization (GPTQ W8A8 + SmoothQuant) to enable deployment on student devices with minimal accuracy loss. Our DPO model achieved 0.631 accuracy — on par with Vicuna-13B and outperforming Qwen3-4B despite being 20× smaller.",
        metrics: [
            "0.631 preference pair accuracy",
            "47.3k STEM document corpus",
            "GPTQ W8A8 — 0.50GB quantized model",
            "Outperforms Vicuna-13B on alignment",
        ],
        images: [
            // {
            //     src: "https://i.ibb.co/Q7Hk9SXZ/figure-final.jpg",
            //     caption: "End-to-end system pipeline from raw STEM data through SFT/DPO fine-tuning, RAG retrieval module (FAISS + all-MiniLM-L6-v2), and post-training quantization for on-device deployment.",
            // },
            {
                src: "https://i.ibb.co/S7v0zw8K/mtbench.png",
                caption: "MT-Bench radar chart comparing our DPO model against GPT-4, Claude v1, GPT-3.5-turbo, Vicuna-7B/13B, and Llama-2 across 8 categories including STEM, Reasoning, Math, and Coding.",
            },
            {
                src: "https://i.ibb.co/XfWNxHsn/plot-rag.png",
                caption: "RAG model accuracy on MMLU and SFT-Data test sets (k=0 and k=10). Q3-F15 trained on the full dataset with retrieval consistently achieves the highest accuracy across both benchmarks.",
            },
            {
                src: "https://i.ibb.co/Dfq7nzh1/sft-ablation.png",
                caption: "SFT model performance across Demo, Evals, and Test datasets for Q3-B, Q3-Sub, Q3-FullChat, and Q3-Full. Q3-Full with prompting achieves the highest Test accuracy at 0.641.",
            },
            {
                src: "https://i.ibb.co/Z1zzcwpR/dpo-ablation.png",
                caption: "DPO model accuracy by data subset (EPFL preferences vs. STEM data) and loss type. Standard DPO slightly outperforms Robust DPO across both subsets.",
            },
        ],
    },
    {
        slug: "rlhf-classic-control",
        title: "RLHF for Classic Control",
        tagline: "Comparing DPO and PPO-RLHF in CartPole and MountainCar",
        year: "2025",
        tags: ["Reinforcement Learning", "DPO", "PPO", "RLHF", "EPFL"],
        context: "EE-568 Reinforcement Learning · EPFL",
        description:
            "Empirical comparison of Direct Preference Optimization (DPO) and PPO-RLHF on OpenAI Gym environments — CartPole-v1 and MountainCar-v0. Constructed preference datasets from expert and sub-expert policies trained via REINFORCE and PPO; varied dataset sizes (500–1000 pairs) to assess sample efficiency. PPO-RLHF reached perfect scores of 500 in CartPole at 15,000 training steps. DPO approached expert-level returns of 499.29 ± 1.01 at 20 epochs. A custom KL-regularized soft-label DPO variant was developed for stability in MountainCar's sparse reward landscape.",
        metrics: [
            "DPO: 499.29 ± 1.01 return on CartPole",
            "PPO-RLHF: perfect 500 at 15k steps",
            "6 dataset sizes × 3 random seeds",
            "Custom KL-regularized DPO for sparse rewards",
        ],
        images: [
            {
                src: "https://i.ibb.co/JRFTFjLC/boxplot-policies.png",
                caption: "Return distribution by policy aggregated over all preference dataset sizes (K = 500 to 1000)"
            }
        ]
    },
    {
        slug: "adaptive-data-augmentation",
        title: "Adaptive Data Augmentation for Unseen Corruptions",
        tagline: "BlendedTraining beats pretrained ResNet on out-of-distribution corruptions",
        year: "2025",
        tags: ["Computer Vision", "Robustness", "ViT", "ResNet", "EPFL"],
        context: "CS-503 Visual Intelligence · EPFL",
        description:
            "Explored adaptive strategies to improve neural network robustness to unseen corruptions on CIFAR-10 and TinyImageNet-200. Designed and evaluated Healer models (corruption prediction + classical correction via Wiener filter), Corrector models (U-Net / Transformer image restoration), BlendedTraining (auxiliary corruption-awareness heads), and Test-Time Training (TTT). BlendedResNet18 stood out — achieving 0.6722 accuracy at maximum corruption severity versus 0.5403 for pretrained ResNet18, with 93.35% corruption type prediction accuracy. TTT models collapsed near random performance, suggesting the auxiliary task destabilized classification.",
        metrics: [
            "BlendedResNet18: 0.6722 at max corruption",
            "93.35% corruption type prediction accuracy",
            "0.4694 funky OOD vs 0.4460 pretrained baseline",
            "CIFAR-10 + TinyImageNet-200",
        ],
        images: [
            {
                src: "https://i.ibb.co/mVb7MGYP/denoising-methods-comparisonc.png",
                caption: "Comparison of five denoising methods applied to corrupted CIFAR-10 images — Wiener filter, bilateral, NLM, and Gaussian — evaluated as correction strategies in the Healer pipeline.",
            },
            {
                src: "https://i.ibb.co/N226y5Wf/healer-rotation-correctionc.png",
                caption: "Healer correction demo on rotation corruption (severity=0.5): original, corrupted input, and Healer-corrected output on CIFAR-10.",
            },
            {
                src: "https://i.ibb.co/ycVz2qbk/healer-affine-correctionc.png",
                caption: "Healer correction demo on affine corruption (severity=0.5): the Healer model partially recovers spatial structure lost under affine transformation on CIFAR-10.",
            },
        ],
    },
    {
        slug: "european-heatwave-forecasting",
        title: "European Heatwave Forecasting",
        tagline: "Deep learning benchmarks for high-resolution extreme heat prediction from CERRA reanalysis",
        year: "2025",
        tags: ["Climate ML", "UNet", "ViT", "ResNet", "PyTorch", "EPFL"],
        context: "ECEO Semester Project · EPFL",
        description:
            "Introduced a novel high-resolution pan-European heatwave dataset derived from CERRA reanalysis (5.5 km, 2011–2021) and established a rigorous end-to-end forecasting pipeline. Benchmarked UNet, ViT, and ResNet against climatology and persistence baselines within the ClimateLearn framework for 2-meter temperature regression and CTX90 heatwave classification. UNet achieved the best performance across both tasks — RMSE 2.08K, ACC 0.896, F1 0.312 — with daily F1 scores peaking near 0.8 during active heatwave periods despite severe class imbalance. The work highlights the gap between general temperature accuracy and reliable rare-event detection.",
        metrics: [
            "UNet RMSE 2.08K · ACC 0.896",
            "Heatwave F1 peaks ~0.8 during active events",
            "CERRA 5.5km · 2011–2021 · 528×528 grid",
            "UNet > ViT > ResNet > Persistence > Climatology",
        ],
        images: [
            {
                src: "https://i.ibb.co/1tFhb3CV/compare-resize.png",
                caption: "Visual comparison between each resizing methods.",
            },
            {
                src: "https://i.ibb.co/CpfS1FcY/dl-map.png",
                caption: "Predictions generated by deep learning models.",
            },
            {
                src: "https://i.ibb.co/LXT53Fwr/mask-map.png",
                caption: "Masks generated from prediction of deep learning models.",
            },
        ],
    },
    {
        slug: "wildfire-forecasting",
        title: "Wildfire Forecasting with Deep Generative Models",
        tagline: "Conditioning video generative models on GOES-16/17 satellite imagery",
        year: "2022",
        tags: ["Generative Models", "Satellite Imagery", "Video Prediction", "Research"],
        context: "Research Internship · UW-Madison",
        description:
            "Tackled wildfire prediction by framing multi-spectral satellite image sequences as video and applying stochastic deep generative models to anticipate future fire behavior. Developed a novel stochastic temporal model whose dynamics are driven in a latent space — lighter and more interpretable than image-autoregressive recurrent networks. Trained on GOES-16/17 thermal Band 7 imagery. Achieved PSNR 40.43 and SSIM 0.934 on video reconstruction, outperforming prior state-of-the-art benchmarks on the dataset. Presented at the AAAI 2022 Fall Symposium on Climate Change in collaboration with NASA and NOAA.",
        images: [
            {
                src: "https://prismic-io.s3.amazonaws.com/thainamhoang/78d6fa88-1f1e-480b-8810-0ba3ae3172af_band_7_crop.png",
                caption: "GOES 16 Band 7 satellite imagery.",
            },
            {
                src: "https://images.prismic.io/thainamhoang/eb34e603-7a12-49b3-95b7-ea375f8a0475_generated.png",
                caption: "Generated video frames from the model.",
            },
        ],
        metrics: [
            "PSNR 40.43 · SSIM 0.934",
            "GOES-16/17 thermal Band 7 dataset",
            "Presented at AAAI 2022",
            "NASA + NOAA collaboration",
        ],
    },
    {
        slug: "brain-tumor-segmentation",
        title: "Transformer Architecture for Brain Tumor Segmentation",
        tagline: "Applying UNETR and SegResNet to the BraTS 2020 Dataset",
        year: "2021",
        tags: ["Medical Imaging", "Segmentation", "Transformers", "PyTorch"],
        context: "ML Internship · VinBrain",
        description:
            "Applied and fine-tuned transformer-based architectures to 3D brain tumor segmentation using the BraTS 2020 dataset from UPenn. Experimented with UNETR (Vision Transformer for volumetric segmentation) and SegResNet across 3D MRI volumes. Built custom data augmentations and preprocessing pipelines to improve 3D image fidelity and training stability. Achieved Dice scores of 87% (Whole Tumor), 77.3% (Tumor Core), and 76% (Enhancing Tumor), outperforming baseline models. Contributed to internal R&D on deploying AI for radiological diagnostics in clinical settings.",
        metrics: [
            "Dice WT: 87% · TC: 77.3% · ET: 76%",
            "BraTS 2020 — 3D MRI volumes",
            "UNETR + SegResNet architectures",
            "Outperformed baseline models",
        ],
    },
    {
        slug: "cashback-gamification",
        title: "Cashback Gamification — MoMo",
        tagline: "A pet-feeding savings mini-app for 500K daily users",
        year: "2021",
        tags: ["React Native", "Fintech", "Mobile", "Gamification"],
        context: "Software Engineer · MoMo",
        description:
            "Designed and built a cashback gamification mini-app inside MoMo — Vietnam's largest e-wallet with 21M+ users. Players feed a virtual pig using in-app currency earned from transactions; the pig drops coins that can be donated to charity. Built fully on React Native with a Vert.x backend handling high-concurrency transactions and Firebase for real-time push notifications. Horizontally scaled to 500K+ daily active users with sub-200ms response times. The feature drove a 60% increase in DAU during Lunar New Year campaigns.",
        images: [
            {
                src: "https://prismic-io.s3.amazonaws.com/thainamhoang/eaa7fcf1-2c62-4824-a510-1e7909e7ca36_momo-upload-api-210209114828-637484681087127827.jpeg",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.",
            },
            {
                src: "https://images.prismic.io/thainamhoang/7816733a-59c7-43f2-aa85-7f2688e66904_IMG_7841.PNG",
                caption: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud.",
            },
        ],
        metrics: [
            "500K+ daily active users",
            "<200ms response time at scale",
            "60% DAU increase · Lunar New Year",
            "React Native + Vert.x + Firebase",
        ],
    },
];

// ─── Scroll animation ────────────────────────────────────────────────────────

function useIntersection(ref: React.RefObject<Element | null>, threshold = 0.1) {
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
                transform: "translateY(20px)",
                transition: `opacity 0.65s ${delay}s ease, transform 0.65s ${delay}s ease`,
            }}
        >
            {children}
        </div>
    );
}

// ─── Project Card ────────────────────────────────────────────────────────────

function ProjectCard({ project, index }: { project: Project; index: number }) {
    const [lightbox, setLightbox] = useState<{ images: LightboxImage[]; index: number } | null>(null);

    return (
        <>
            <FadeUp delay={0.05}>
                <article className="group border-b border-[var(--color-border)] py-12 grid md:grid-cols-[1fr_2fr] gap-8 md:gap-16">
                    {/* Left col — meta */}
                    <div className="flex flex-col gap-3">
                        <div className="flex items-center gap-3">
                            <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-accent)] uppercase tracking-widest">
                                {project.year}
                            </span>
                            <span className="w-4 h-px bg-[var(--color-border)]" />
                            <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)] uppercase tracking-widest">
                                {String(index + 1).padStart(2, "0")}
                            </span>
                        </div>

                        <p className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)] leading-relaxed">
                            {project.context}
                        </p>

                        <div className="flex flex-wrap gap-2 mt-1">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-wider px-2 py-1 border border-[var(--color-border)] text-[var(--color-muted)]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>

                        {project.metrics && (
                            <ul className="mt-4 flex flex-col gap-2">
                                {project.metrics.map((m) => (
                                    <li key={m} className="flex items-start gap-2">
                                        <span className="text-[var(--color-accent)] text-xs mt-0.5">—</span>
                                        <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-muted)] leading-relaxed">
                                            {m}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>

                    {/* Right col — content */}
                    <div>
                        <h2 className="font-[family-name:var(--font-fraunces)] text-2xl md:text-3xl leading-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors duration-300">
                            {project.title}
                        </h2>
                        <p className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-accent)] uppercase tracking-widest mb-5">
                            {project.tagline}
                        </p>
                        <p className="text-base text-[var(--color-muted)] leading-relaxed max-w-2xl">
                            {project.description}
                        </p>

                        {project.images && project.images.length > 0 && (
                            <div className="flex gap-3 mt-6 flex-wrap">
                                {project.images.map((img, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setLightbox({ images: project.images!, index: i })}
                                        className="group/img relative w-36 h-24 bg-[var(--color-border)] overflow-hidden border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
                                        aria-label={`View: ${img.caption}`}
                                    >
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img
                                            src={img.src}
                                            alt={img.caption}
                                            className="w-full h-full object-cover transition-transform duration-300 group-hover/img:scale-105"
                                            loading="lazy"
                                        />
                                        <div className="absolute inset-0 bg-[var(--color-ink)]/0 group-hover/img:bg-[var(--color-ink)]/30 transition-colors duration-200 flex items-center justify-center">
                                            <span className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-cream)] opacity-0 group-hover/img:opacity-100 transition-opacity duration-200">
                                                View
                                            </span>
                                        </div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </article>
            </FadeUp>

            {lightbox && (
                <Lightbox
                    images={lightbox.images}
                    initialIndex={lightbox.index}
                    onClose={() => setLightbox(null)}
                />
            )}
        </>
    );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ProjectsPage() {
    return (
        <main className="bg-[var(--color-cream)] text-[var(--color-ink)] pt-24 pb-24">
            <section className="max-w-6xl mx-auto px-10 md:px-16 mb-16">
                <FadeUp delay={0.1}>
                    <p className="font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-[0.2em] text-[var(--color-accent)] mb-6">
                        Projects
                    </p>
                </FadeUp>
                <FadeUp delay={0.2}>
                    <h1 className="font-[family-name:var(--font-fraunces)] text-5xl md:text-7xl leading-[1.05] max-w-3xl mb-6">
                        Things I&apos;ve built{" "}
                        <em className="not-italic text-[var(--color-accent)]">&amp; broken.</em>
                    </h1>
                </FadeUp>
                <FadeUp delay={0.35}>
                    <p className="text-lg text-[var(--color-muted)] max-w-xl leading-relaxed">
                        From satellite imagery to pet-feeding fintech games — a reverse-chronological record of what kept me up at night.
                    </p>
                </FadeUp>
            </section>

            <div className="max-w-6xl mx-auto px-10 md:px-16 mb-4">
                <div className="w-full h-px bg-[var(--color-border)]" />
            </div>

            <section className="max-w-6xl mx-auto px-10 md:px-16">
                {projects.map((project, i) => (
                    <ProjectCard key={project.slug} project={project} index={i} />
                ))}
            </section>

            <section className="max-w-6xl mx-auto px-10 md:px-16 mt-20">
                <FadeUp>
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-t border-[var(--color-border)] pt-12">
                        <p className="font-[family-name:var(--font-fraunces)] text-2xl leading-snug">
                            Wanna see the math behind the projects?
                        </p>
                        <Link
                            href="/blog"
                            className="group inline-flex items-center gap-2 px-6 py-3 bg-[var(--color-ink)] text-[var(--color-cream)] font-[family-name:var(--font-dm-mono)] text-xs uppercase tracking-widest hover:bg-[var(--color-accent)] transition-colors duration-300 w-fit"
                        >
                            View Blog
                            <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                        </Link>
                    </div>
                </FadeUp>
            </section>
        </main>
    );
}