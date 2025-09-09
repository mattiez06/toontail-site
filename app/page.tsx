"use client";
import { useState } from "react";

const MEDIA = {
  before: "/media/toontail-before.mov",
  after:  "/media/toontail-after.mov",
  posterBefore: "/media/toontail-before.jpg",
  posterAfter:  "/media/toontail-after.jpg",
};

export default function Page() {
  const [which, setWhich] = useState<"after" | "before">("after");
  const src = which === "after" ? MEDIA.after : MEDIA.before;
  const poster = which === "after" ? MEDIA.posterAfter : MEDIA.posterBefore;

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <div className="max-w-5xl mx-auto p-6">
        <h1 className="text-4xl font-black">ToonTail</h1>
        <p className="mt-2 text-slate-600">Turn wake into wow.</p>

        <div className="mt-4 flex gap-2">
          <button onClick={()=>setWhich("after")} className={`px-3 py-1 rounded ${which==="after"?"bg-slate-900 text-white":"border"}`}>AFTER</button>
          <button onClick={()=>setWhich("before")} className={`px-3 py-1 rounded ${which==="before"?"bg-slate-900 text-white":"border"}`}>BEFORE</button>
        </div>

        <div className="mt-3 rounded-2xl overflow-hidden border">
          <video
            key={src}
            src={src}
            poster={poster}
            className="w-full h-auto"
            autoPlay
            muted
            loop
            playsInline
          />
        </div>

        <p className="text-sm text-slate-500 mt-2">
          Videos autoplay muted & loop. Upload your media to <code>public/media/</code> with the filenames above.
        </p>
      </div>
    </main>
  );
}
