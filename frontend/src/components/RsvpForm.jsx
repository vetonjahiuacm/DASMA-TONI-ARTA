import React, { useState } from "react";
import { submitRsvp } from "../api";
import { toast } from "sonner";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Check, X, Heart, Loader2 } from "lucide-react";

const RsvpForm = ({ onSubmitted }) => {
  const [name, setName] = useState("");
  const [attending, setAttending] = useState(null); // 'yes' | 'no'
  const [guests, setGuests] = useState(1);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Ju lutemi shkruani emrin tuaj");
      return;
    }
    if (attending === null) {
      toast.error("Ju lutemi zgjidhni nëse do të vini");
      return;
    }
    setLoading(true);
    try {
      const res = await submitRsvp({
        name: name.trim(),
        attending,
        guests: attending === "yes" ? Number(guests) : 0,
        message: message.trim(),
      });
      setSubmitted(true);
      toast.success("Faleminderit! Konfirmimi u regjistrua.");
      if (onSubmitted) onSubmitted(res.seats);
    } catch (err) {
      toast.error("Diçka shkoi keq. Ju lutemi provoni sërish.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="text-center bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-10 anim-fade-up">
        <Heart className="w-8 h-8 mx-auto text-[#b09a6b]" strokeWidth={1.2} />
        <h3 className="font-script text-4xl text-[#2b2724] mt-4">Faleminderit!</h3>
        <p className="font-serif-el text-lg text-[#5c554c] mt-3">
          {attending === "yes"
            ? "Jemi shumë të lumtur që do të jeni pranë nesh."
            : "Na vjen keq që nuk mund të vini. Ju kujtojmë me dashuri."}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-8 md:p-10 space-y-6">
      <div>
        <Label className="font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175]">Emri dhe Mbiemri</Label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Emri juaj"
          className="mt-2 bg-white border-[#d8d0c1] font-serif-el text-lg focus-visible:ring-[#b09a6b]"
        />
      </div>

      <div>
        <Label className="font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175]">A do të jeni pranë?</Label>
        <div className="grid grid-cols-2 gap-4 mt-3">
          <button
            type="button"
            onClick={() => setAttending("yes")}
            className={`flex items-center justify-center gap-2 py-4 rounded-sm border font-sans-el text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              attending === "yes"
                ? "bg-[#b09a6b] text-white border-[#b09a6b]"
                : "bg-white text-[#2b2724] border-[#d8d0c1] hover:border-[#b09a6b]"
            }`}
          >
            <Check className="w-4 h-4" /> Po, do të vij
          </button>
          <button
            type="button"
            onClick={() => setAttending("no")}
            className={`flex items-center justify-center gap-2 py-4 rounded-sm border font-sans-el text-[11px] tracking-[0.2em] uppercase transition-colors duration-300 ${
              attending === "no"
                ? "bg-[#8a8175] text-white border-[#8a8175]"
                : "bg-white text-[#2b2724] border-[#d8d0c1] hover:border-[#8a8175]"
            }`}
          >
            <X className="w-4 h-4" /> Nuk mund të vij
          </button>
        </div>
      </div>

      {attending === "yes" && (
        <div className="anim-fade-up">
          <Label className="font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175]">Numri i personave</Label>
          <div className="flex items-center gap-4 mt-3">
            <button type="button" onClick={() => setGuests((g) => Math.max(1, g - 1))}
              className="w-11 h-11 rounded-sm border border-[#d8d0c1] bg-white text-xl text-[#2b2724] hover:border-[#b09a6b] transition-colors">−</button>
            <span className="font-serif-el text-2xl w-10 text-center">{guests}</span>
            <button type="button" onClick={() => setGuests((g) => Math.min(10, g + 1))}
              className="w-11 h-11 rounded-sm border border-[#d8d0c1] bg-white text-xl text-[#2b2724] hover:border-[#b09a6b] transition-colors">+</button>
          </div>
        </div>
      )}

      <div>
        <Label className="font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175]">Një mesazh për çiftin (opsionale)</Label>
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Urëimet tuaja..."
          rows={3}
          className="mt-2 bg-white border-[#d8d0c1] font-serif-el text-lg focus-visible:ring-[#b09a6b] resize-none"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full py-4 rounded-sm bg-[#2b2724] text-white font-sans-el text-[11px] tracking-[0.3em] uppercase hover:bg-[#b09a6b] transition-colors duration-300 disabled:opacity-70 flex items-center justify-center gap-2"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" /> Duke dërguar...
          </>
        ) : (
          "Dërgo Konfirmimin"
        )}
      </button>
    </form>
  );
};

export default RsvpForm;
