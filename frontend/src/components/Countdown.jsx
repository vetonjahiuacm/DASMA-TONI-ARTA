import React, { useEffect, useState } from "react";
import { eventData } from "../mock";

const pad = (n) => String(n).padStart(2, "0");

const Countdown = () => {
  const target = new Date(eventData.dateISO).getTime();
  const calc = () => {
    const diff = Math.max(0, target - Date.now());
    const d = Math.floor(diff / 86400000);
    const h = Math.floor((diff % 86400000) / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    return { d, h, m, s };
  };
  const [t, setT] = useState(calc());

  useEffect(() => {
    const id = setInterval(() => setT(calc()), 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line
  }, []);

  const items = [
    { v: t.d, l: "Ditë" },
    { v: pad(t.h), l: "Orë" },
    { v: pad(t.m), l: "Minuta" },
    { v: pad(t.s), l: "Sekonda" },
  ];

  return (
    <div className="flex items-start justify-center gap-4 md:gap-8">
      {items.map((it, i) => (
        <div key={i} className="text-center">
          <div className="font-serif-el text-3xl md:text-5xl font-light text-[#2b2724] tabular-nums">
            {it.v}
          </div>
          <div className="font-sans-el text-[9px] md:text-[10px] tracking-[0.25em] uppercase text-[#8a8175] mt-1">
            {it.l}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Countdown;
