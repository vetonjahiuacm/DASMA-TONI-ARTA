import React from "react";
import { Quote, Heart } from "lucide-react";
import { FloralDivider } from "./Ornaments";

const Wishes = ({ wishes = [] }) => {
  return (
    <section className="max-w-4xl mx-auto px-6 py-16">
      <h2 className="text-center font-script text-5xl text-[#2b2724] mb-2">Fjalët e Mira</h2>
      <FloralDivider className="mb-4" />
      <p className="text-center font-serif-el italic text-[#8a8175] mb-10">
        Urimet e dashura nga të ftuarit tanë
      </p>

      {wishes.length === 0 ? (
        <div className="text-center py-10">
          <Heart className="w-7 h-7 mx-auto text-[#b09a6b]" strokeWidth={1.2} />
          <p className="font-serif-el text-lg text-[#8a8175] mt-4">
            Bëhuni të parët që lini një urim të bukur
          </p>
        </div>
      ) : (
        <div className="columns-1 md:columns-2 gap-5">
          {wishes.map((w) => (
            <div
              key={w.id}
              className="mb-5 break-inside-avoid bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-7 lift relative"
            >
              <Quote className="w-6 h-6 text-[#d8c9a3]" strokeWidth={1.2} />
              <p className="font-serif-el text-lg text-[#2b2724] italic leading-relaxed mt-3">
                {w.message}
              </p>
              <div className="flex items-center gap-2 mt-5">
                <span className="w-8 divider-line" />
                <span className="font-script text-2xl text-[#b09a6b]">{w.name}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
};

export default Wishes;
