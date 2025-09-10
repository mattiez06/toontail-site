"use client";
import React, { useMemo, useState } from "react";

// ---- Media files in /public/media (names must match exactly; ?v=5 busts cache) ----
const MEDIA = {
  videoBefore: "/media/toontail-before.mp4?v=5",
  videoAfter:  "/media/toontail-after.mp4?v=5",
  posterBefore: "/media/toontail-before.jpg?v=5",
  posterAfter:  "/media/toontail-after.jpg?v=5",
  photoBefore: "/media/Without_ToonTail.jpeg?v=5",
  photoAfter:  "/media/With_ToonTail.jpeg?v=5",
};

// Optional extra images grid
const EXTRAS = [
  "/media/Alt1.jpeg",
  "/media/Alt2.jpeg",
  "/media/Alt3.jpeg",
  "/media/Device_Closeup.jpeg",
  "/media/With_ToonTail.jpeg",
  "/media/Without_ToonTail.jpeg",
  "/media/ToonTail_Logo.jpeg",
];

export default function Page() {
  return <ToonTailLanding />;
}

function ToonTailLanding() {
  // ---- Estimator inputs (only these three) ----
  const [estimator, setEstimator] = useState({
    speedMph: 30,   // boat speed
    horsepower: 350,
    trimDeg: 10,
  });

  // ---- Calibrated math: 30 mph, 350 hp, 10° → ~35 ft height, ~110 ft distance ----
  const estimation = useMemo(() => {
    const v   = Math.max(5, estimator.speedMph);
    const hp  = Math.max(50, estimator.horsepower);
    const trim = Math.max(0, Math.min(20, estimator.trimDeg)); // clamp 0–20°

    const H_BASE = 35;   // feet
    const D_BASE = 110;  // feet

    // Exponents & trim sensitivities (tunable)
    const ALPHA_H = 0.7;    // speed → height
    const BETA_H  = 0.25;   // hp    → height
    const TRIM_H  = 0.04;   // +4% height per +1° from 10°

    const ALPHA_D = 1.0;    // speed → distance
    const BETA_D  = 0.20;   // hp    → distance
    const TRIM_D  = -0.015; // −1.5% distance per +1° from 10°

    // Trim multipliers
    const hTrim = Math.max(0.2, 1 + TRIM_H * (trim - 10));
    const dTrim = Math.max(0.2, 1 + TRIM_D * (trim - 10));

    // Scale relative to the calibration point
    const height = H_BASE * Math.pow(v / 30, ALPHA_H) * Math.pow(hp / 350, BETA_H) * hTrim;
    const dist   = D_BASE * Math.pow(v / 30, ALPHA_D) * Math.pow(hp / 350, BETA_D) * dTrim;

    const heightFt   = Math.round(Math.min(60, Math.max(0, height)));
    const distanceFt = Math.round(Math.min(300, Math.max(1, dist)));

    return { heightFt, distanceFt };
  }, [estimator]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <Nav />
      <Hero onCtaClick={() => document.getElementById("estimator")?.scrollIntoView({ behavior: "smooth" })} />

      <Section id="how" title="What is ToonTail?" eyebrow="Turn wake into wow">
        <p className="text-lg md:text-xl max-w-3xl">
          ToonTail is a bolt-on water-jet accessory engineered for pontoons and tritoons. It captures a small amount of thrust from the prop and
          redirects it through a tuned, efficient outlet to create a clean, dramatic rooster tail—without sacrificing performance.
        </p>
      </Section>

      <Section id="estimator" title="Tail estimator (beta)" eyebrow="Dial it in">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Controls */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
            <SliderRow
              label="Boat speed"
              unit="mph"
              min={10}
              max={60}
              step={1}
              value={estimator.speedMph}
              onChange={(v) => setEstimator((s: any) => ({ ...s, speedMph: v }))}
            />
            <SliderRow
              label="Horsepower"
              unit="hp"
              min={90}
              max={450}
              step={10}
              value={estimator.horsepower}
              onChange={(v) => setEstimator((s: any) => ({ ...s, horsepower: v }))}
            />
            <SliderRow
              label="Motor trim"
              unit="°"
              min={0}
              max={15}
              step={1}
              value={estimator.trimDeg}
              onChange={(v) => setEstimator((s: any) => ({ ...s, trimDeg: v }))}
            />

            <p className="text-xs text-slate-500 mt-3">
              Calibrated so 30 mph / 350 hp / 10° → ~35 ft height, ~110 ft distance. Actual results vary with prop, hull, load, and water.
            </p>
          </div>

          {/* Readout */}
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="grid gap-3">
              <Metric label="Estimated tail height" value={`${estimation.heightFt} ft`} />
              <Metric label="Estimated tail distance" value={`${estimation.distanceFt} ft`} />
            </div>
            <div className="mt-6">
              <MiniChart height={estimation.heightFt} distance={estimation.distanceFt} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="gallery" title="Before and After Slider">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <h3 className="text-lg font-semibold">Photo — Before / After</h3>
            <p className="text-slate-600 text-sm mb-3">Drag the slider to compare.</p>
            <BeforeAfter beforeSrc={MEDIA.photoBefore} afterSrc={MEDIA.photoAfter} />
          </Card>
          <Card>
            <h3 className="text-lg font-semibold">Hero video</h3>
            <HeroVideo />
          </Card>
        </div>
      </Section>

      <Section id="more-angles" title="More angles" eyebrow="Close-ups & alternates">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {EXTRAS.map((src) => (
            <img key={src} src={src} className="aspect-[4/3] w-full object-cover rounded-xl border" alt="ToonTail extra" />
          ))}
        </div>
      </Section>

      <Footer />
    </div>
  );
}

// --- Brand logo component (top-level, not inside any other function) ---
function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/media/ToonTail_Logo.jpeg?v=4"
      alt="ToonTail"
      className={`${className} w-auto`}
    />
  );
}

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="font-bold tracking-wide">ToonTail</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#estimator" className="hover:text-slate-900">Estimator</a>
          <a href="#more-angles" className="hover:text-slate-900">More angles</a>
          <a href="#estimator" className="px-3 py-2 rounded-xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700">
            Join waitlist
          </a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  const [which, setWhich] = useState<"before" | "after">("after");
  const src = which === "after" ? MEDIA.videoAfter : MEDIA.videoBefore;
  const poster = which === "after" ? MEDIA.posterAfter : MEDIA.posterBefore;

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 py-12 md:py-18 grid md:grid-cols-2 gap-8 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold">
            <span>NEW</span>
            <span>ToonTail prototypes now testing</span>
          </div>
          <h1 className="mt-4 text-4xl md:text-6xl font-black leading-tight tracking-tight">
            Turn wake into <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">wow</span>.
          </h1>
          <p className="mt-4 text-lg md:text-xl text-slate-700 max-w-xl">
            A tunable bolt-on jet that turns your tritoon’s wake into a clean, crowd-pleasing rooster tail.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={onCtaClick} className="px-5 py-3 rounded-2xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700">Join waitlist</button>
            <a href="#gallery" className="px-5 py-3 rounded-2xl border border-slate-300 font-medium hover:border-slate-400">See results</a>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Hero video:</span>
            {(["before","after"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setWhich(k)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${which===k ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"}`}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
            <div className="relative aspect-[16/9] w-full bg-black">
              <video
                key={src}
                poster={poster}
                className="absolute inset-0 h-full w-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                {/* try MP4 first, then MOV as fallback */}
                <source src={src.replace(".mov",".mp4")} type="video/mp4" />
                <source src={src.replace(".mp4",".mov")} type="video/quicktime" />
              </video>
            </div>
          </div>

          <p className="text-xs text-slate-500 mt-2">
            Videos autoplay muted & loop. Put files in <code>/public/media/</code>.
          </p>
        </div>
      </div>
    </section>
  );
}

function HeroVideo() {
  const [which, setWhich] = useState<"before" | "after">("after");
  const src = which === "after" ? MEDIA.videoAfter : MEDIA.videoBefore;
  const poster = which === "after" ? MEDIA.posterAfter : MEDIA.posterBefore;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">Toggle:</span>
        {(["before","after"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setWhich(k)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${which===k ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"}`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="rounded-2xl overflow-hidden border">
        <div className="relative aspect-[16/9] w-full bg-black">
          <video
            key={src}
            poster={poster}
            className="absolute inset-0 h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={src.replace(".mov",".mp4")} type="video/mp4" />
            <source src={src.replace(".mp4",".mov")} type="video/quicktime" />
          </video>
        </div>
      </div>
    </div>
  );
}

function Section({ id, eyebrow, title, children }: any) {
  return (
    <section id={id} className="py-14 md:py-20">
      <div className="max-w-7xl mx-auto px-4">
        <div className="mb-6">
          {eyebrow && <div className="text-xs font-semibold tracking-wide uppercase text-sky-700">{eyebrow}</div>}
          <h2 className="text-2xl md:text-3xl font-extrabold mt-1">{title}</h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function Card({ children }: any) {
  return <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">{children}</div>;
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 rounded-xl bg-slate-50 border">
      <span className="text-sm text-slate-600">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function MiniChart({ height, distance }: { height: number; distance: number }) {
  // Fixed axis ranges so extremes are obvious (tweak if you like)
  const H_MIN = 0,   H_MAX = 60;   // feet (matches your clamp)
  const D_MIN = 0,   D_MAX = 300;  // feet (matches your clamp)

  // Canvas
  const w = 340;
  const h = 160;
  const pad = 20;

  // Clamp inputs and map to fixed coordinates
  const hClamped = Math.max(H_MIN, Math.min(H_MAX, height));
  const dClamped = Math.max(D_MIN, Math.min(D_MAX, distance));

  const x = pad + ((dClamped - D_MIN) / (D_MAX - D_MIN)) * (w - pad * 2);
  const y = (h - pad) - ((hClamped - H_MIN) / (H_MAX - H_MIN)) * (h - pad * 2);

  const x0 = pad, y0 = h - pad; // origin (left/bottom)
  const cx = x0 + (x - x0) / 2; // control point x
  const cy = y - 40 * (hClamped / (H_MAX || 1)) + 20; // bend more when taller

  const strokeW = 4 + 4 * (hClamped / (H_MAX || 1)); // thicker when taller
  const path = `M ${x0} ${y0} Q ${cx} ${cy}, ${x} ${y}`;

  // Flags to hint at extremes
  const nearLow  = hClamped <= H_MIN + 5 || dClamped <= D_MIN + 15;
  const nearHigh = hClamped >= H_MAX - 5 || dClamped >= D_MAX - 15;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      {/* background */}
      <rect x="0" y="0" width={w} height={h} fill="#f8fafc" />
      {/* grid */}
      <g stroke="#e2e8f0" strokeWidth="1">
        {Array.from({ length: 5 }).map((_, i) => {
          const yy = pad + (i * (h - pad * 2)) / 4;
          return <line key={i} x1={pad} y1={yy} x2={w - pad} y2={yy} />;
        })}
        {Array.from({ length: 6 }).map((_, i) => {
          const xx = pad + (i * (w - pad * 2)) / 5;
          return <line key={`v${i}`} x1={xx} y1={pad} x2={xx} y2={h - pad} />;
        })}
      </g>

      {/* axes labels */}
      <text x={pad} y={h - 4} fontSize="10" fill="#475569">0 ft</text>
      <text x={w - pad - 28} y={h - 4} fontSize="10" fill="#475569">{D_MAX} ft</text>
      <text x={2} y={pad + 10} fontSize="10" fill="#475569">{H_MAX} ft</text>

      {/* tail arc */}
      <defs>
        <linearGradient id="jet" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <path d={path} stroke="url(#jet)" strokeWidth={strokeW} fill="none" />

      {/* end marker */}
      <circle cx={x} cy={y} r="4" fill="#0ea5e9" />

      {/* captions */}
      <text x="10" y="14" fontSize="10" fill="#334155">Tail arc (illustrative)</text>
      {nearLow  && <text x={pad} y={pad + 12} fontSize="10" fill="#64748b">low end</text>}
      {nearHigh && <text x={w - pad - 44} y={pad + 12} fontSize="10" fill="#64748b">high end</text>}
    </svg>
  );
}


function BeforeAfter({
  beforeSrc,
  afterSrc,
  labelBefore = "Before",
  labelAfter = "After",
}: {
  beforeSrc: string;
  afterSrc: string;
  labelBefore?: string;
  labelAfter?: string;
}) {
  const [pos, setPos] = useState(50);
  return (
    <div className="rounded-2xl overflow-hidden relative select-none">
      <div className="relative">
        <img src={afterSrc} alt={labelAfter} className="w-full block" />
        <div className="absolute inset-0 overflow-hidden" style={{ width: `${pos}%` }}>
          <img src={beforeSrc} alt={labelBefore} className="w-full block" />
        </div>
        <span className="absolute top-2 left-2 text-xs font-semibold px-2 py-1 rounded bg-slate-900/70 text-white">{labelBefore}</span>
        <span className="absolute top-2 right-2 text-xs font-semibold px-2 py-1 rounded bg-slate-900/70 text-white">{labelAfter}</span>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => setPos(Number(e.target.value))}
          className="absolute bottom-3 left-1/2 -translate-x-1/2 w-2/3 accent-sky-600"
        />
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="mt-10 border-t">
      <div className="max-w-7xl mx-auto px-4 py-10 grid md:grid-cols-3 gap-6 items-start">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <div>
            <div className="font-bold">ToonTail</div>
            <div className="text-sm text-slate-500">© {new Date().getFullYear()} ToonTail LLC. All rights reserved.</div>
          </div>
        </div>
        <div className="text-sm text-slate-600">
          <div className="font-semibold mb-1">Docs</div>
          <ul className="space-y-1">
            <li><a className="hover:text-slate-900" href="#">Install guide (coming soon)</a></li>
            <li><a className="hover:text-slate-900" href="#">Dealer program</a></li>
            <li><a className="hover:text-slate-900" href="#">Media kit</a></li>
          </ul>
        </div>
        <div className="text-sm text-slate-600">
          <div className="font-semibold mb-1">Safety & Legal</div>
          <p>Operate responsibly. Follow local laws and manufacturer guidelines. Modifications may affect handling and warranty; inspect hardware periodically. Use at your own risk.</p>
        </div>
      </div>
    </footer>
  );
}

// ---- UI helpers ----
function SliderRow({
  label, unit, value, onChange, min, max, step = 1,
}: {
  label: string; unit: string; value: number;
  onChange: (v: number) => void; min: number; max: number; step?: number;
}) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm text-slate-600">{value}{unit}</span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full accent-sky-600"
      />
      <div className="flex justify-between text-[11px] text-slate-500 mt-1">
        <span>{min}{unit}</span><span>{max}{unit}</span>
      </div>
    </div>
  );
}
