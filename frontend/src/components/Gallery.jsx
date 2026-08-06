import React, { useState } from "react";
import { X, Heart } from "lucide-react";
import { FloralDivider } from "./Ornaments";

// Auto-load every image placed in src/assets/gallery (no upload needed).
function loadGalleryImages() {
  try {
    const ctx = require.context("../assets/gallery", false, /\.(png|jpe?g|webp|gif)$/i);
    return ctx
      .keys()
      .sort()
      .map((key) => ({ id: key, src: ctx(key).default || ctx(key) }));
  } catch (e) {
    return [];
  }
}

const Gallery = () => {
  const photos = loadGalleryImages();
  const [lightbox, setLightbox] = useState(null);

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-center font-script text-5xl text-[#2b2724] mb-2">Momentet Tona</h2>
      <FloralDivider className="mb-8" />

      {photos.length === 0 ? (
        <div className="rounded-sm border border-dashed border-[#cfc3ab] bg-[#faf8f3] py-16 flex flex-col items-center justify-center text-center px-6">
          <Heart className="w-7 h-7 text-[#b09a6b]" strokeWidth={1.2} />
          <p className="font-serif-el text-xl text-[#2b2724] mt-4">Fotot tona së shpejti</p>
          <p className="font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175] mt-2">
            Momente të bukura që do t&rsquo;i ndajmë me ju
          </p>
        </div>
      ) : (
        <div className="columns-2 md:columns-3 gap-3 [column-fill:_balance]">
          {photos.map((p, i) => (
            <div
              key={p.id}
              className="group relative mb-3 break-inside-avoid overflow-hidden rounded-sm border border-[#e2dccf] cursor-pointer lift"
              onClick={() => setLightbox(p.src)}
            >
              <img
                src={p.src}
                alt={`Momenti ${i + 1}`}
                className="w-full block transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
            </div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-6 anim-fade-up"
          onClick={() => setLightbox(null)}
        >
          <button
            className="absolute top-6 right-6 w-11 h-11 rounded-full bg-white/15 text-white flex items-center justify-center hover:bg-white/30 transition-colors"
            aria-label="Mbyll"
          >
            <X className="w-5 h-5" />
          </button>
          <img
            src={lightbox}
            alt="Foto"
            className="max-h-[85vh] max-w-full rounded-sm shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </section>
  );
};

export default Gallery;
