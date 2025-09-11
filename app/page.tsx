"use client";

import React, { useEffect, useMemo, useState } from "react";

/* -------------------- MEDIA -------------------- */
/* Update these names to match /public/media exactly (case-sensitive) */
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

// Default product image (watermarked black-on-white)
const PRODUCT_IMAGE_DEFAULT = "/media/toontail_black_logo_watermarked.png";

// If you placed merch images directly in /public/media (no subfolder):
const MERCH = {
  hat: "/media/hat-toontail.png",
  tee: "/media/tee-front-back.png",
};

/* -------------------- PRODUCT / CART DATA -------------------- */
export type Product = {
  id: string;
  name: string;
  subtitle?: string;
  status: "in_stock" | "coming_soon";
  priceCents?: number;        // used for subtotal & PayPal
  compareAtCents?: number;    // regular price (strikethrough)
  saleLabel?: string;         // e.g., "Founders Run"
  priceLabel?: string;        // overrides price display if set
  paymentLink?: string;       // Stripe Payment Link
  img?: string;
};

const PRODUCTS: Product[] = [
  {
    id: "tt-mercury-250-350",
    name: "ToonTail for Mercury 250–400 HP",
    subtitle: "Verado & compatible models (pontoon/tritoon)",
    status: "in_stock",
    priceCents: 39999,
    compareAtCents: 49999,
    saleLabel: "Founders Run",
    // ⬇️ Paste your real Stripe Payment Link here
    paymentLink: "https://buy.stripe.com/REPLACE_WITH_YOUR_LINK",
    img: PRODUCT_IMAGE_DEFAULT,
  },
  {
    id: "tt-trucker-hat",
    name: "ToonTail Trucker Hat — 'Got Tail ?'",
    subtitle: "Black/mesh snapback, embroidered TT mark",
    status: "in_stock",
    priceCents: 3999, // $39.99
    // Optional: Stripe Payment Link for the hat
    paymentLink: "https://buy.stripe.com/REPLACE_WITH_HAT_LINK",
    img: MERCH.hat,
  },
  {
    id: "tt-tee",
    name: "ToonTail Tee — 'Got Tail ?'",
    subtitle: "Unisex tee, front TT logo, back 'Got Tail ?'",
    status: "in_stock",
    priceCents: 2999, // $29.99
    // Optional: Stripe Payment Link for the tee
    paymentLink: "https://buy.stripe.com/REPLACE_WITH_TEE_LINK",
    img: MERCH.tee,
  },
  {
    id: "tt-yamaha-90-150",
    name: "ToonTail Mini — Yamaha 90–150 HP",
    subtitle: "Prototype — join waitlist",
    status: "coming_soon",
    img: PRODUCT_IMAGE_DEFAULT,
  },
  {
    id: "tt-yamaha-225-425",
    name: "ToonTail Magnum — Yamaha 225–425 HP",
    subtitle: "Prototype — join waitlist",
    status: "coming_soon",
    img: PRODUCT_IMAGE_DEFAULT,
  },
  {
    id: "tt-mercury-90-150",
    name: "ToonTail Min
