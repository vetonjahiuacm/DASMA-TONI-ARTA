import React, { useEffect, useState } from "react";
import { getRsvps, eventData } from "../mock";
import { Check, X, Users, Mail, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Admin = () => {
  const [list, setList] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setList(getRsvps());
  }, []);

  const yes = list.filter((r) => r.attending === "yes");
  const no = list.filter((r) => r.attending === "no");
  const totalGuests = yes.reduce((s, r) => s + (Number(r.guests) || 0), 0);

  const stats = [
    { icon: Check, label: "Kanë pranuar", value: yes.length },
    { icon: X, label: "Kanë refuzuar", value: no.length },
    { icon: Users, label: "Total mysafirë", value: totalGuests },
    { icon: Mail, label: "Total përgjigje", value: list.length },
  ];

  return (
    <div className="min-h-screen paper-bg px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 font-sans-el text-[11px] tracking-[0.2em] uppercase text-[#8a8175] hover:text-[#2b2724] transition-colors mb-8">
          <ArrowLeft className="w-4 h-4" /> Kthehu te ftesa
        </button>

        <h1 className="font-script text-6xl text-[#2b2724]">Konfirmimet</h1>
        <p className="font-sans-el text-[11px] tracking-[0.25em] uppercase text-[#8a8175] mt-2">
          {eventData.groom} &amp; {eventData.bride} · {eventData.dateShort}
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
          {stats.map((s, i) => (
            <div key={i} className="bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-6 text-center">
              <s.icon className="w-5 h-5 mx-auto text-[#b09a6b]" strokeWidth={1.4} />
              <div className="font-serif-el text-4xl text-[#2b2724] mt-3">{s.value}</div>
              <div className="font-sans-el text-[9px] tracking-[0.2em] uppercase text-[#8a8175] mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="mt-12">
          {list.length === 0 ? (
            <p className="text-center font-serif-el italic text-[#8a8175] py-16">
              Ende nuk ka konfirmime.
            </p>
          ) : (
            <div className="space-y-3">
              {list.map((r) => (
                <div key={r.id}
                  className="bg-[#faf8f3] border border-[#e2dccf] rounded-sm p-5 flex items-start justify-between gap-4">
                  <div>
                    <p className="font-serif-el text-xl text-[#2b2724]">{r.name}</p>
                    {r.message && (
                      <p className="font-serif-el italic text-[#8a8175] mt-1 text-sm">“{r.message}”</p>
                    )}
                    <p className="font-sans-el text-[9px] tracking-[0.15em] uppercase text-[#b0a89a] mt-2">
                      {new Date(r.createdAt).toLocaleString("sq-AL")}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {r.attending === "yes" ? (
                      <span className="inline-flex items-center gap-1 font-sans-el text-[10px] tracking-[0.15em] uppercase text-[#5b7a4f] bg-[#eef3e9] border border-[#cfe0c4] px-3 py-1 rounded-sm">
                        <Check className="w-3 h-3" /> Vjen
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 font-sans-el text-[10px] tracking-[0.15em] uppercase text-[#9a5b5b] bg-[#f3eaea] border border-[#e0c4c4] px-3 py-1 rounded-sm">
                        <X className="w-3 h-3" /> Nuk vjen
                      </span>
                    )}
                    {r.attending === "yes" && (
                      <p className="font-serif-el text-sm text-[#5c554c] mt-2">{r.guests} person(a)</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
