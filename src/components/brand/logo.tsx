"use client";

import Link from "next/link";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
  showWordmark?: boolean;
  showBeta?: boolean;
}

const sizes = {
  sm: { box: 28, icon: 14, stroke: 2, dot: 1.2, text: "text-base" },
  md: { box: 32, icon: 18, stroke: 2.2, dot: 1.5, text: "text-lg" },
  lg: { box: 40, icon: 22, stroke: 2.5, dot: 1.8, text: "text-xl" },
};

export function HelmIcon({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const s = sizes[size];
  const b = s.box;
  const i = s.icon;

  return (
    <div
      className="rounded-lg bg-orange-500 shadow-lg shadow-orange-500/25 flex items-center justify-center shrink-0 transition-all duration-300 hover:shadow-orange-500/50 hover:scale-105"
      style={{ width: b, height: b }}
    >
      <svg width={i} height={i} viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Left vertical */}
        <line x1="5" y1="4" x2="5" y2="14"
          stroke="white" strokeWidth={s.stroke} strokeLinecap="round"/>
        {/* Right vertical */}
        <line x1="13" y1="4" x2="13" y2="14"
          stroke="white" strokeWidth={s.stroke} strokeLinecap="round"/>
        {/* Crossbar */}
        <line x1="5" y1="9" x2="13" y2="9"
          stroke="white" strokeWidth={s.stroke} strokeLinecap="round"/>
        {/* Corner dots — pulse animation */}
        <circle cx="5" cy="4" r={s.dot} fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0s"/>
        </circle>
        <circle cx="13" cy="4" r={s.dot} fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="0.5s"/>
        </circle>
        <circle cx="5" cy="14" r={s.dot} fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="1s"/>
        </circle>
        <circle cx="13" cy="14" r={s.dot} fill="white">
          <animate attributeName="opacity" values="1;0.4;1" dur="2s" repeatCount="indefinite" begin="1.5s"/>
        </circle>
        {/* Center dot — faster pulse */}
        <circle cx="9" cy="9" r={s.dot * 0.8} fill="none" stroke="white" strokeWidth={s.stroke * 0.6}>
          <animate attributeName="opacity" values="0.4;1;0.4" dur="1.5s" repeatCount="indefinite"/>
        </circle>
      </svg>
    </div>
  );
}

export default function Logo({
  size = "md",
  href = "/",
  showWordmark = true,
  showBeta = false,
}: LogoProps) {
  const s = sizes[size];

  const content = (
    <div className="flex items-center gap-2.5">
      <HelmIcon size={size} />
      {showWordmark && (
        <span className={`text-white font-semibold tracking-tight ${s.text}`}>
          Helm
        </span>
      )}
      {showBeta && (
        <span className="text-[10px] bg-orange-500/15 text-orange-400 border border-orange-500/20 px-2 py-0.5 rounded-full font-medium">
          Beta
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}