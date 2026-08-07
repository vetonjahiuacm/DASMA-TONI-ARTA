import React, { useEffect, useState, useCallback } from "react";
import { MapPin, Clock, CalendarDays } from "lucide-react";
import { eventData } from "../mock";
import { fetchRsvps } from "../api";
import Countdown from "./Countdown";
import RsvpForm from "./RsvpForm";
import Gallery from "./Gallery";
import Wishes from "./Wishes";
import { FloralDivider, Sprig, Petals } from "./Ornaments";

const Invitation = () => {
  const [wishes, setWishes] = useState([]);

  const loadWishes = useCallback(async () => {
    try {
      const rsvps = await fetchRsvps();
      setWishes(rsvps.filter((r) => r.message && r.message.trim().length > 0));
    } catch (e) {
      // silent
    }
  }, []);

  useEffect(() => {
    loadWishes();
  }, [loadWishes]);

  return (
    <div className="w-full soft-in relative">
      <Petals count={14} />
      {/* HERO */}
      <section className="min-h-[92vh] flex flex-col items-center justify-center text-center px-6 py-20 relative">
        <p className="font-sans-el text-[11px] tracking-wide-lux uppercase text-[#8a8175] anim-fade-up">
          Bashkë përgjithmonë
        </p>
        <div className="relative flex items-center justify-center mt-6 anim-fade-up delay-1">
          <Sprig className="hidden md:block absolute -left-24 top-2 opacity-70" />
          <div>
            <h1 className="font-script text-7xl md:text-9xl text-[#2b2724] leading-[0.85]">
              {eventData.groom}
            </h1>
            <span className="font-script text-4xl md:text-6xl gold-text block my-1">&amp;</span>
            <h1 className="font-script text-7xl md:text-9xl text-[#2b2724] leading-[0.85]">
              {eventData.bride}
            </h1>
          </div>
          <Sprig flip className="hidden md:block absolute -right-24 top-2 opacity-70" />
        </div>

        <FloralDivider className="mt-10 anim-fade-up delay-3" />
        <p className="font-sans-el text-xs md:text-sm tracking-[0.3em] uppercase text-[#5c554c] mt-6 anim-fade-up delay-3">
          {eventData.weekday} · {eventData.dateShort} · {eventData.time}
        </p>
        <p className="font-serif-el italic text-[#8a8175] mt-10 max-w-xl text-lg md:text-xl anim-fade-up delay-4">
          “{eventData.quote}”
        </p>
      </section>

      {/* PHOTO GALLERY */}
      <Gallery />

      {/* COUNTDOWN */}
      <section className="py-16 px-6">
        <p className="text-center font-sans-el text-[11px] tracking-wide-lux uppercase text-[#8a8175] mb-8">
          Numratori deri në ditën e madhe
        </p>
        <Countdown />
      </section>

      {/* DETAILS */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-8 lift">
            <CalendarDays className="w-6 h-6 mx-auto text-[#b09a6b]" strokeWidth={1.2} />
            <h3 className="font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#8a8175] mt-4">Data</h3>
            <p className="font-serif-el text-xl text-[#2b2724] mt-2">{eventData.dateHuman}</p>
          </div>
          <div className="text-center bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-8 lift">
            <Clock className="w-6 h-6 mx-auto text-[#b09a6b]" strokeWidth={1.2} />
            <h3 className="font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#8a8175] mt-4">Ora</h3>
            <p className="font-serif-el text-xl text-[#2b2724] mt-2">{eventData.time}</p>
          </div>
          <div className="text-center bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-8 lift">
            <MapPin className="w-6 h-6 mx-auto text-[#b09a6b]" strokeWidth={1.2} />
            <h3 className="font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#8a8175] mt-4">Vendi</h3>
            <p className="font-serif-el text-xl text-[#2b2724] mt-2">{eventData.venue}</p>
          </div>
        </div>
      </section>

      {/* PROGRAM */}
      <section className="max-w-2xl mx-auto px-6 py-12">
        <h2 className="text-center font-script text-5xl text-[#2b2724] mb-2">Programi</h2>
        <FloralDivider className="mb-10" />
        <div className="space-y-6">
          {eventData.program.map((p, i) => (
            <div key={i} className="flex items-center gap-6 justify-center">
              <span className="font-serif-el text-2xl text-[#b09a6b] w-20 text-right">{p.time}</span>
              <span className="w-px h-6 bg-[#d8d0c1]" />
              <span className="font-serif-el text-lg text-[#2b2724] w-56 text-left">{p.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* LOCATION */}
      <section className="max-w-4xl mx-auto px-6 py-12">
        <h2 className="text-center font-script text-5xl text-[#2b2724] mb-2">Lokacioni</h2>
        <FloralDivider className="mb-8" />
        <div className="rounded-sm overflow-hidden border border-[#e2dccf] shadow-sm">
          <iframe
            title="Lokacioni"
            src={eventData.mapsEmbed}
            className="w-full"
            style={{ height: 340, border: 0 }}
            loading="lazy"
          />
        </div>
        <div className="text-center mt-6">
          <a
            href={eventData.mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#2b2724] border border-[#b09a6b] px-8 py-4 rounded-sm hover:bg-[#b09a6b] hover:text-white transition-colors duration-300"
          >
            <MapPin className="w-4 h-4" strokeWidth={1.4} /> Shiko Lokacionin
          </a>
        </div>
      </section>

      {/* RSVP */}
      <section id="rsvp" className="max-w-xl mx-auto px-6 py-16">
        <h2 className="text-center font-script text-5xl text-[#2b2724] mb-2">Konfirmoni Pjesëmarrjen</h2>
        <FloralDivider className="mb-4" />
        <p className="text-center font-serif-el italic text-[#8a8175] mb-10">
          Ju lutemi na bëni të ditur nese do të jeni pranë nesh
        </p>
        <RsvpForm onSubmitted={() => loadWishes()} />
      </section>

      {/* WISHES WALL */}
      <Wishes wishes={wishes} />

      {/* FOOTER */}
      <footer className="text-center py-12 px-6 border-t border-[#e2dccf]">
        <p className="font-script text-4xl text-[#2b2724]">{eventData.initials}</p>
        <p className="font-sans-el text-[10px] tracking-[0.3em] uppercase text-[#8a8175] mt-3">
          Me dashuri · {eventData.dateShort}
        </p>
      </footer>
    </div>
  );
};

export default Invitation;
