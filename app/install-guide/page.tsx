import React from "react";

export const metadata = {
  title: "ToonTail Install Guide",
  description:
    "Step-by-step installation guide for ToonTail (Mercury 250–400 HP) with tools, hardware, adjustments, and safety.",
};

export default function InstallGuidePage(): JSX.Element {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <header className="border-b">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <img
              src="/media/ToonTail_Logo.jpeg?v=8"
              alt="ToonTail"
              className="h-8 w-8"
            />
            <span className="font-bold tracking-wide">ToonTail</span>
          </a>
          <a
            href="/#shop"
            className="text-sm px-3 py-1.5 rounded-lg border hover:border-slate-400"
          >
            Back to shop
          </a>
        </div>
      </header>

      <section className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-extrabold">ToonTail Install Guide</h1>
        <p className="mt-2 text-slate-600">
          Model: <strong>Mercury 150–400 HP</strong> (pontoon/tritoon). Version 0.9.
        </p>

        {/* Intro / Safety */}
        <div className="mt-6 p-4 rounded-xl bg-amber-50 border border-amber-200">
          <h2 className="font-semibold">Safety First</h2>
          <ul className="list-disc pl-5 text-sm mt-2 space-y-1">
            <li>Engine off; key removed; battery disconnect if applicable.</li>
            <li>Use eye protection and gloves. Work on a level surface.</li>
            <li>Follow your engine manufacturer’s guidelines and torque specs where applicable.</li>
            <li>After installation, re-check all fasteners and fitment after the first 5 min and continue to check with increasing intervals.</li>
          </ul>
        </div>

        {/* Compatibility */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Compatibility</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Designed for Mercury 150–400 HP outboards on pontoon/tritoon setups.</li>
            <li>Mounts to the anti-ventilation plate (or bracket location per kit).</li>
            <li>Clearance required: ensure full steering/trim range without propeller interference.</li>
          </ul>
        </div>

        {/* What's in the box */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">What’s in the box</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>ToonTail main assembly (black finish)</li>
            <li>316 stainless mounting bracket</li>
            <li>316 stainless hardware (bolts, washers, nyloc nuts)</li>
            <li>Rubber seal gasket</li>
            <li>Installation overview card</li>
          </ul>
        </div>

        {/* Tools */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Tools you’ll need</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Socket set & open-end wrenches (metric/SAE per your kit)</li>
            <li>Torque wrench strongly recomended (light-duty range)</li>
            <li>Blue threadlocker included (medium strength)</li>
            <li>Permanent marker to mark origional install placement recomended</li>
          </ul>
        </div>

        {/* Install Steps */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Install steps (approx. 3–5 minutes)</h2>
          <ol className="list-decimal pl-5 mt-2 space-y-3">
            <li>
              <span className="font-medium">Prep the area:</span> Disconect Battery, ensure Motor is off and in neutral. Clean and dry
              the anti-ventilation plate/bracket area.
            </li>
            <li>
              <span className="font-medium">Mock-up:</span> Hold the bracket in place, centered on the
              engine. Confirm clearance with the prop hub, trim range, and steering. Mounting plate is a "snug" fit by design and may reauire slight force.
            </li>
            <li>
              <span className="font-medium">Bracket alignment:</span> Ensure the plate is square on the motor and clear of the propeller. Plate should mount 1/2 to 1" past motor fin.  Mark for future references.
            </li>
            <li>
              <span className="font-medium">Mount the bracket:</span> Install the provided stainless bolts on bottom of plate to create a gap between the plate and motor fin. Install provided rubber seal into gap. Remove bolts from bottom of plate for install in top of plate. 
              Use provided Bolts, washers, and nyloc nuts. Snug them evenly—do not fully torque yet.
            </li>
            <li>
              <span className="font-medium">Final alignment:</span> Sight the outlet so it is parallel to
              the keel line. Ensure there’s no interference with propeller at full port/starboard and trim up/down.
            </li>
            <li>
              <span className="font-medium">Torque fasteners:</span> Tighten evenly to the hardware
              spec provided with your kit. (Typical light stainless hardware is often in the low
              ft-lb range; follow the spec sheet included in your box.)
            </li>
            <li>
              <span className="font-medium">Function check:</span> Turn the wheel lock-to-lock. Trim through
              the range. Nothing should rub or bind.
            </li>
            <li>
              <span className="font-medium">Lake test:</span> Start with neutral trim. Bring the boat on
              plane and gradually add power to increase tail height and distance. Check fitment and location promptly after first test
            </li>
            <li>
              <span className="font-medium">Post-test recheck:</span> Inspect all hardware after your first
              session and again after ~1 hour and 5 hours of use. Repeat all steps if uninstalling and reinstalling for later use. 
            </li>
          </ol>
        </div>

        {/* Tuning */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Tuning & tips</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>More height:</strong> Add a touch of positive trim at speed.</li>
            <li><strong>Cleaner arc:</strong> Keep the outlet level; small angle changes matter.</li>
            <li><strong>Distance vs. height:</strong> Neutral-to-slight-negative trim favors distance; positive trim increases height.</li>
            <li><strong>Load sensitivity:</strong> Heavier loads/water conditions may require extra trim.</li>
          </ul>
        </div>

        {/* Maintenance */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Maintenance</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li>Rinse after use, especially in brackish/salt water.</li>
            <li>Inspect fasteners after first outing, then every 5 hours.</li>
            <li>Check for any signs of loosening, wear, or interference.</li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className="mt-8">
          <h2 className="text-xl font-bold">Troubleshooting</h2>
          <ul className="list-disc pl-5 mt-2 space-y-1">
            <li><strong>Tail looks low:</strong> Add a notch of trim; verify outlet is level.</li>
            <li><strong>Tail is short:</strong> Verify speed and load; ensure no obstruction at outlet.</li>
            <li><strong>Vibration/noise:</strong> Re-torque hardware; confirm no contact at full trim/steer.</li>
          </ul>
        </div>

        {/* Support */}
        <div className="mt-10 p-4 rounded-xl bg-slate-50 border">
          <h2 className="text-xl font-bold">Support</h2>
          <p className="mt-2">
            Questions or need help? Email{" "}
            <a className="underline" href="mailto:info@toontail.com">
              info@toontail.com
            </a>
            .
          </p>
        </div>
      </section>
    </main>
  );
}
