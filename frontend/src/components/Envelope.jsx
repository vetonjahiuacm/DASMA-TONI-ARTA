import React, { useState } from "react";
import { eventData } from "../mock";
import { Petals, Sprig } from "./Ornaments";

const Envelope = ({ onOpen }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (open) return;
    setOpen(true);
    setTimeout(() => onOpen && onOpen(), 1650);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-16 relative">
      <Petals count={12} />

      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center relative z-10">
        {/* Left: greeting */}
        <div className="text-center md:text-left order-2 md:order-1 relative">
          <Sprig className="hidden md:block absolute -left-16 top-6 opacity-70" />
          <p className="font-sans-el text-[11px] md:text-xs tracking-wide-lux uppercase text-[#5c554c] anim-fade-up">
            Keni një ftesë
          </p>
          <p className="font-serif-el italic text-lg md:text-xl text-[#8a8175] mt-1 anim-fade-up delay-1">
            prej:
          </p>
          <h1 className="font-script text-6xl md:text-8xl leading-[0.9] mt-4 text-[#2b2724] anim-fade-up delay-2">
            {eventData.groom} <span className="gold-text">&amp;</span>
          </h1>
          <h1 className="font-script text-6xl md:text-8xl leading-[0.9] text-[#2b2724] anim-fade-up delay-3">
            {eventData.bride}
          </h1>
          <div className="divider-line w-40 mx-auto md:mx-0 mt-8 anim-fade-up delay-4" />
          <p className="font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#8a8175] mt-6 anim-fade-up delay-5">
            {eventData.dateShort} &middot; {eventData.time}
          </p>
        </div>

        {/* Right: envelope */}
        <div className="flex flex-col items-center order-1 md:order-2">
          <div
            className={`envelope-wrap floaty cursor-pointer select-none ${open ? "env-open" : ""}`}
            onClick={handleClick}
            role="button"
            aria-label="Hap zarfin"
          >
            <div className="relative" style={{ width: 400, maxWidth: "84vw", aspectRatio: "5/3.7" }}>
              {/* envelope body */}
              <div className="absolute inset-0 rounded-md shadow-2xl"
                style={{ background: "linear-gradient(155deg,#efe9dd 0%,#e2dccf 55%,#d6cebd 100%)" }} />

              {/* letter inside */}
              <div className="env-letter absolute left-[6%] right-[6%] top-[9%] bottom-[6%] rounded-[3px] bg-[#fbf9f4] shadow-md flex flex-col items-center justify-center z-0 border border-[#efe6d5]">
                <p className="font-sans-el text-[9px] tracking-[0.35em] uppercase text-[#a89f90]">Ftesë Dasme</p>
                <p className="font-script text-5xl gold-text mt-1">{eventData.initials}</p>
                <div className="divider-line w-16 mt-2" />
              </div>

              {/* bottom + side body panels (in front of letter) */}
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{
                  clipPath: "polygon(0 40%, 50% 100%, 100% 40%, 100% 100%, 0 100%)",
                  background: "linear-gradient(155deg,#e5dfd1,#d2cab8)",
                }} />
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{ clipPath: "polygon(0 2%, 0 100%, 50% 56%)", background: "linear-gradient(120deg,#eae4d7,#d9d2c3)" }} />
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{ clipPath: "polygon(100% 2%, 100% 100%, 50% 56%)", background: "linear-gradient(240deg,#eae4d7,#d9d2c3)" }} />

              {/* TOP FLAP with scalloped lace edge (SVG) */}
              <div className="env-flap absolute inset-x-0 top-0 z-[3] lace-shadow" style={{ height: "64%" }}>
                <svg viewBox="0 0 200 130" preserveAspectRatio="none" className="w-full h-full">
                  <defs>
                    <linearGradient id="flapg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stopColor="#f0eadd" />
                      <stop offset="1" stopColor="#ddd6c7" />
                    </linearGradient>
                  </defs>
                  {/* flap triangle */}
                  <path d="M0 0 L200 0 L100 118 Z" fill="url(#flapg)" />
                  {/* lace scallops along both diagonals */}
                  <g fill="#fbf9f4" opacity="0.92">
                    {Array.from({ length: 12 }).map((_, i) => {
                      const t = i / 11;
                      const lx = t * 100, ly = t * 118;
                      const rx = 200 - t * 100, ry = t * 118;
                      return (
                        <g key={i}>
                          <circle cx={lx} cy={ly} r="3.4" />
                          <circle cx={rx} cy={ry} r="3.4" />
                        </g>
                      );
                    })}
                  </g>
                  {/* delicate lace lines */}
                  <g stroke="#ffffff" strokeWidth="0.7" opacity="0.5">
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={i} x1={100} y1={10 + i * 4} x2={20 + i * 10} y2={10 + i * 12} />
                    ))}
                    {Array.from({ length: 8 }).map((_, i) => (
                      <line key={"r" + i} x1={100} y1={10 + i * 4} x2={180 - i * 10} y2={10 + i * 12} />
                    ))}
                  </g>
                </svg>
              </div>

              {/* pearl */}
              <div className="pearl absolute left-1/2 -translate-x-1/2 rounded-full z-[4]"
                style={{ width: 16, height: 16, top: "58%" }} />

              {/* label */}
              {!open && (
                <div className="absolute inset-x-0 bottom-[15%] z-[5] text-center">
                  <span className="font-sans-el text-xs md:text-sm tracking-[0.3em] uppercase text-[#3a352e]">
                    Kliko Zarfin
                  </span>
                </div>
              )}
            </div>
          </div>

          {!open && (
            <p className="font-serif-el italic text-[#8a8175] mt-7 text-base anim-fade-up delay-5">
              Prekni zarfin për ta hapur ftesën
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Envelope;
