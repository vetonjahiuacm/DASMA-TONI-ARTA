import React from "react";
import { Armchair, Users } from "lucide-react";

const SeatCounter = ({ seats }) => {
  if (!seats) return null;
  const { total, confirmedGuests, remaining } = seats;
  const pct = total > 0 ? Math.min(100, Math.round((confirmedGuests / total) * 100)) : 0;

  return (
    <div className="max-w-md mx-auto text-center">
      <div className="inline-flex items-center gap-3 justify-center">
        <Armchair className="w-6 h-6 text-[#b09a6b]" strokeWidth={1.3} />
        <span className="font-serif-el text-5xl text-[#2b2724] tabular-nums">{remaining}</span>
        <span className="font-serif-el text-2xl text-[#a89f90]">/ {total}</span>
      </div>
      <p className="font-sans-el text-[10px] tracking-[0.25em] uppercase text-[#8a8175] mt-2">
        Vende të lira të mbetura
      </p>

      <div className="mt-5 h-[6px] w-full rounded-full bg-[#e4ded1] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "linear-gradient(to right,#c9b382,#b09a6b)" }}
        />
      </div>
      <p className="font-serif-el italic text-[#8a8175] mt-3 text-sm inline-flex items-center gap-2 justify-center">
        <Users className="w-4 h-4 text-[#b09a6b]" strokeWidth={1.3} />
        {confirmedGuests} mysafirë kanë konfirmuar
      </p>
    </div>
  );
};

export default SeatCounter;
