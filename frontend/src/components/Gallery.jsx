import React, { useRef, useState } from "react";
import { getPhotos, savePhotos, removePhoto, compressImage } from "../mock";
import { ImagePlus, X, Heart, Loader2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { FloralDivider } from "./Ornaments";

const Gallery = () => {
  const [photos, setPhotos] = useState(getPhotos());
  const [uploading, setUploading] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const inputRef = useRef(null);

  const handleFiles = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const current = getPhotos();
      const added = [];
      for (const file of files) {
        if (!file.type.startsWith("image/")) continue;
        const src = await compressImage(file);
        added.push({ id: `${Date.now()}-${Math.random().toString(36).slice(2)}`, src });
      }
      const next = [...current, ...added];
      savePhotos(next);
      setPhotos(next);
      toast.success(
        added.length > 1 ? `${added.length} foto u shtuan` : "Fotoja u shtua"
      );
    } catch (err) {
      toast.error("Hapësira e ruajtjes u mbush. Provoni me më pak foto.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = (id, ev) => {
    ev.stopPropagation();
    setPhotos(removePhoto(id));
    toast.success("Fotoja u fshi");
  };

  return (
    <section className="max-w-5xl mx-auto px-6 py-12">
      <h2 className="text-center font-script text-5xl text-[#2b2724] mb-2">Momentet Tona</h2>
      <FloralDivider className="mb-8" />

      {photos.length === 0 ? (
        <div
          onClick={() => inputRef.current && inputRef.current.click()}
          className="cursor-pointer rounded-sm border border-dashed border-[#cfc3ab] bg-[#faf8f3] py-16 flex flex-col items-center justify-center hover:border-[#b09a6b] transition-colors"
        >
          <Heart className="w-7 h-7 text-[#b09a6b]" strokeWidth={1.2} />
          <p className="font-serif-el text-xl text-[#2b2724] mt-4">Shtoni fotot tuaja të bukura</p>
          <p className="font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175] mt-2">
            Kliko për të ngarkuar
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
                alt={`Foto ${i + 1}`}
                className="w-full block transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <button
                onClick={(e) => handleRemove(p.id, e)}
                className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/85 backdrop-blur flex items-center justify-center text-[#9a5b5b] opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Fshi foton"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="text-center mt-8">
        <button
          onClick={() => inputRef.current && inputRef.current.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#2b2724] border border-[#b09a6b] px-8 py-4 rounded-sm hover:bg-[#b09a6b] hover:text-white transition-colors duration-300 disabled:opacity-60"
        >
          {uploading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Duke ngarkuar...
            </>
          ) : (
            <>
              <ImagePlus className="w-4 h-4" strokeWidth={1.4} /> Ngarko Foto
            </>
          )}
        </button>
        <p className="font-serif-el italic text-[#a89f90] text-sm mt-3">
          Fotot ruhen në këtë pajisje
        </p>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={handleFiles}
      />

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
