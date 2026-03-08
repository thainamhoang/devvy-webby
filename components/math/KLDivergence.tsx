"use client";

import { useEffect, useRef, useState } from "react";

// ─── Math helpers ─────────────────────────────────────────────────────────────

function gaussianPDF(x: number, mu: number, sigma: number): number {
    const norm = 1 / (sigma * Math.sqrt(2 * Math.PI));
    return norm * Math.exp(-0.5 * ((x - mu) / sigma) ** 2);
}

// KL(q || p) where q = N(mu, sigma²), p = N(0,1)
// Closed form: 0.5 * (sigma² + mu² - 1 - log sigma²)
function klDivergence(mu: number, logVar: number): number {
    const sigma2 = Math.exp(logVar);
    return 0.5 * (sigma2 + mu * mu - 1 - logVar);
}

// ─── Canvas renderer ──────────────────────────────────────────────────────────

function drawKL(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    mu: number,
    logVar: number
) {
    const sigma = Math.sqrt(Math.exp(logVar));
    const X_MIN = -5;
    const X_MAX = 5;

    // Background
    ctx.clearRect(0, 0, W, H);

    const toCanvasX = (x: number) => ((x - X_MIN) / (X_MAX - X_MIN)) * W;
    const toCanvasY = (y: number, maxY: number) => H - 16 - (y / maxY) * (H - 40);

    const SAMPLES = 300;
    const xs: number[] = Array.from({ length: SAMPLES }, (_, i) =>
        X_MIN + (i / (SAMPLES - 1)) * (X_MAX - X_MIN)
    );

    const pVals = xs.map((x) => gaussianPDF(x, 0, 1));
    const qVals = xs.map((x) => gaussianPDF(x, mu, sigma));
    const maxY = Math.max(...pVals, ...qVals) * 1.15;

    // ── Filled area between curves (KL "gap") ──────────────────────────────
    const kl = klDivergence(mu, logVar);
    const overlapAlpha = Math.min(0.18, 0.18 / (1 + kl * 0.3));

    // p fill (subtle)
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(toCanvasX(xs[0]), toCanvasY(0, maxY));
    xs.forEach((x, i) => ctx.lineTo(toCanvasX(x), toCanvasY(pVals[i], maxY)));
    ctx.lineTo(toCanvasX(xs[SAMPLES - 1]), toCanvasY(0, maxY));
    ctx.closePath();
    ctx.fillStyle = "rgba(176,139,90,0.07)";
    ctx.fill();
    ctx.restore();

    // q fill
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(toCanvasX(xs[0]), toCanvasY(0, maxY));
    xs.forEach((x, i) => ctx.lineTo(toCanvasX(x), toCanvasY(qVals[i], maxY)));
    ctx.lineTo(toCanvasX(xs[SAMPLES - 1]), toCanvasY(0, maxY));
    ctx.closePath();
    ctx.fillStyle = `rgba(176,139,90,${overlapAlpha + 0.06})`;
    ctx.fill();
    ctx.restore();

    // ── Baseline ──────────────────────────────────────────────────────────
    const baseY = toCanvasY(0, maxY);
    ctx.save();
    ctx.strokeStyle = "rgba(28,28,28,0.15)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, baseY);
    ctx.lineTo(W, baseY);
    ctx.stroke();
    ctx.restore();

    // ── Zero axis label ───────────────────────────────────────────────────
    ctx.save();
    ctx.fillStyle = "rgba(28,28,28,0.25)";
    ctx.font = "9px 'DM Mono', monospace";
    ctx.textAlign = "center";
    ctx.fillText("z", W / 2, baseY + 12);
    ctx.restore();

    // ── p(z) curve — dashed, muted ────────────────────────────────────────
    ctx.save();
    ctx.strokeStyle = "rgba(176,139,90,0.35)";
    ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 4]);
    ctx.lineJoin = "round";
    ctx.beginPath();
    xs.forEach((x, i) => {
        const cx = toCanvasX(x);
        const cy = toCanvasY(pVals[i], maxY);
        i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
    });
    ctx.stroke();
    ctx.restore();

    // ── q(z|x) curve — solid accent ───────────────────────────────────────
    ctx.save();
    ctx.strokeStyle = "#b08b5a";
    ctx.lineWidth = 2.5;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    ctx.beginPath();
    xs.forEach((x, i) => {
        const cx = toCanvasX(x);
        const cy = toCanvasY(qVals[i], maxY);
        i === 0 ? ctx.moveTo(cx, cy) : ctx.lineTo(cx, cy);
    });
    ctx.stroke();
    ctx.restore();

    // ── Mean marker (vertical dashed line at mu) ──────────────────────────
    const muX = toCanvasX(mu);
    ctx.save();
    ctx.strokeStyle = "rgba(176,139,90,0.5)";
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 3]);
    ctx.beginPath();
    ctx.moveTo(muX, 0);
    ctx.lineTo(muX, baseY);
    ctx.stroke();
    ctx.restore();

    // ── Labels ────────────────────────────────────────────────────────────
    ctx.save();
    ctx.font = "9px 'DM Mono', monospace";
    ctx.fillStyle = "rgba(176,139,90,0.45)";
    ctx.fillText("p(z) = N(0,1)", toCanvasX(-3.8), toCanvasY(pVals[0] * 0.1, maxY) - 30);

    ctx.fillStyle = "rgba(176,139,90,0.85)";
    // Place q label near peak
    const peakCanvasX = toCanvasX(Math.min(Math.max(mu, X_MIN + 0.5), X_MAX - 1.5));
    const peakCanvasY = toCanvasY(gaussianPDF(mu, mu, sigma), maxY);
    ctx.fillText("q(z|x)", peakCanvasX + 14, peakCanvasY - 10);
    ctx.restore();
}

// ─── Slider component ─────────────────────────────────────────────────────────

function Slider({
    label,
    value,
    min,
    max,
    step,
    onChange,
    displayValue,
}: {
    label: string;
    value: number;
    min: number;
    max: number;
    step: number;
    onChange: (v: number) => void;
    displayValue: string;
}) {
    return (
        <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
                <span className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)]">
                    {label}
                </span>
                <span className="font-[family-name:var(--font-dm-mono)] text-xs text-[var(--color-accent)] tabular-nums">
                    {displayValue}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(parseFloat(e.target.value))}
                className="w-full h-px appearance-none cursor-pointer"
                style={{
                    background: `linear-gradient(to right, var(--color-accent) 0%, var(--color-accent) ${
                        ((value - min) / (max - min)) * 100
                    }%, var(--color-border) ${
                        ((value - min) / (max - min)) * 100
                    }%, var(--color-border) 100%)`,
                    accentColor: "var(--color-accent)",
                }}
            />
        </div>
    );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function KLDivergence() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mu, setMu] = useState(0);
    const [logVar, setLogVar] = useState(0); // log σ²

    const sigma = Math.sqrt(Math.exp(logVar));
    const kl = klDivergence(mu, logVar);
    const klDisplay = kl < 0.001 ? kl.toExponential(2) : kl.toFixed(4);

    // KL status
    const klStatus =
        kl < 0.05
            ? { label: "✓ Close to prior", color: "text-[var(--color-accent)]" }
            : kl < 0.5
            ? { label: "≈ Drifting from prior", color: "text-[var(--color-muted)]" }
            : { label: "⚠ Far from prior", color: "text-red-400" };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawKL(ctx, canvas.width, canvas.height, mu, logVar);
    }, [mu, logVar]);

    // Closed-form formula breakdown
    const sigma2 = Math.exp(logVar);
    const formulaStr = `KL = −½ × (1 + log σ² − μ² − σ²) = −½ × (1 + ${logVar.toFixed(2)} − ${(mu * mu).toFixed(2)} − ${sigma2.toFixed(2)})`;

    return (
        <div className="flex flex-col h-full w-full select-none">

            {/* Sliders */}
            <div className="flex gap-6 mb-3">
                <Slider
                    label="μ (mean)"
                    value={mu}
                    min={-3}
                    max={3}
                    step={0.05}
                    onChange={setMu}
                    displayValue={mu.toFixed(2)}
                />
                <Slider
                    label="log σ² (variance)"
                    value={logVar}
                    min={-2}
                    max={2}
                    step={0.05}
                    onChange={setLogVar}
                    displayValue={`${logVar.toFixed(2)} (σ = ${sigma.toFixed(2)})`}
                />
            </div>

            {/* Canvas */}
            <div className="relative flex-1 border border-[var(--color-border)] overflow-hidden">
                <canvas
                    ref={canvasRef}
                    width={480}
                    height={260}
                    className="w-full h-full"
                />
            </div>

            {/* KL readout */}
            <div className="mt-3 flex items-center justify-between gap-4">
                <div className="border border-[var(--color-border)] px-5 py-3 flex items-center gap-4">
                    <div>
                        <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-0.5">
                            KL Divergence
                        </p>
                        <p className="font-[family-name:var(--font-dm-mono)] text-xl text-[var(--color-ink)] tabular-nums">
                            {klDisplay}
                        </p>
                    </div>
                    <div className={`font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest ${klStatus.color}`}>
                        {klStatus.label}
                    </div>
                </div>

                {/* Legend */}
                <div className="flex flex-col gap-1.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                        <span className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[var(--color-muted)]">p(z) = N(0,1)</span>
                        <span className="inline-block w-5 h-px border-t border-dashed border-[var(--color-accent)]/50" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span className="font-[family-name:var(--font-dm-mono)] text-[10px] text-[var(--color-muted)]">q(z|x)</span>
                        <span className="inline-block w-5 h-0.5 bg-[var(--color-accent)]" />
                    </div>
                </div>
            </div>

            {/* Formula strip */}
            <p className="mt-3 font-[family-name:var(--font-dm-mono)] text-[9px] text-[var(--color-muted)]/50 leading-relaxed">
                {formulaStr}
            </p>

            {/* Reset */}
            <button
                onClick={() => { setMu(0); setLogVar(0); }}
                className="mt-3 self-start font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
            >
                ↺ restart
            </button>

            <style>{`
                input[type=range]::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 12px;
                    height: 12px;
                    border-radius: 50%;
                    background: var(--color-accent);
                    cursor: pointer;
                    border: 2px solid var(--color-cream);
                    box-shadow: 0 0 0 1px var(--color-accent);
                }
                input[type=range]::-moz-range-thumb {
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: var(--color-accent);
                    cursor: pointer;
                    border: 2px solid var(--color-cream);
                }
            `}</style>
        </div>
    );
}