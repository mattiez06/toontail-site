"use client";
import React, { useMemo, useState } from "react";

// ---- Media files (put these in /public/media/) ----
// Use .mp4 for smaller, faster video. If yours are .mov, change the two lines below to .mov.
const MEDIA = {
  videoBefore: "/media/toontail-before.mp4",
  videoAfter:  "/media/toontail-after.mp4",
  posterBefore: "/media/toontail-before.jpg",
  posterAfter:  "/media/toontail-after.jpg",
  photoBefore: "/media/toontail-photo-before.jpg",
  photoAfter:  "/media/toontail-photo-after.jpg",
};

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

  const reducerRatio = useMemo(() => estimator.reducerFrom / estimator.reducerTo, [estimator]);

  const estimation = useMemo(() => {
    const v = Math.max(0, estimator.speedMph);
    const angleRad = (Math.max(5, Math.min(60, estimator.pipeAngle)) * Math.PI) / 180;
    const trimRad = (Math.max(0, Math.min(20, estimator.trimDeg)) * Math.PI) / 180;
    const effAngle = angleRad + trimRad * 0.35;
    const reducerGain = Math.min(2.2, Math.pow(reducerRatio, 0.55));
    const assistGain = estimator.intakeAssist ? 1.15 : 1.0;
    const base = (v / 35) * 1.0 * reducerGain * assistGain;
    const heightFt = Math.round(10 * base * Math.sin(effAngle) * 1.8);
    const distanceFt = Math.round(10 * base * Math.cos(effAngle) * 2.2);
    const cleanliness = Math.max(1, Math.min(5, Math.round(3 + (estimator.pipeAngle - 28) / 10 - estimator.trimDeg * 0.05)));
    return { heightFt, distanceFt, cleanliness };
  }, [estimator, reducerRatio]);

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitted(true);
    // TODO: wire to Mailchimp/Klaviyo or email API
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <Nav />
      <Hero onCtaClick={() => document.getElementById("cta")?.scrollIntoView({ behavior: "smooth" })} />

      <Section id="how" title="What is ToonTail?" eyebrow="Turn wake into wow">
        <p className="text-lg md:text-xl max-w-3xl">
          ToonTail is a bolt-on water-jet accessory engineered for pontoons and tritoons. It captures prop wash and
          redirects it through a tuned outlet to create a clean, dramatic rooster tail—without sacrificing your day on
          the water. Version 2.0 adds adjustable geometry for height, distance, and water cleanliness tuning.
        </p>
        <ul className="grid md:grid-cols-3 gap-4 mt-8">
          {[
            { t: "Bolt-on simplicity", d: "Reinforced 316 stainless mount for quick install." },
            { t: "Tunable performance", d: "Adjust angle (30°–45°), standoff, and outlet shape." },
            { t: "Built for big outboards", d: "Tested on 300–350 HP with 4→3 in reducer and smooth taper." },
          ].map((f, i) => (
            <li key={i} className="p-5 rounded-2xl bg-white shadow-sm border border-slate-100">
              <h3 className="font-semibold mb-1 text-slate-900">{f.t}</h3>
              <p className="text-slate-600">{f.d}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section id="proto" title="Two prototypes we’re testing" eyebrow="A/B for the perfect tail">
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <Badge>Version A</Badge>
            <h3 className="text-xl font-semibold">Baseline 30° w/ 4→3 smooth taper</h3>
            <ul className="mt-3 text-slate-600 list-disc list-inside">
              <li>Pipe angle fixed at 30° (trim 0–5° typical)</li>
              <li>Reducer: smooth 6–8" taper; outlet round 3"</li>
              <li>Standoff: ~5" from prop, intake flush with AV plate</li>
              <li>Goal: consistent
