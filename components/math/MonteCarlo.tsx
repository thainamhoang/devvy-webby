"use client";

import { useEffect, useRef, useState, useCallback } from "react";

// ─── Canvas renderer ──────────────────────────────────────────────────────────

interface Point {
    x: number; // [-1, 1]
    y: number;
    inside: boolean;
}

function drawMonteCarlo(
    ctx: CanvasRenderingContext2D,
    W: number,
    H: number,
    points: Point[]
) {
    ctx.clearRect(0, 0, W, H);

    const PAD = 16;
    const SIZE = Math.min(W, H) - PAD * 2;
    const OX = (W - SIZE) / 2;
    const OY = (H - SIZE) / 2;

    const toCanvas = (v: number, offset: number) =>
        offset + ((v + 1) / 2) * SIZE;

    // Square background
    ctx.save();
    ctx.fillStyle = "rgba(176,139,90,0.04)";
    ctx.strokeStyle = "rgba(176,139,90,0.25)";
    ctx.lineWidth = 1;
    ctx.fillRect(OX, OY, SIZE, SIZE);
    ctx.strokeRect(OX, OY, SIZE, SIZE);
    ctx.restore();

    // Full unit circle — solid, more visible
    {
        const cx = OX + SIZE / 2;
        const cy = OY + SIZE / 2;
        const r = SIZE / 2;
        ctx.save();
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(176,139,90,0.85)";
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.stroke();
        ctx.restore();
    }

    // Grid lines (faint)
    ctx.save();
    ctx.strokeStyle = "rgba(176,139,90,0.07)";
    ctx.lineWidth = 0.5;
    for (let i = 1; i < 4; i++) {
        const t = (i / 4) * SIZE;
        ctx.beginPath();
        ctx.moveTo(OX + t, OY);
        ctx.lineTo(OX + t, OY + SIZE);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(OX, OY + t);
        ctx.lineTo(OX + SIZE, OY + t);
        ctx.stroke();
    }
    ctx.restore();

    // Points
    for (const p of points) {
        const cx = toCanvas(p.x, OX);
        const cy = toCanvas(-p.y, OY); // flip y
        ctx.save();
        ctx.fillStyle = p.inside
            ? "rgba(176,139,90,0.75)"
            : "rgba(28,28,28,0.2)";
        ctx.beginPath();
        ctx.arc(cx, cy, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }


}

// ─── Component ────────────────────────────────────────────────────────────────

const BATCH = 20;
const MAX_POINTS = 5000;

export default function MonteCarloPi() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const pointsRef = useRef<Point[]>([]);
    const rafRef = useRef<number>(0);
    const runningRef = useRef(true);

    const [running, setRunning] = useState(true);
    const [inside, setInside] = useState(0);
    const [total, setTotal] = useState(0);
    const [piEst, setPiEst] = useState(0);

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        drawMonteCarlo(ctx, canvas.width, canvas.height, pointsRef.current);
    }, []);

    const reset = useCallback(() => {
        cancelAnimationFrame(rafRef.current);
        pointsRef.current = [];
        setInside(0);
        setTotal(0);
        setPiEst(0);
    }, []);

    // Animation loop
    useEffect(() => {
        if (!running) return;
        runningRef.current = true;

        const step = () => {
            if (!runningRef.current) return;

            if (pointsRef.current.length >= MAX_POINTS) {
                setRunning(false);
                runningRef.current = false;
                return;
            }

            const newPts: Point[] = [];
            for (let i = 0; i < BATCH; i++) {
                const x = Math.random() * 2 - 1;
                const y = Math.random() * 2 - 1;
                newPts.push({ x, y, inside: x * x + y * y <= 1 });
            }

            pointsRef.current = [...pointsRef.current, ...newPts];

            const totalNow = pointsRef.current.length;
            const insideNow = pointsRef.current.filter((p) => p.inside).length;

            setTotal(totalNow);
            setInside(insideNow);
            setPiEst((4 * insideNow) / totalNow);

            redraw();
            rafRef.current = requestAnimationFrame(step);
        };

        rafRef.current = requestAnimationFrame(step);
        return () => {
            runningRef.current = false;
            cancelAnimationFrame(rafRef.current);
        };
    }, [running, redraw]);

    const handleToggle = () => {
        if (running) {
            setRunning(false);
            runningRef.current = false;
        } else if (total >= MAX_POINTS) {
            reset();
            setRunning(true);
        } else {
            setRunning(true);
        }
    };

    const handleRestart = () => {
        reset();
        setRunning(true);
    };

    const error = total > 0 ? Math.abs(piEst - Math.PI) : 0;
    const accuracy = total > 0 ? (1 - error / Math.PI) * 100 : 0;

    const piDisplay = total > 0 ? piEst.toFixed(6) : "—";

    return (
        <div className="flex flex-col w-full select-none">

            {/* Canvas — square, no border */}
            <div className="relative w-full overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
                <canvas
                    ref={canvasRef}
                    width={480}
                    height={480}
                    className="w-full h-full"
                />
            </div>

            {/* Stats cards */}
            <div className="mt-3 grid grid-cols-2 gap-2">
                {/* Estimated π */}
                <div className="border border-[var(--color-border)] px-4 py-3">
                    <p className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-accent)] mb-1">
                        π ≈ 4 × (inside / total)
                    </p>
                    <p className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)] tabular-nums leading-none mb-3">
                        {piDisplay}
                    </p>
                    <span className="inline-block font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest px-2 py-0.5 border border-[var(--color-accent)] text-[var(--color-accent)]">
                        Acc: {total > 0 ? `${accuracy.toFixed(2)}%` : "—"}
                    </span>
                </div>

                {/* Total darts */}
                <div className="border border-[var(--color-border)] px-4 py-3">
                    <p className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)] mb-1">
                        Total Darts
                    </p>
                    <p className="font-[family-name:var(--font-fraunces)] text-3xl text-[var(--color-ink)] tabular-nums leading-none mb-3">
                        {total.toLocaleString()}
                    </p>
                    <span className="font-[family-name:var(--font-dm-mono)] text-[9px] text-[var(--color-muted)]">
                        Inside:{" "}
                        <span className="text-[var(--color-accent)]">{inside.toLocaleString()}</span>
                    </span>
                </div>
            </div>

            {/* Description */}
            <div className="mt-3 flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                    <p className="text-xs text-[var(--color-muted)] leading-relaxed">
                        Random points in [−1,1]². Those within unit distance of the origin fall inside the circle. The ratio converges to π/4.
                    </p>
                </div>
                {/* Legend */}
                <div className="flex flex-col gap-1.5 text-right shrink-0">
                    <div className="flex items-center justify-end gap-2">
                        <span className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)]">inside</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-accent)]" />
                    </div>
                    <div className="flex items-center justify-end gap-2">
                        <span className="font-[family-name:var(--font-dm-mono)] text-[9px] uppercase tracking-widest text-[var(--color-muted)]">outside</span>
                        <span className="inline-block w-2 h-2 rounded-full bg-[var(--color-ink)]/20" />
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="mt-3 flex items-center gap-4">
                <button
                    onClick={handleToggle}
                    className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
                >
                    {running ? "⏸ pause" : total >= MAX_POINTS ? "↺ restart" : "▶ resume"}
                </button>
                {!running && total > 0 && total < MAX_POINTS && (
                    <button
                        onClick={handleRestart}
                        className="font-[family-name:var(--font-dm-mono)] text-[10px] uppercase tracking-widest text-[var(--color-muted)] hover:text-[var(--color-ink)] transition-colors duration-200"
                    >
                        ↺ restart
                    </button>
                )}
            </div>
        </div>
    );
}