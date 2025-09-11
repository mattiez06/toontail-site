"use client";

import React, { useEffect, useMemo, useState } from "react";

/* -------------------- MEDIA -------------------- */
const MEDIA = {
  videoBefore: "/media/toontail-before.mp4?v=8",
  videoAfter: "/media/toontail-after.mp4?v=8",
  posterBefore: "/media/toontail-before.jpg?v=8",
  posterAfter: "/media/toontail-after.jpg?v=8",
  photoBefore: "/media/Without_ToonTail.jpeg?v=8",
  photoAfter: "/media/With_ToonTail.jpeg?v=8",
  logo: "/media/ToonTail_Logo.jpeg?v=8",
};

const EXTRAS = [
  "/media/Alt1.jpeg",
  "/media/Alt2.jpeg",
  "/media/Alt3.jpeg",
  "/media/Device_Closeup.jpeg",
  "/media/With_ToonTail.jpeg",
  "/media/Without_ToonTail.jpeg",
  "/media/ToonTail_Logo.jpeg",
];

// Default product image
const PRODUCT_IMAGE_DEFAULT = "/media/toontail_black_logo_watermarked.png";

// Merch images (placed directly in /public/media)
const MERCH = {
  hat: "/media/hat-toontail.png",
  tee: "/media/tee-front-back.png",
};

/* -------------------- PRODUCT / CART DATA -------------------- */
type Product = {
  id: string;
  name: string;
  subtitle?: string;
  status: "in_stock" | "coming_soon";
  priceCents?: number;
  compareAtCents?: number;
  saleLabel?: string;
  priceLabel?: string;
  paymentLink?: string;
  img?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "tt-mercury-250-350",
    name: "ToonTail for Mercury 250-400 HP",
    subtitle: "Verado & compatible models (pontoon/tritoon)",
    status: "in_stock",
    priceCents: 39999,
    compareAtCents: 49999,
    saleLabel: "Founders Run",
    // ⬇️ Replace with your live Stripe Payment Link
    paymentLink: "https://buy.stripe.com/4gMeVdfmT5cg63Ufwu9Ve00",
    img: PRODUCT_IMAGE_DEFAULT,
  },
  {
    id: "tt-trucker-hat",
    name: "ToonTail Trucker Hat — 'Got Tail ?'",
    subtitle: "Black/mesh snapback, embroidered TT mark",
    status: "in_stock",
    priceCents: 3999,
    paymentLink: "https://buy.stripe.com/dRm8wP8Yv34877Y5VU9Ve02",
    img: MERCH.hat,
  },
  {
    id: "tt-tee",
    name: "ToonTail Tee — 'Got Tail ?'",
    subtitle: "Unisex tee, front TT logo, back 'Got Tail ?'",
    status: "in_stock",
    priceCents: 2999,
    paymentLink: "https://buy.stripe.com/14A00jeiP48c3VM3NM9Ve01",
    img: MERCH.tee,
  },
  {
    id: "tt-yamaha-90-150",
    name: "ToonTail Mini - Yamaha 90-150 HP",
    subtitle: "Prototype - join waitlist",
    status: "coming_soon",
    img: PRODUCT_IMAGE_DEFAULT,
  },
  {
    id: "tt-yamaha-225-425",
    name: "ToonTail Magnum - Yamaha 225-425 HP",
    subtitle: "Prototype - join waitlist",
    status: "coming_soon",
    img: PRODUCT_IMAGE_DEFAULT,
  },
  {
    id: "tt-mercury-90-150",
    name: "ToonTail Mini - Mercury 90-150 HP",
    subtitle: "Prototype - join waitlist",
    status: "coming_soon",
    img: PRODUCT_IMAGE_DEFAULT,
  },
];

type CartLine = { productId: string; qty: number };

function loadCart(): CartLine[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem("tt_cart");
    return raw ? (JSON.parse(raw) as CartLine[]) : [];
  } catch {
    return [];
  }
}
function saveCart(lines: CartLine[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem("tt_cart", JSON.stringify(lines));
}
function formatCents(n?: number) {
  if (n == null) return "";
  return new Intl.NumberFormat(undefined, { style: "currency", currency: "USD" }).format(n / 100);
}

/* -------------------- FAQ DATA -------------------- */
const faq: { q: string; a: string }[] = [
  {
    q: "Will ToonTail affect performance or engine?",
    a: "Designed to leverage existing thrust aft of the prop without materially impacting normal engine characteristics; we target minimal speed impact at cruise. Always monitor engine temps and follow manufacturer guidelines.",
  },
  {
    q: "What engines/boats are supported?",
    a: "ToonTail currently works with select Mercury 250-400 HP outboards on pontoons and tritoons. Additional tails are in development for high-HP Yamaha motors and 90-150 HP Mercury/Yamaha motors.",
  },
  {
    q: "How is it installed?",
    a: "A reinforced, removable 316 stainless bracket clamps to the anti-ventilation plate or engine bracket. See installation instructions for torque specs and step-by-step.",
  },
  {
    q: "Can I tune the tail height and cleanliness?",
    a: "Yes: slight trim adjustments can significantly change the jet angle, giving you control over height and distance; an optional gill/interceptor (coming soon) can boost head pressure for taller tails.",
  },
  {
    q: "Is it made in the USA?",
    a: "You bet your Ass it is — designed and built by those Hot Dish fuled hard workin folks in Minnesota.",
  },
  {
    q: "Where can I buy one?",
    a: "Order the Mercury 250-400 HP model here. For other engines, join the waitlist to get in line for the Founder's run.",
  },
];

/* -------------------- UI HELPERS -------------------- */
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

function SliderRow({
  label,
  unit,
  value,
  onChange,
  min,
  max,
  step = 1,
}: {
  label: string;
  unit: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
}) {
  return (
    <div className="mt-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-sm text-slate-600">
          {value}
          {unit}
        </span>
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
        <span>
          {min}
          {unit}
        </span>
        <span>
          {max}
          {unit}
        </span>
      </div>
    </div>
  );
}

function MiniChart({ height, distance }: { height: number; distance: number }) {
  const H_MIN = 0,
    H_MAX = 60;
  const D_MIN = 0,
    D_MAX = 300;
  const w = 340,
    h = 160,
    pad = 20;

  const hC = Math.max(H_MIN, Math.min(H_MAX, height));
  const dC = Math.max(D_MIN, Math.min(D_MAX, distance));

  const x = pad + ((dC - D_MIN) / (D_MAX - D_MIN)) * (w - pad * 2);
  const y = h - pad - ((hC - H_MIN) / (H_MAX - H_MIN)) * (h - pad * 2);

  const x0 = pad,
    y0 = h - pad;
  const cx = x0 + (x - x0) / 2;
  const cy = y - 40 * (hC / (H_MAX || 1)) + 20;
  const strokeW = 4 + 4 * (hC / (H_MAX || 1));
  const path = `M ${x0} ${y0} Q ${cx} ${cy}, ${x} ${y}`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-40">
      <defs>
        <linearGradient id="jet" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#0ea5e9" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width={w} height={h} fill="#f8fafc" />
      <rect x="0" y={h - 12} width={w} height={12} fill="#94a3b8" opacity="0.3" />
      <path d={path} stroke="url(#jet)" strokeWidth={strokeW} fill="none" />
      <circle cx={x} cy={y} r="4" fill="#0ea5e9" />
      <text x="10" y="14" fontSize="10" fill="#334155">
        Tail arc (illustrative)
      </text>
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

/* -------------------- BRAND / NAV / HERO -------------------- */
function Logo({ className = "" }: { className?: string }) {
  return <img src={MEDIA.logo} alt="ToonTail" className={`${className} w-auto`} />;
}

function Nav({ onOpenCart }: { onOpenCart: () => void }) {
  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-white/60 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Logo className="h-8 w-8" />
          <span className="font-bold tracking-wide">ToonTail</span>
        </div>
        <nav className="hidden md:flex items-center gap-6 text-sm text-slate-700">
          <a href="#shop" className="hover:text-slate-900">Shop</a>
          <a href="#estimator" className="hover:text-slate-900">Estimator</a>
          <a href="#more-angles" className="hover:text-slate-900">More angles</a>
          <a href="#faq" className="hover:text-slate-900">FAQ</a>
          <button onClick={onOpenCart} className="px-3 py-2 rounded-xl border border-slate-300 hover:border-slate-400">Cart</button>
          <a href="#cta" className="px-3 py-2 rounded-2xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700">Join waitlist</a>
        </nav>
      </div>
    </header>
  );
}

function Hero({ onCtaClick }: { onCtaClick: () => void }) {
  const [which, setWhich] = useState<"before" | "after">("after");
  const src = which === "after" ? MEDIA.videoAfter : MEDIA.videoBefore;

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
            An efficient bolt-on jet that turns your tritoon’s slow wake into a clean, crowd-pleasing rooster tail.
          </p>
          <div className="mt-5 flex items-center gap-3">
            <button onClick={onCtaClick} className="px-5 py-3 rounded-2xl bg-sky-600 text-white font-medium shadow hover:bg-sky-700">Join waitlist</button>
            <a href="#shop" className="px-5 py-3 rounded-2xl border border-slate-300 font-medium hover:border-slate-400">Shop now</a>
          </div>
        </div>

        <div className="relative">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs uppercase tracking-wide text-slate-500">Hero video:</span>
            {(["before", "after"] as const).map((k) => (
              <button
                key={k}
                onClick={() => setWhich(k)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                  which === k ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"
                }`}
              >
                {k.toUpperCase()}
              </button>
            ))}
          </div>

          <div className="rounded-3xl overflow-hidden shadow ring-1 ring-slate-200">
            <div className="relative aspect-[16/9] w-full bg-black">
              <video
                key={src}
                poster={which === "after" ? MEDIA.posterAfter : MEDIA.posterBefore}
                className="absolute inset-0 h-full w-full object-contain"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
              >
                <source src={src.replace(".mov", ".mp4")} type="video/mp4" />
                <source src={src.replace(".mp4", ".mov")} type="video/quicktime" />
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* -------------------- WATERMARK -------------------- */
function Watermark() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
      <img src={MEDIA.logo} alt="" className="w-[90vw] max-w-[900px] opacity-5 blur-[0.5px] select-none" />
    </div>
  );
}

/* -------------------- SHOP -------------------- */
function Shop({ onAdd }: { onAdd: (p: Product) => void }) {
  return (
    <Section id="shop" title="Shop ToonTail" eyebrow="Order now or join the waitlist">
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {PRODUCTS.map((p) => (
          <div key={p.id} className="rounded-2xl border bg-white overflow-hidden flex flex-col">
            <div className="relative">
              <img src={p.img || PRODUCT_IMAGE_DEFAULT} alt={p.name} className="w-full aspect-[4/3] object-cover" />
              <img src={MEDIA.logo} alt="" className="pointer-events-none select-none absolute bottom-2 right-2 w-16 opacity-30" />
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-semibold text-lg">{p.name}</h3>
                <span className={`text-[11px] font-semibold px-2 py-1 rounded ${p.status === "in_stock" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}`}>
                  {p.status === "in_stock" ? "In stock" : "Coming soon"}
                </span>
              </div>

              {p.subtitle && <p className="text-sm text-slate-600 mt-1">{p.subtitle}</p>}

              <div className="mt-3 text-sm text-slate-700">
                {p.priceLabel ? (
                  <div className="font-medium">{p.priceLabel}</div>
                ) : p.priceCents != null ? (
                  p.compareAtCents && p.compareAtCents > p.priceCents ? (
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-semibold">{formatCents(p.priceCents)}</span>
                      <span className="line-through text-slate-400">{formatCents(p.compareAtCents)}</span>
                      <span className="text-emerald-700 text-[11px] font-semibold px-2 py-0.5 bg-emerald-100 rounded-full">{p.saleLabel || "Sale"}</span>
                    </div>
                  ) : (
                    <div className="font-medium">{formatCents(p.priceCents)}</div>
                  )
                ) : (
                  <div className="text-slate-500">Price TBD</div>
                )}
              </div>

              <div className="mt-4 flex gap-2">
                {p.status === "in_stock" ? (
                  <button onClick={() => onAdd(p)} className="flex-1 px-4 py-2 rounded-xl bg-sky-600 text-white font-medium hover:bg-sky-700">
                    Add to cart
                  </button>
                ) : (
                  <a className="flex-1 px-4 py-2 rounded-xl border font-medium hover:border-slate-400 text-center" href={`mailto:info@toontail.com?subject=ToonTail%20waitlist%20-%20${encodeURIComponent(p.name)}`}>
                    Join waitlist
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <p className="text-xs text-slate-500 mt-4">Taxes and shipping calculated at checkout. U.S. orders only for initial run.</p>
    </Section>
  );
}

/* -------------------- CART DRAWER (Stripe + PayPal/Venmo) -------------------- */
function CartDrawer({
  open,
  onClose,
  lines,
  setLines,
}: {
  open: boolean;
  onClose: () => void;
  lines: CartLine[];
  setLines: (ls: CartLine[]) => void;
}) {
  const items = lines
    .map((l) => ({ line: l, product: PRODUCTS.find((p) => p.id === l.productId)! }))
    .filter((x) => !!x.product);

  const hasMixed = items.length > 1;
  const canCheckout = items.length === 1 && !!items[0].product.paymentLink;

  const subtotalCents = items.reduce((sum, x) => sum + (x.product.priceCents || 0) * x.line.qty, 0);

  function updateQty(id: string, qty: number) {
    const next = lines.map((l) => (l.productId === id ? { ...l, qty } : l)).filter((l) => l.qty > 0);
    setLines(next);
    saveCart(next);
  }

  function remove(id: string) {
    const next = lines.filter((l) => l.productId !== id);
    setLines(next);
    saveCart(next);
  }

  function checkout() {
    if (!canCheckout) return;
    const { product } = items[0];

    if (!product.paymentLink) {
      alert("Checkout link is missing for this item.");
      return;
    }

    // Stripe Payment Link: direct redirect (Stripe page has qty controls)
    window.location.href = product.paymentLink;
  }

  // PayPal + Venmo
  const [paypalReady, setPaypalReady] = useState(false);
  const paypalContainerId = "paypal-buttons";
  const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "YOUR_CLIENT_ID";
  const shouldShowPayPal = open && items.length === 1 && subtotalCents > 0;

  useEffect(() => {
    if (!shouldShowPayPal) return;
    const hasSDK = typeof window !== "undefined" && (window as any).paypal;
    if (hasSDK) {
      setPaypalReady(true);
      return;
    }
    const script = document.createElement("script");
    script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&components=buttons&enable-funding=venmo`;
    script.async = true;
    script.onload = () => setPaypalReady(true);
    script.onerror = () => console.error("Failed to load PayPal SDK");
    document.body.appendChild(script);
  }, [shouldShowPayPal, PAYPAL_CLIENT_ID]);

  useEffect(() => {
    if (!paypalReady || !shouldShowPayPal) return;
    const paypal = (window as any).paypal;
    if (!paypal) return;

    const host = document.getElementById(paypalContainerId);
    if (!host) return;
    host.innerHTML = "";

    const amount = (subtotalCents / 100).toFixed(2);
    const { product } = items[0];
    const description = product.name;

    paypal
      .Buttons({
        style: { layout: "vertical", color: "blue", shape: "pill", label: "pay" },
        createOrder: (_data: any, actions: any) =>
          actions.order.create({
            purchase_units: [{ amount: { value: amount }, description }],
          }),
        onApprove: async (_data: any, actions: any) => {
          const details = await actions.order.capture();
          alert("Thanks! Payment ID: " + details.id);
          setLines([]);
          saveCart([]);
          onClose();
        },
        onError: (err: any) => {
          console.error("PayPal error", err);
          alert("Payment failed. Please try again or use the card checkout.");
        },
      })
      .render(`#${paypalContainerId}`);
  }, [paypalReady, shouldShowPayPal, subtotalCents, items, setLines, onClose]);

  return (
    <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div className={`absolute inset-0 bg-slate-900/40 transition-opacity ${open ? "opacity-100" : "opacity-0"}`} onClick={onClose} />
      <aside className={`absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white shadow-xl transition-transform duration-300 ${open ? "translate-x-0" : "translate-x-full"}`}>
        <div className="p-5 border-b flex items-center justify-between">
          <h3 className="font-semibold text-lg">Cart</h3>
          <button onClick={onClose} className="text-slate-500 hover:text-slate-700">✕</button>
        </div>

        <div className="p-5 space-y-4 overflow-auto h-[calc(100%-260px)]">
          {items.length === 0 && <p className="text-slate-600">Your cart is empty.</p>}
          {items.map(({ line, product }) => (
            <div key={product.id} className="flex gap-3 items-center">
              {product.img && <img src={product.img} alt={product.name} className="w-20 h-20 object-cover rounded-lg border" />}
              <div className="flex-1 min-w-0">
                <div className="font-medium truncate">{product.name}</div>
                <div className="text-sm text-slate-500">{product.priceLabel || (product.priceCents != null ? formatCents(product.priceCents) : "Price TBD")}</div>
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-xs text-slate-500">Qty</label>
                  <input
                    type="number"
                    min={1}
                    value={line.qty}
                    onChange={(e) => updateQty(product.id, Math.max(1, Number(e.target.value) || 1))}
                    className="w-16 rounded border px-2 py-1"
                  />
                  <button onClick={() => remove(product.id)} className="ml-auto text-xs text-slate-500 hover:text-slate-700">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 border-t space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-slate-600">Subtotal</span>
            <span className="font-medium">{subtotalCents ? formatCents(subtotalCents) : "—"}</span>
          </div>

          {hasMixed && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded p-2">
              Stripe/PayPal checkout supports one item type at a time. Please remove extra items.
            </p>
          )}
          {!hasMixed && !canCheckout && items.length === 1 && (
            <p className="text-xs text-slate-600">This item uses a waitlist or has no payment link yet. Use the waitlist button on the product card.</p>
          )}

          <div className="grid gap-2">
            <button
              disabled={!canCheckout}
              onClick={checkout}
              className={`w-full px-4 py-3 rounded-xl font-semibold shadow ${
                canCheckout ? "bg-sky-600 text-white hover:bg-sky-700" : "bg-slate-200 text-slate-500 cursor-not-allowed"
              }`}
            >
              Checkout (Card / Apple / Google)
            </button>

            {/* PayPal + Venmo Buttons mount here (only when one item + subtotal) */}
            <div id="paypal-buttons" className="w-full" />
            <p className="text-[11px] text-slate-500">PayPal also shows Venmo for eligible U.S. buyers.</p>
          </div>

          <p className="text-[11px] text-slate-500 mt-1">By checking out you agree to our Safety & Legal terms. Taxes & shipping calculated at checkout.</p>
        </div>
      </aside>
    </div>
  );
}

/* -------------------- MAIN PAGE -------------------- */
function ToonTailLanding() {
  const [estimator, setEstimator] = useState({ speedMph: 30, horsepower: 350, trimDeg: 10 });
  const [cartOpen, setCartOpen] = useState(false);
  const [lines, setLines] = useState<CartLine[]>([]);

  useEffect(() => {
    setLines(loadCart());
  }, []);

  const estimation = useMemo(() => {
    const v = Math.max(5, estimator.speedMph);
    const hp = Math.max(50, estimator.horsepower);
    const trim = Math.max(0, Math.min(20, estimator.trimDeg));

    const H_BASE = 35,
      D_BASE = 110;
    const ALPHA_H = 0.7,
      BETA_H = 0.25,
      TRIM_H = 0.04;
    const ALPHA_D = 1.0,
      BETA_D = 0.2,
      TRIM_D = -0.015;

    const hTrim = Math.max(0.2, 1 + TRIM_H * (trim - 10));
    const dTrim = Math.max(0.2, 1 + TRIM_D * (trim - 10));

    const height = H_BASE * Math.pow(v / 30, ALPHA_H) * Math.pow(hp / 350, BETA_H) * hTrim;
    const dist = D_BASE * Math.pow(v / 30, ALPHA_D) * Math.pow(hp / 350, BETA_D) * dTrim;

    return {
      heightFt: Math.round(Math.min(60, Math.max(0, height))),
      distanceFt: Math.round(Math.min(300, Math.max(1, dist))),
    };
  }, [estimator]);

  function addToCart(p: Product) {
    if (lines.length > 0 && lines[0].productId !== p.id) {
      const single = [{ productId: p.id, qty: 1 }];
      setLines(single);
      saveCart(single);
      setCartOpen(true);
      return;
    }
    const existing = lines.find((l) => l.productId === p.id);
    const next: CartLine[] = existing
      ? lines.map((l) => (l.productId === p.id ? { ...l, qty: l.qty + 1 } : l))
      : [...lines, { productId: p.id, qty: 1 }];
    setLines(next);
    saveCart(next);
    setCartOpen(true);
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-50 via-white to-white text-slate-900">
      <Watermark />

      <div className="relative z-10">
        <Nav onOpenCart={() => setCartOpen(true)} />
        <Hero onCtaClick={() => document.getElementById("estimator")?.scrollIntoView({ behavior: "smooth" })} />

        <Section id="how" title="What is ToonTail?" eyebrow="Turn wake into wow">
          <p className="text-lg md:text-xl max-w-3xl">
            ToonTail is a bolt-on water-jet accessory engineered for pontoons and tritoons. It captures a small amount of thrust from the prop and
            redirects it through a tuned, efficient outlet to create a clean, dramatic rooster tail — without sacrificing performance. Got tail? Get ToonTail!
          </p>
        </Section>

        <Shop onAdd={addToCart} />

        <Section id="estimator" title="Tail estimator (beta)" eyebrow="Dial it in">
          <div className="grid md:grid-cols-2 gap-6 items-start">
            <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
              <SliderRow label="Boat speed" unit="mph" min={10} max={60} step={1} value={estimator.speedMph} onChange={(v) => setEstimator((s) => ({ ...s, speedMph: v }))} />
              <SliderRow label="Horsepower" unit="hp" min={90} max={450} step={10} value={estimator.horsepower} onChange={(v) => setEstimator((s) => ({ ...s, horsepower: v }))} />
              <SliderRow label="Motor trim" unit="°" min={0} max={15} step={1} value={estimator.trimDeg} onChange={(v) => setEstimator((s) => ({ ...s, trimDeg: v }))} />
              <p className="text-xs text-slate-500 mt-3">Performance may vary due to pontoon size, prop size, weight and motor depth.</p>
            </div>

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

        <Section id="faq" title="Frequently asked questions" eyebrow="Quick answers">
          <div className="mx-auto max-w-3xl">
            {faq.map((item, i) => (
              <details key={i} className="group border-b py-4">
                <summary className="flex cursor-pointer list-none items-start justify-between">
                  <span className="font-medium text-slate-900">{item.q}</span>
                  <span className="ml-4 select-none text-slate-400 transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-2 text-slate-700">{item.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="cta" title="Join the waitlist" eyebrow="Get updates first">
          <div className="p-6 rounded-2xl bg-white shadow-sm border border-slate-100">
            <p className="text-slate-700">
              Email <a className="underline" href="mailto:info@toontail.com">info@toontail.com</a> to join the Founder's run.
            </p>
          </div>
        </Section>

        <Footer />
      </div>

      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} lines={lines} setLines={setLines} />
    </div>
  );
}

/* -------------------- VIDEO CARD (SECONDARY) -------------------- */
function HeroVideo() {
  const [which, setWhich] = useState<"before" | "after">("after");
  const src = which === "after" ? MEDIA.videoAfter : MEDIA.videoBefore;

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs uppercase tracking-wide text-slate-500">Toggle:</span>
        {(["before", "after"] as const).map((k) => (
          <button
            key={k}
            onClick={() => setWhich(k)}
            className={`px-3 py-1 rounded-full text-xs font-semibold border ${which === k ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-300 hover:border-slate-400"}`}
          >
            {k.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="rounded-2xl overflow-hidden border">
        <div className="relative aspect-[16/9] w-full bg-black">
          <video
            key={src}
            poster={which === "after" ? MEDIA.posterAfter : MEDIA.posterBefore}
            className="absolute inset-0 h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
          >
            <source src={src.replace(".mov", ".mp4")} type="video/mp4" />
            <source src={src.replace(".mp4", ".mov")} type="video/quicktime" />
          </video>
        </div>
      </div>
    </div>
  );
}

/* -------------------- FOOTER -------------------- */
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

/* -------------------- EXPORT -------------------- */
export default function Page(): JSX.Element {
  return <ToonTailLanding />;
}
