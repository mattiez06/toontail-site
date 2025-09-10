"use client";
import React, { useMemo, useState } from "react";

// ---- Media files in /public/media (names must match exactly; ?v=3 busts cache) ----
const MEDIA = {
  videoBefore: "/media/toontail-before.mp4?v=3",
  videoAfter:  "/media/toontail-after.mp4?v=3",
  posterBefore: "/media/toontail-before.jpg?v=3",
  posterAfter:  "/media/toontail-after.jpg?v=3",
  photoBefore: "/media/toontail-photo-before.jpg?v=3",
  photoAfter:  "/media/toontail-photo-after.jpg?v=3",
};

// Extra gallery images (exact filenames from /public/media)
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
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [estimator, setEstimator] = useState({
    speedMph: 35,
    pipeAngle: 30,
    reducerFrom: 4,
    reducerTo: 3,
    trimDeg: 2,
    intakeAssist: false,
  });

  // ---- Estimator inputs (only these three) ----
const [estimator, setEstimator] = useState({
  speedMph: 30,   // boat speed
  horsepower: 350,
  trimDeg: 10,
});

// ---- Calibrated math: 30 mph, 350 hp, 10° → 35 ft height, 110 ft distance ----
const estimation = useMemo(() => {
  const v   = Math.max(5, estimator.speedMph);
  const hp  = Math.max(50, estimator.horsepower);
  const trim = Math.max(0, Math.min(20, estimator.trimDeg)); // clamp 0–20°

  // Baseline targets at (30 mph, 350 hp, 10°)
  const H_BASE = 35;   // feet
  const D_BASE = 110;  // feet

  // Exponents & trim sensitivities (tunable)
  const ALPHA_H = 0.7;   // speed → height
  const BETA_H  = 0.25;  // hp    → height
  const TRIM_H  = 0.04;  // +4% height per +1° from 10°

  const ALPHA_D = 1.0;   // speed → distance
  const BETA_D  = 0.20;  // hp    → distance
  const TRIM_D  = -0.015; // −1.5% distance per +1° from 10°

  // Trim multipliers (keep sane)
  const hTrim = Math.max(0.2, 1 + TRIM_H * (trim - 10));
  const dTrim = Math.max(0.2, 1 + TRIM_D * (trim - 10));

  // Scale relative to the calibration point
  const height = H_BASE * Math.pow(v / 30, ALPHA_H) * Math.pow(hp / 350, BETA_H) * hTrim;
  const dist   = D_BASE * Math.pow(v / 30, ALPHA_D) * Math.pow(hp / 350, BETA_D) * dTrim;

  // Optional soft caps (keep outputs realistic)
  const heightFt   = Math.round(Math.min(60, Math.max(0, height)));
  const distanceFt = Math.round(Math.min(300, Math.max(1, dist)));

  return { heightFt, distanceFt };
}, [estimator]);


  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <Nav />
      <Hero onCtaClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })} />

      <Section id="how" title="What is ToonTail?" eyebrow="Turn wake into wow">
        <p className="text-lg md:text-xl max-w-3xl">
          ToonTail is a bolt-on water-jet accessory engineered for pontoons and tritoons. It captures a small amount of thrust from the prop and
          redirects it through a tuned, effecient outlet to create a clean, dramatic rooster tail—without sacrificing performance. Got Tail ? Get Toon Tail!
        </p>
      </Section>

      <Section id="estimator" title="Tail estimator (beta)" eyebrow="Back-of-napkin physics">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
            <form className="grid grid-cols-2 gap-4" id="waitlist" onSubmit={onSubmit}>
              <LabeledInput label="Boat speed (mph)" type="number" value={estimator.speedMph} onChange={(v: string) => setEstimator((s) => ({ ...s, speedMph: Number(v) }))} />
              <LabeledInput label="Pipe angle (°)" type="number" value={estimator.pipeAngle} onChange={(v: string) => setEstimator((s) => ({ ...s, pipeAngle: Number(v) }))} />
              <LabeledInput label="Motor trim (°)" type="number" value={estimator.trimDeg} onChange={(v: string) => setEstimator((s) => ({ ...s, trimDeg: Number(v) }))} />
              <div className="col-span-2">
                <label className="block text-sm font-medium text-slate-700 mb-1">Reducer (from → to)</label>
                <div className="flex items-center gap-3">
                  <select className="px-3 py-2 rounded-xl border w-28" value={estimator.reducerFrom} onChange={(e) => setEstimator((s) => ({ ...s, reducerFrom: Number(e.target.value) }))}>
                    {[4, 5].map((n) => <option key={n} value={n}>{n}"</option>)}
                  </select>
                  <span className="text-xl">→</span>
                  <select className="px-3 py-2 rounded-xl border w-28" value={estimator.reducerTo} onChange={(e) => setEstimator((s) => ({ ...s, reducerTo: Number(e.target.value) }))}>
                    {[3, 2.5].map((n) => <option key={n} value={n}>{n}"</option>)}
                  </select>
                </div>
              </div>
              <label className="col-span-2 inline-flex items-center gap-3 text-sm text-slate-700">
                <input type="checkbox" checked={estimator.intakeAssist} onChange={(e) => setEstimator((s) => ({ ...s, intakeAssist: e.target.checked }))} />
                Add gill/interceptor assist
              </label>
              <button className="col-span-2 mt-1 px-4 py-2 rounded-xl bg-sky-600 text-white">Join waitlist</button>
            </form>
            <p className="text-xs text-slate-500 mt-3">*Estimator is indicative only and not a guarantee of actual performance.</p>
          </div>
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
            <div className="grid gap-3">
              <Metric label="Estimated tail height" value={`${estimation.heightFt} ft`} />
              <Metric label="Estimated tail distance" value={`${estimation.distanceFt} ft`} />
              <Metric label="Cleanliness (1–5)" value={`${estimation.cleanliness}`} />
            </div>
            <div className="mt-6">
              <MiniChart height={estimation.heightFt} distance={estimation.distanceFt} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="gallery" title="Prototype gallery" eyebrow="In the wild (test shots)">
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

      {/* Dedicated grid of your extra photos */}
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

function Nav() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          function Logo({ className = "" }: { className?: string }) {
  return (
    <img
      src="/media/ToonTail_Logo.jpeg?v=4"
      alt="ToonTail"
      className={`${className} w-auto`}
    />
  );
}

          <span className="font-bold tracking-wide">ToonTail</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#gallery" className="hover:text-slate-900">Gallery</a>
          <a href="#estimator" className="hover:text-slate-900">Estimator</a>
          <a href="#more-angles" className="hover:text-slate-900">More angles</a>
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
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${which===k?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-700 border-slate-300 hover:border-slate-400"}`}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>
          <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
            <video key={src} src={src} poster={poster} className="w-full h-full object-cover aspect-[4/3]" autoPlay muted loop playsInline />
          </div>
          <p className="text-xs text-slate-500 mt-2">Videos autoplay muted & loop. Put files in <code>/public/media/</code>.</p>
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
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${which===k?"bg-slate-900 text-white border-slate-900":"bg-white text-slate-700 border-slate-300 hover:border-slate-400"}`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden border">
        <video key={src} src={src} poster={poster} className="w-full h-auto" autoPlay muted loop playsInline />
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

function Card({ children }: any) { return <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">{children}</div>; }
function Badge({ children }: any) { return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-900 text-white mb-3">{children}</span>; }

function LabeledInput({ label, type = "text", value, onChange, placeholder, required = false }: any) {
  return (
    <label className="block">
      <span className="block text-sm font-medium text-slate-700 mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-400"
      />
    </label>
  );
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
  const h = Math.max(0, height);
  const d = Math.max(1, distance);
  const w = 320;
  const ht = 160;
  const xMax = Math.max(50, d);
  const yMax = Math.max(20, h);
  const scaleX = w / xMax;
  const scaleY = ht / (yMax * 1.1);
  const endX = d * scaleX;
  const endY = ht - h * scaleY;
  const path = `M 20 ${ht - 10} Q ${endX / 2} ${endY - 40}, ${endX} ${endY}`;
  return (
    <svg viewBox={`0 0 ${w} ${ht}`} className="w-full h-40">
      <defs>
        <linearGradient id="jet" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={ht} fill="#f8fafc" />
      <rect x="0" y={ht - 12} width={w} height={12} fill="#94a3b8" opacity="0.3" />
      <path d={path} stroke="url(#jet)" strokeWidth="6" fill="none" />
      <circle cx={endX} cy={endY} r="4" fill="#0ea5e9" />
      <text x="10" y="16" fontSize="10" fill="#334155">Tail arc (illustrative)</text>
    </svg>
  );
}

function BeforeAfter({ beforeSrc, afterSrc, labelBefore = "Before", labelAfter = "After" }:
{ beforeSrc: string; afterSrc: string; labelBefore?: string; labelAfter?: string; }) {
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

function Logo({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="120" height="120" rx="24" fill="#0b1220" />
      <g fill="none" stroke="#fff" strokeWidth="6" strokeLinejoin="round" strokeLinecap="round">
        <path d="M20 40h36m-18 0v48" />
        <path d="M64 40h36m-18 0v48" />
      </g>
      <path d="M30 86c22-18 44-6 60-26 4-5 8-10 8-10-2 12-8 22-17 30-11 10-27 16-51 16" fill="url(#g)" opacity="0.9" />
    </svg>
  );
}

const faq = [
{ q: "Will ToonTail affect performance or engine cooling?", a: "Designed to leverage existing thrust aft of the prop while maintaining cooling; we target minimal speed impact at cruise. Always monitor engine temps and follow manufacturer guidelines." },
{ q: "What engines/boats are supported?", a: "ToonTail currently works with Mercury 250–400 HP outboards on pontoons and tritoons. Additional tails are in development for high-HP Yamaha motors and 90–150 HP Mercury motors." },
{ q: "How is it installed?", a: "A reinforced, removable 316 stainless bracket clamps to the anti-ventilation plate or engine bracket. See installation instructions for torque specs and step-by-step." },
{ q: "Can I tune the tail height and cleanliness?", a: "Yes: slight trim adjustments can significantly change the angle, giving you control over height and distance; an optional gill/interceptor (coming soon) can boost head pressure for taller tails." },
{ q: "Is it legal everywhere?", a: "Rules vary by jurisdiction. Always verify local regulations and operate with courtesy." },
{ q: "Where can I buy one?", a: "Join the waitlist to get in line for the Founder’s run. Available at toontail.com or at a boat show near you." }
 },
];
