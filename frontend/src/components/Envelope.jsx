import React, { useState } from "react";
import { eventData } from "../mock";

const Envelope = ({ onOpen }) => {
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    if (open) return;
    setOpen(true);
    // let the opening animation play, then reveal invitation
    setTimeout(() => onOpen && onOpen(), 1650);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-8 items-center">
        {/* Left: greeting */}
        <div className="text-center md:text-left order-2 md:order-1">
          <p className="font-sans-el text-[11px] md:text-xs tracking-wide-lux uppercase text-[#5c554c] anim-fade-up">
            Keni një ftesë
          </p>
          <p className="font-serif-el italic text-lg md:text-xl text-[#5c554c] mt-1 anim-fade-up delay-1">
            prej:
          </p>
          <h1 className="font-script text-6xl md:text-8xl leading-[0.9] mt-4 text-[#2b2724] anim-fade-up delay-2">
            {eventData.groom} &amp;
          </h1>
          <h1 className="font-script text-6xl md:text-8xl leading-[0.9] text-[#2b2724] anim-fade-up delay-3">
            {eventData.bride}
          </h1>
          <div className="divider-line w-40 mx-auto md:mx-0 mt-8 anim-fade-up delay-4" />
          <p className="font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#8a8175] mt-6 anim-fade-up delay-5">
            {eventData.dateShort} · {eventData.time}
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
            <div className="relative" style={{ width: 380, maxWidth: "82vw", aspectRatio: "5/4" }}>
              {/* envelope back / body */}
              <div className="absolute inset-0 rounded-md shadow-2xl"
                style={{ background: "linear-gradient(160deg,#e7e1d5,#d9d2c4)" }} />

              {/* letter inside */}
              <div className="env-letter absolute left-[6%] right-[6%] top-[10%] bottom-[6%] rounded-sm bg-[#faf8f3] shadow-md flex flex-col items-center justify-center z-0">
                <p className="font-sans-el text-[9px] tracking-[0.3em] uppercase text-[#8a8175]">Ftesë</p>
                <p className="font-script text-4xl text-[#2b2724] mt-1">{eventData.initials}</p>
              </div>

              {/* bottom body overlapping letter */}
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{
                  clipPath: "polygon(0 38%, 50% 100%, 100% 38%, 100% 100%, 0 100%)",
                  background: "linear-gradient(160deg,#e2dccf,#cfc7b6)",
                }} />
              {/* left/right triangles */}
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{
                  clipPath: "polygon(0 0, 0 100%, 50% 55%)",
                  background: "linear-gradient(120deg,#e7e1d5,#d5cec0)",
                }} />
              <div className="absolute inset-0 z-[2] pointer-events-none"
                style={{
                  clipPath: "polygon(100% 0, 100% 100%, 50% 55%)",
                  background: "linear-gradient(240deg,#e7e1d5,#d5cec0)",
                }} />

              {/* top flap with lace */}
              <div className="env-flap absolute inset-x-0 top-0 z-[3]" style={{ height: "62%" }}>
                <div className="w-full h-full"
                  style={{
                    clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                    background: "linear-gradient(160deg,#ece6da,#ddd6c8)",
                  }}>
                  {/* lace hint along the diagonal */}
                  <div className="w-full h-full opacity-70"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                      background:
                        "repeating-linear-gradient(160deg, transparent 0 14px, rgba(255,255,255,0.55) 14px 16px)",
                    }} />
                </div>
              </div>

              {/* pearl */}
              <div className="pearl absolute left-1/2 -translate-x-1/2 rounded-full z-[4]"
                style={{ width: 16, height: 16, top: "56%" }} />

              {/* label */}
              {!open && (
                <div className="absolute inset-x-0 bottom-[16%] z-[5] text-center">
                  <span className="font-sans-el text-xs md:text-sm tracking-[0.28em] uppercase text-[#3a352e]">
                    Kliko Zarfin
                  </span>
                </div>
              )}
            </div>
          </div>

          {!open && (
            <p className="font-serif-el italic text-[#8a8175] mt-6 text-sm anim-fade-up delay-5">
              Prekni zarfin për ta hapur ftesën
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Envelope;
