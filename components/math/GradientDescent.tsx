"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Landscape definitions ────────────────────────────────────────────────────

type Landscape = {
    key: string;
    label: string;
    formula: string;
    description: string;
    f: (x: number, y: number) => number;
    df: (x: number, y: number) => [number, number];
    range: number;
};

const landscapes: Landscape[] = [
    {
        key: "convex",
        label: "Convex Bowl",
        formula: "f(x,y) = x² + 0.5y²",
        description: "A perfect bowl. Gradient descent always converges to the global minimum at (0,0).",
        f: (x, y) => x * x + 0.5 * y * y,
        df: (x, y) => [2 * x, y],
        range: 3,
    },
    {
        key: "saddle",
        label: "Saddle Point",
        formula: "f(x,y) = x² − y²",
        description: "Curvature is positive in x, negative in y. (0,0) is a critical point but not a minimum.",
        f: (x, y) => x * x - y * y,
        df: (x, y) => [2 * x, -2 * y],
        range: 3,
    },
    {
        key: "multimodal",
        label: "Multimodal",
        formula: "f(x,y) = −cos(2x)cos(2y) + 0.2(x²+y²)",
        description: "Multiple local minima. Initialization determines which basin of attraction you fall into.",
        f: (x, y) => -Math.cos(2 * x) * Math.cos(2 * y) + 0.2 * (x * x + y * y),
        df: (x, y) => [
            2 * Math.sin(2 * x) * Math.cos(2 * y) + 0.4 * x,
            2 * Math.cos(2 * x) * Math.sin(2 * y) + 0.4 * y,
        ],
        range: 3.5,
    },
];

// ─── Canvas renderer ──────────────────────────────────────────────────────────

function drawLandscape(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    land: Landscape,
    trail: [number, number][],
    pos: [number, number]
) {
    const R = land.range;

    // Map math coords → canvas pixels
    const toCanvas = (x: number, y: number): [number, number] => [
        ((x + R) / (2 * R)) * W,
        ((R - y) / (2 * R)) * H,
    ];

    // Heatmap — sample loss on a grid
    const STEP = 4;
    for (let px = 0; px < W; px += STEP) {
        for (let py = 0; py < H; py += STEP) {
            const mx = (px / W) * 2 * R - R;
            const my = R - (py / H) * 2 * R;
            const v = land.f(mx, my);

            // Normalize v to [0,1] per landscape
            let t: number;
            if (land.key === "convex") t = Math.min(v / 10, 1);
            else if (land.key === "saddle") t = Math.min(Math.abs(v) / 9, 1);
            else t = Math.min((v + 1) / 3, 1);

            // Cream palette: low = cream, high = warm ink
            // accent (#b08b5a) as midpoint
            const r = Math.round(250 - t * (250 - 28));
            const g = Math.round(248 - t * (248 - 28));
            const b = Math.round(244 - t * (244 - 28));
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(px, py, STEP, STEP);
        }
    }

    // Contour lines
    const levels = land.key === "convex"
        ? [0.2, 0.5, 1, 2, 4, 7]
        : land.key === "saddle"
        ? [-6, -3, -1, 0, 1, 3, 6]
        : [-0.9, -0.6, -0.3, 0, 0.5, 1.2, 2];

    const GRID = 120;
    const grid: number[][] = [];
    for (let i = 0; i <= GRID; i++) {
        grid[i] = [];
        for (let j = 0; j <= GRID; j++) {
            const mx = (i / GRID) * 2 * R - R;
            const my = R - (j / GRID) * 2 * R;
            grid[i][j] = land.f(mx, my);
        }
    }

    ctx.save();
    for (const level of levels) {
        ctx.beginPath();
        ctx.strokeStyle = "rgba(176,139,90,0.18)";
        ctx.lineWidth = 0.8;

        for (let i = 0; i < GRID; i++) {
            for (let j = 0; j < GRID; j++) {
                const a = grid[i][j], b2 = grid[i + 1][j];
                const c = grid[i][j + 1], d = grid[i + 1][j + 1];
                const crossings: [number, number][] = [];

                const lerp = (v0: number, v1: number, t0: number, t1: number) =>
                    (level - v0) / (v1 - v0);

                if ((a < level) !== (b2 < level)) {
                    const t = lerp(a, b2, 0, 0);
                    crossings.push([
                        ((i + t) / GRID) * W,
                        (j / GRID) * H,
                    ]);
                }
                if ((a < level) !== (c < level)) {
                    const t = lerp(a, c, 0, 0);
                    crossings.push([
                        (i / GRID) * W,
                        ((j + t) / GRID) * H,
                    ]);
                }
                if (crossings.length === 2) {
                    ctx.moveTo(crossings[0][0], crossings[0][1]);
                    ctx.lineTo(crossings[1][0], crossings[1][1]);
                }
            }
        }
        ctx.stroke();
    }
    ctx.restore();

    // Axes
    const [cx, cy] = toCanvas(0, 0);
    ctx.save();
    ctx.strokeStyle = "rgba(28,28,28,0.12)";
    ctx.lineWidth = 1;
    ctx.setLineDash([3, 4]);
    ctx.beginPath();
    ctx.moveTo(cx, 0);
    ctx.lineTo(cx, H);
    ctx.moveTo(0, cy);
    ctx.lineTo(W, cy);
    ctx.stroke();
    ctx.restore();

    // Trail
    if (trail.length > 1) {
        ctx.save();
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        for (let i = 1; i < trail.length; i++) {
            const alpha = 0.25 + (i / trail.length) * 0.75;
            const [x0, y0] = toCanvas(trail[i - 1][0], trail[i - 1][1]);
            const [x1, y1] = toCanvas(trail[i][0], trail[i][1]);
            ctx.beginPath();
            ctx.lineWidth = 2.5;
            ctx.strokeStyle = `rgba(176,139,90,${alpha})`;
            ctx.moveTo(x0, y0);
            ctx.lineTo(x1, y1);
            ctx.stroke();
        }
        ctx.restore();
    }

    // Current position dot
    const [dx, dy] = toCanvas(pos[0], pos[1]);
    ctx.save();
    // glow
    const grad = ctx.createRadialGradient(dx, dy, 0, dx, dy, 18);
    grad.addColorStop(0, "rgba(176,139,90,0.5)");
    grad.addColorStop(1, "rgba(176,139,90,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(dx, dy, 18, 0, Math.PI * 2);
    ctx.fill();
    // dot
    ctx.fillStyle = "#b08b5a";
    ctx.beginPath();
    ctx.arc(dx, dy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#faf8f4";
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function GradientDescent() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [activeLand, setActiveLand] = useState(0);
    const [pos, setPos] = useState<[number, number]>([2.2, 2.2]);
    const [trail, setTrail] = useState<[number, number][]>([[2.2, 2.2]]);
    const [loss, setLoss] = useState<number>(0);
    const [running, setRunning] = useState(true);
    const velRef = useRef<[number, number]>([0, 0]);
    const rafRef = useRef<number>(0);
    const stepRef = useRef(0);
    const lastFrameRef = useRef(0);

    const land = landscapes[activeLand];
    const LR = 0.025;
    const FRAME_MS = 50; // ~20fps — step every 50ms
    const MOMENTUM = 0.88;
    const MAX_TRAIL = 180;

    const reset = useCallback((lIdx: number, rx?: number, ry?: number) => {
        const l = landscapes[lIdx];
        const R = l.range * 0.8;
        const nx = rx ?? (Math.random() * 2 - 1) * R;
        const ny = ry ?? (Math.random() * 2 - 1) * R;
        velRef.current = [0, 0];
        stepRef.current = 0;
        setPos([nx, ny]);
        setTrail([[nx, ny]]);
        setLoss(l.f(nx, ny));
    }, []);

    // Switch landscape — reset and resume
    useEffect(() => {
        reset(activeLand);
        setRunning(true);
    }, [activeLand, reset]);

    // Animation loop
    useEffect(() => {
        if (!running) return;

        const step = (timestamp: number) => {
            if (timestamp - lastFrameRef.current < FRAME_MS) {
                rafRef.current = requestAnimationFrame(step);
                return;
            }
            lastFrameRef.current = timestamp;
            setPos((prev) => {
                const [gx, gy] = land.df(prev[0], prev[1]);
                const [vx, vy] = velRef.current;
                const nvx = MOMENTUM * vx - LR * gx;
                const nvy = MOMENTUM * vy - LR * gy;
                velRef.current = [nvx, nvy];

                let nx = prev[0] + nvx;
                let ny = prev[1] + nvy;

                // Clamp to range
                const R = land.range;
                nx = Math.max(-R, Math.min(R, nx));
                ny = Math.max(-R, Math.min(R, ny));

                stepRef.current++;

                // Stop (don't reset) on convergence — let it sit at the minimum
                const speed = Math.sqrt(nvx * nvx + nvy * nvy);
                if (speed < 0.00005) {
                    setRunning(false);
                    return [nx, ny];
                }

                // Hard cap — stop after 600 steps
                if (stepRef.current > 600) {
                    setRunning(false);
                    return [nx, ny];
                }

                setLoss(land.f(nx, ny));
                setTrail((t) => {
                    const next = [...t, [nx, ny] as [number, number]];
                    return next.length > MAX_TRAIL ? next.slice(-MAX_TRAIL) : next;
                });

                return [nx, ny];
            });

            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => cancelAnimationFrame(rafRef.current);
    }, [running, activeLand, land, reset]);

    // Draw
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawLandscape(ctx, canvas.width, canvas.height, land, trail, pos);
    }, [pos, trail, land]);

    // Click to teleport
    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const px = (e.clientX - rect.left) * (canvas.width / rect.width);
        const py = (e.clientY - rect.top) * (canvas.height / rect.height);
        const R = land.range;
        const mx = (px / canvas.width) * 2 * R - R;
        const my = R - (py / canvas.height) * 2 * R;
        reset(activeLand, mx, my);
        setRunning(true);
    };

    const lossDisplay = Math.abs(loss) < 0.001 ? loss.toExponential(2) : loss.toFixed(4);

    return (
        <div className="flex flex-col h-full w-full select-none">

            {/* Canvas */}
            <div className="relative flex-1 border border-[var(--color-border)] overflow-hidden cursor-crosshair">
                <canvas
                    ref={canvasRef}
                    width={480}
                    height={360}
                    className="w-full h-full"
                    onClick={handleCanvasClick}
                />
                <span className="absolute bottom-2 left-3 font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)]/60">
                    click to teleport
                </span>
            </div>

            {/* Tabs — full width, immediately below canvas */}

            <div className="flex gap-1 mt-2">

                {landscapes.map((l, i) => (
                    <button
                        key={l.key}
                        onClick={() => setActiveLand(i)}
                        className={[
                            "flex-1 font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest py-1.5 border transition-colors duration-200",
                            i === activeLand
                                ? "border-[var(--color-accent)] text-[var(--color-accent)]"
                                : "border-[var(--color-border)] text-[var(--color-muted)] hover:border-[var(--color-ink)] hover:text-[var(--color-ink)]",
                        ].join(" ")}
                    >
                        {l.label}
                    </button>
                ))}
            </div>

            {/* Info strip */}
            <div className="mt-4 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-accent)] mb-1">
                        {land.formula}
                    </p>
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        {land.description}
                    </p>
                </div>
                <div className="text-right shrink-0">
                    <p className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] mb-1">
                        Loss
                    </p>
                    <p className="font-[family-name:var(--font-dm-mono)] text-sm text-[var(--color-ink)] tabular-nums">
                        {lossDisplay}
                    </p>
                </div>
            </div>

            {/* Pause/resume */}
            <button
                onClick={() => {
                    if (!running) {
                        reset(activeLand);
                        setRunning(true);
                    } else {
                        setRunning(false);
                    }
                }}
                className="mt-3 self-start font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
            >
                {running ? "⏸ pause" : "↺ restart"}
            </button>
        </div>
    );
}