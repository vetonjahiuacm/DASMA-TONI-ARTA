import React, { useEffect, useState } from "react";
import { Music, VolumeX } from "lucide-react";
import ambientMusic from "../audioEngine";

const MusicToggle = () => {
  const [playing, setPlaying] = useState(ambientMusic.isPlaying());

  useEffect(() => {
    const id = setInterval(() => setPlaying(ambientMusic.isPlaying()), 800);
    return () => clearInterval(id);
  }, []);

  const handleToggle = () => {
    const now = ambientMusic.toggle();
    setPlaying(now);
  };

  return (
    <button
      onClick={handleToggle}
      aria-label={playing ? "Ndal muzikën" : "Luaj muzikën"}
      className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#faf8f3]/90 backdrop-blur border border-[#d8cdb6] shadow-lg flex items-center justify-center text-[#2b2724] hover:bg-[#b09a6b] hover:text-white transition-colors duration-300"
    >
      {playing ? (
        <span className="relative flex items-center justify-center">
          <Music className="w-5 h-5" strokeWidth={1.5} />
          <span className="absolute -inset-2 rounded-full border border-[#b09a6b]/50 animate-ping" />
        </span>
      ) : (
        <VolumeX className="w-5 h-5" strokeWidth={1.5} />
      )}
    </button>
  );
};

export default MusicToggle;
