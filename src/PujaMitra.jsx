import React, { useState, useMemo } from "react";
import {
  Search, MapPin, Calendar, Languages, Star, ShieldCheck, ChevronRight,
  ChevronLeft, X, Heart, ArrowRight, Clock, Users, CheckCircle2,
  SlidersHorizontal, Home as HomeIcon, Bookmark, User, LayoutGrid,
  Flame, Sparkles, ScrollText, TrendingUp, Eye, AlertCircle, Phone,
} from "lucide-react";

/* ---------------------------------- TOKENS ---------------------------------- */

const C = {
  ink: "#1C2140",
  inkSoft: "#2A2F58",
  inkFaint: "#4A5080",
  paper: "#FBF7F0",
  paperDeep: "#F1E9D8",
  card: "#FFFFFF",
  marigold: "#E08A2C",
  marigoldDeep: "#B96A16",
  marigoldPale: "#FBEBD6",
  sandal: "#E7DCC7",
  sage: "#57795A",
  sagePale: "#E7EFE3",
  rose: "#B24B4B",
  rosePale: "#F6E4E1",
  text: "#231F1A",
  textMuted: "#736A5C",
  textFaint: "#A79D8B",
  border: "#E7DFCF",
};

const FONTS = (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@400;500;600;700&display=swap');
    .pm-display { font-family: 'Fraunces', serif; letter-spacing: -0.01em; }
    .pm-body { font-family: 'Inter', sans-serif; }
    .pm-scroll::-webkit-scrollbar { display: none; }
    .pm-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    @keyframes pmPop { 0% { transform: scale(0.85); opacity: 0; } 100% { transform: scale(1); opacity: 1; } }
    .pm-pop { animation: pmPop 0.35s cubic-bezier(.2,.9,.3,1.2); }
    @keyframes pmRise { 0% { transform: translateY(8px); opacity: 0; } 100% { transform: translateY(0); opacity: 1; } }
    .pm-rise { animation: pmRise 0.4s ease-out; }
  `}</style>
);

/* ---------------------------------- DEMO DATA ---------------------------------- */

const CEREMONIES = [
  { id: "gruhapravesha", label: "Gruhapravesha", glyph: "🪔" },
  { id: "marriage", label: "Marriage", glyph: "💍" },
  { id: "satyanarayana", label: "Satyanarayana Puja", glyph: "🙏" },
  { id: "homa", label: "Homa / Havan", glyph: "🔥" },
  { id: "namakarana", label: "Namakarana", glyph: "👶" },
  { id: "bhoomipuja", label: "Bhoomi Puja", glyph: "🏗️" },
  { id: "vastu", label: "Vastu Puja", glyph: "🏠" },
  { id: "ganapathi", label: "Ganapathi Puja", glyph: "🐘" },
];

const LANGUAGES = ["Kannada", "Sanskrit", "Telugu", "Hindi", "Tulu", "Marathi"];

const PUJARIS = [
  { id: "p1", name: "Raghavendra Sharma", initials: "RS", color: C.marigold, verified: "FULLY_VERIFIED", rating: 4.9, reviews: 126, experience: 18, ceremonies: 420, languages: ["Kannada", "Sanskrit"], specialties: ["gruhapravesha", "homa", "marriage", "satyanarayana"], price: 3500, distance: 3.2, available: true, bio: "Third-generation purohit from Hassan, known for calm, clearly-narrated ceremonies where the family understands every step rather than just watching it happen." },
  { id: "p2", name: "Prakash Bhat", initials: "PB", color: C.sage, verified: "FULLY_VERIFIED", rating: 4.8, reviews: 94, experience: 14, ceremonies: 280, languages: ["Kannada", "Sanskrit"], specialties: ["gruhapravesha", "namakarana", "satyanarayana"], price: 2800, distance: 2.1, available: true, bio: "Focuses on home ceremonies and naming functions. Brings his own basic puja kit and a printed guidance sheet for the family to keep." },
  { id: "p3", name: "Mahesh Acharya", initials: "MA", color: C.rose, verified: "FULLY_VERIFIED", rating: 4.7, reviews: 78, experience: 22, ceremonies: 500, languages: ["Kannada", "Telugu"], specialties: ["marriage", "bhoomipuja", "vastu"], price: 4500, distance: 5.7, available: true, bio: "Specialises in Vastu and construction-related ceremonies across Hassan district. Comfortable working alongside site engineers and contractors." },
  { id: "p4", name: "Srinivasa Rao", initials: "SR", color: C.inkFaint, verified: "PHONE_VERIFIED", rating: 4.6, reviews: 52, experience: 10, ceremonies: 150, languages: ["Kannada", "Telugu", "Sanskrit"], specialties: ["satyanarayana", "ganapathi", "homa"], price: 2200, distance: 4.4, available: false, nextAvailable: "Oct 2", bio: "Newer to the platform but well regarded locally for Satyanarayana and Ganapathi poojas at a modest price point." },
  { id: "p5", name: "Ganapathi Joshi", initials: "GJ", color: C.marigoldDeep, verified: "FULLY_VERIFIED", rating: 4.9, reviews: 210, experience: 25, ceremonies: 600, languages: ["Kannada", "Sanskrit", "Hindi"], specialties: ["marriage", "gruhapravesha"], price: 5200, distance: 6.9, available: true, bio: "One of the most experienced Pujaris in the network. Often booked months ahead for weddings; occasional availability for smaller ceremonies." },
  { id: "p6", name: "Ramesh Hegde", initials: "RH", color: C.sage, verified: "FULLY_VERIFIED", rating: 4.5, reviews: 30, experience: 8, ceremonies: 90, languages: ["Kannada"], specialties: ["namakarana", "satyanarayana"], price: 1800, distance: 1.5, available: true, bio: "Closest to Hassan town centre and the most budget-friendly option for small family functions." },
  { id: "p7", name: "Subramanya Bhatta", initials: "SB", color: C.rose, verified: "FULLY_VERIFIED", rating: 4.8, reviews: 340, experience: 30, ceremonies: 800, languages: ["Kannada", "Sanskrit", "Tulu"], specialties: ["homa", "marriage", "gruhapravesha"], price: 6000, distance: 8.2, available: true, bio: "Senior-most Pujari in the network. Premium pricing reflects demand — booked mainly for larger, elaborate ceremonies." },
  { id: "p8", name: "Nagesh Kulkarni", initials: "NK", color: C.inkFaint, verified: "PHONE_VERIFIED", rating: 4.4, reviews: 45, experience: 12, ceremonies: 200, languages: ["Kannada", "Marathi"], specialties: ["vastu", "bhoomipuja", "gruhapravesha"], price: 3000, distance: 4.9, available: true, bio: "Handles Vastu-related ceremonies with a practical, no-frills approach. Comfortable explaining things in Marathi for non-Kannada families." },
];

const DEMO_REVIEWS = {
  p1: [
    { name: "Ananya K.", rating: 5, tag: "Gruhapravesha", text: "Very punctual and explained the ceremony clearly at every step." },
    { name: "Deepak M.", rating: 5, tag: "Homa", text: "Arrived early, brought everything needed, no last-minute surprises." },
    { name: "Shwetha R.", rating: 4, tag: "Satyanarayana Puja", text: "Ceremony ran a little long but the quality was excellent." },
  ],
  p2: [
    { name: "Kiran S.", rating: 5, tag: "Namakarana", text: "Gave us a printed guide beforehand so we knew what to prepare." },
    { name: "Manju P.", rating: 5, tag: "Gruhapravesha", text: "Warm, patient with our grandparents' questions." },
  ],
};

/* ---------------------------------- HELPERS ---------------------------------- */

function computeMatch(pj, filters) {
  let score = 0;
  if (filters.ceremony && pj.specialties.includes(filters.ceremony)) score += 34;
  else if (filters.ceremony) score += 6;
  if (filters.language && pj.languages.includes(filters.language)) score += 18;
  score += pj.available ? 16 : 2;
  score += (pj.rating / 5) * 16;
  score += Math.max(0, 12 - pj.distance) * 0.9;
  if (filters.budgetMax) {
    if (pj.price <= filters.budgetMax && pj.price >= filters.budgetMin * 0.6) score += 14;
    else if (pj.price <= filters.budgetMax * 1.25) score += 6;
  } else {
    score += 8;
  }
  return Math.max(38, Math.min(99, Math.round(score)));
}

function ceremonyLabel(id) {
  return CEREMONIES.find((c) => c.id === id)?.label || id;
}

function inr(n) {
  return "₹" + n.toLocaleString("en-IN");
}

/* ---------------------------------- SMALL UI PIECES ---------------------------------- */

function Badge({ children, tone = "marigold", icon: Icon }) {
  const map = {
    marigold: { bg: C.marigoldPale, fg: C.marigoldDeep },
    sage: { bg: C.sagePale, fg: C.sage },
    rose: { bg: C.rosePale, fg: C.rose },
    ink: { bg: C.paperDeep, fg: C.inkSoft },
  };
  const t = map[tone];
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium pm-body"
      style={{ backgroundColor: t.bg, color: t.fg }}
    >
      {Icon && <Icon size={12} strokeWidth={2.5} />}
      {children}
    </span>
  );
}

function PrimaryButton({ children, onClick, full, icon: Icon, disabled }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold pm-body transition-transform active:scale-[0.98] ${full ? "w-full" : ""} ${disabled ? "opacity-50 cursor-not-allowed" : "hover:brightness-105"}`}
      style={{ backgroundColor: C.marigold, color: "#fff" }}
    >
      {children}
      {Icon && <Icon size={16} strokeWidth={2.5} />}
    </button>
  );
}

function GhostButton({ children, onClick, full, icon: Icon }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold pm-body border transition-colors ${full ? "w-full" : ""}`}
      style={{ borderColor: C.ink, color: C.ink, backgroundColor: "transparent" }}
    >
      {children}
      {Icon && <Icon size={16} strokeWidth={2.5} />}
    </button>
  );
}

function DemoTag() {
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold pm-body"
      style={{ backgroundColor: C.ink, color: C.paper }}
    >
      DEMO DATA
    </span>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-sm font-semibold pm-body mb-3" style={{ color: C.textMuted }}>
      {children}
    </p>
  );
}

/* ---------------------------------- NAV ---------------------------------- */

function TopBar({ go, screen }) {
  return (
    <div
      className="sticky top-0 z-30 flex items-center justify-between px-5 md:px-10 py-4 border-b backdrop-blur pm-body"
      style={{ backgroundColor: C.paper + "F2", borderColor: C.border }}
    >
      <button onClick={() => go("landing")} className="flex items-center gap-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold"
          style={{ backgroundColor: C.ink, color: C.marigold }}
        >
          P
        </div>
        <span className="pm-display text-lg font-semibold" style={{ color: C.ink }}>
          PujaMitra
        </span>
      </button>
      <div className="hidden md:flex items-center gap-1">
        {[
          ["Find a Pujari", "search"],
          ["My Bookings", "bookings"],
          ["Saved", "saved"],
          ["Join as Pujari", "join"],
        ].map(([label, key]) => (
          <button
            key={key}
            onClick={() => go(key)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              color: screen === key ? C.ink : C.textMuted,
              backgroundColor: screen === key ? C.paperDeep : "transparent",
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => go("pujariDashboard")}
          className="hidden sm:inline-flex text-xs font-medium px-3 py-2 rounded-lg"
          style={{ color: C.textMuted }}
        >
          Pujari view ↗
        </button>
        <button
          onClick={() => go("admin")}
          className="hidden sm:inline-flex text-xs font-medium px-3 py-2 rounded-lg"
          style={{ color: C.textMuted }}
        >
          Admin ↗
        </button>
      </div>
    </div>
  );
}

function BottomNav({ go, screen }) {
  const items = [
    ["Home", "landing", HomeIcon],
    ["Search", "search", Search],
    ["Bookings", "bookings", ScrollText],
    ["Saved", "saved", Bookmark],
    ["Profile", "join", User],
  ];
  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-30 flex items-stretch border-t pm-body"
      style={{ backgroundColor: C.card, borderColor: C.border }}
    >
      {items.map(([label, key, Icon]) => {
        const active = screen === key;
        return (
          <button
            key={key}
            onClick={() => go(key)}
            className="flex-1 flex flex-col items-center gap-1 py-2.5"
            style={{ color: active ? C.marigoldDeep : C.textFaint }}
          >
            <Icon size={20} strokeWidth={active ? 2.5 : 2} />
            <span className="text-[10px] font-medium">{label}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------------------------------- LANDING ---------------------------------- */

function Landing({ go }) {
  return (
    <div className="pm-rise">
      <div className="px-5 md:px-10 pt-10 pb-14 md:pt-20 md:pb-24 grid md:grid-cols-2 gap-10 items-center max-w-6xl mx-auto">
        <div>
          <Badge tone="sage" icon={ShieldCheck}>
            Verified Pujaris only
          </Badge>
          <h1 className="pm-display text-4xl md:text-5xl leading-[1.08] mt-4 font-semibold" style={{ color: C.ink }}>
            Find the right Pujari for your Puja.
          </h1>
          <p className="mt-5 text-base md:text-lg leading-relaxed pm-body" style={{ color: C.textMuted }}>
            Discover trusted Pujaris based on your ceremony, location, availability,
            experience, language and budget — and compare them before you decide.
          </p>
          <div className="mt-7 flex flex-col sm:flex-row gap-3">
            <PrimaryButton onClick={() => go("search")} icon={ArrowRight}>
              Find a Pujari
            </PrimaryButton>
            <GhostButton onClick={() => go("join")}>Join as a Pujari</GhostButton>
          </div>
          <div className="mt-9 flex items-center gap-6">
            <div>
              <p className="pm-display text-2xl font-semibold" style={{ color: C.ink }}>
                8
              </p>
              <p className="text-xs pm-body" style={{ color: C.textFaint }}>
                Pujaris in Hassan (demo)
              </p>
            </div>
            <div className="w-px h-8" style={{ backgroundColor: C.border }} />
            <div>
              <p className="pm-display text-2xl font-semibold" style={{ color: C.ink }}>
                4.8
              </p>
              <p className="text-xs pm-body" style={{ color: C.textFaint }}>
                Average rating (demo)
              </p>
            </div>
          </div>
        </div>

        <div
          className="rounded-2xl p-6 md:p-7 pm-pop"
          style={{ backgroundColor: C.ink }}
        >
          <p className="text-xs font-semibold pm-body mb-4" style={{ color: C.marigold }}>
            A FAMILY'S GRUHAPRAVESHA — HASSAN
          </p>
          <div className="space-y-3">
            {[
              { icon: Flame, label: "Ceremony", value: "Gruhapravesha" },
              { icon: MapPin, label: "Location", value: "Hassan, Karnataka" },
              { icon: Calendar, label: "Date", value: "27 Sept 2026" },
              { icon: Languages, label: "Language", value: "Kannada" },
            ].map((r) => (
              <div key={r.label} className="flex items-center justify-between rounded-xl px-4 py-3" style={{ backgroundColor: C.inkSoft }}>
                <span className="flex items-center gap-2 text-sm pm-body" style={{ color: C.paperDeep }}>
                  <r.icon size={15} /> {r.label}
                </span>
                <span className="text-sm font-semibold pm-body" style={{ color: "#fff" }}>
                  {r.value}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl px-4 py-3 flex items-center justify-between" style={{ backgroundColor: C.marigold }}>
            <span className="text-sm font-semibold pm-body" style={{ color: "#fff" }}>
              3 matches found
            </span>
            <span className="text-sm font-bold pm-body" style={{ color: "#fff" }}>
              Best: 94%
            </span>
          </div>
        </div>
      </div>

      {/* Popular ceremonies */}
      <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
        <SectionLabel>Popular ceremonies</SectionLabel>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {CEREMONIES.slice(0, 8).map((c) => (
            <button
              key={c.id}
              onClick={() => go("search", { ceremony: c.id })}
              className="rounded-xl p-4 text-left border transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: C.card, borderColor: C.border }}
            >
              <span className="text-2xl">{c.glyph}</span>
              <p className="mt-2 text-sm font-semibold pm-body" style={{ color: C.text }}>
                {c.label}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Before / after */}
      <div className="px-5 md:px-10 py-10 max-w-6xl mx-auto">
        <SectionLabel>Why PujaMitra</SectionLabel>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-6 border" style={{ borderColor: C.border, backgroundColor: C.card }}>
            <p className="text-xs font-semibold pm-body mb-4" style={{ color: C.textFaint }}>
              WITHOUT PUJAMITRA
            </p>
            <ol className="space-y-2.5 text-sm pm-body" style={{ color: C.textMuted }}>
              {["Ask relatives who they used last time", "Call two or three Pujaris one by one", "Ask each their price separately", "Hope one of them is free on the date", "Decide without really comparing"].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <span style={{ color: C.textFaint }}>{i + 1}.</span> {s}
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-2xl p-6" style={{ backgroundColor: C.marigoldPale }}>
            <p className="text-xs font-semibold pm-body mb-4" style={{ color: C.marigoldDeep }}>
              WITH PUJAMITRA
            </p>
            <ol className="space-y-2.5 text-sm pm-body" style={{ color: C.text }}>
              {["Enter your ceremony, date and language once", "See who's actually available that day", "Compare price, experience and reviews together", "Check verification before you decide", "Send one booking request, get a clear answer"].map((s, i) => (
                <li key={i} className="flex gap-2">
                  <CheckCircle2 size={16} style={{ color: C.marigoldDeep }} className="mt-0.5 shrink-0" /> {s}
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>

      {/* Future vision */}
      <div className="px-5 md:px-10 py-12 max-w-6xl mx-auto">
        <div className="rounded-2xl border p-8 text-center" style={{ borderColor: C.border }}>
          <p className="pm-display text-xl md:text-2xl font-semibold" style={{ color: C.ink }}>
            More than finding a Pujari.
          </p>
          <p className="mt-3 text-sm pm-body flex flex-wrap items-center justify-center gap-x-2 gap-y-1" style={{ color: C.textFaint }}>
            {["Pujari", "Puja Materials", "Flowers", "Decoration", "Catering", "Photography"].map((x, i, arr) => (
              <span key={x} className="flex items-center gap-2">
                <span className={i === 0 ? "font-semibold" : ""} style={{ color: i === 0 ? C.text : C.textFaint }}>{x}</span>
                {i < arr.length - 1 && <span>·</span>}
              </span>
            ))}
          </p>
          <p className="mt-4 text-xs pm-body" style={{ color: C.textFaint }}>
            Starting with Pujaris. Building a trusted platform for religious ceremony services.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------- SEARCH ---------------------------------- */

function SearchScreen({ filters, setFilters, go }) {
  const set = (k, v) => setFilters((f) => ({ ...f, [k]: v }));
  return (
    <div className="max-w-xl mx-auto px-5 md:px-0 py-8 md:py-14 pm-rise">
      <h1 className="pm-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
        Find your Pujari
      </h1>
      <p className="text-sm pm-body mt-1.5 mb-7" style={{ color: C.textMuted }}>
        Tell us about your ceremony — takes less than a minute.
      </p>

      <div className="rounded-2xl border p-5 md:p-6 space-y-5" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <div>
          <label className="text-xs font-semibold pm-body flex items-center gap-1.5 mb-2.5" style={{ color: C.textMuted }}>
            <Flame size={13} /> What ceremony?
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {CEREMONIES.map((c) => (
              <button
                key={c.id}
                onClick={() => set("ceremony", c.id)}
                className="rounded-xl px-2 py-2.5 text-xs font-medium pm-body border text-center transition-colors"
                style={{
                  borderColor: filters.ceremony === c.id ? C.marigold : C.border,
                  backgroundColor: filters.ceremony === c.id ? C.marigoldPale : "transparent",
                  color: filters.ceremony === c.id ? C.marigoldDeep : C.text,
                }}
              >
                <div className="text-base mb-0.5">{c.glyph}</div>
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold pm-body flex items-center gap-1.5 mb-2" style={{ color: C.textMuted }}>
            <MapPin size={13} /> Where?
          </label>
          <input
            value={filters.location}
            onChange={(e) => set("location", e.target.value)}
            placeholder="City or area"
            className="w-full rounded-xl border px-4 py-3 text-sm pm-body outline-none"
            style={{ borderColor: C.border, color: C.text }}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold pm-body flex items-center gap-1.5 mb-2" style={{ color: C.textMuted }}>
              <Calendar size={13} /> When?
            </label>
            <input
              type="date"
              value={filters.date}
              onChange={(e) => set("date", e.target.value)}
              className="w-full rounded-xl border px-3 py-3 text-sm pm-body outline-none"
              style={{ borderColor: C.border, color: C.text }}
            />
          </div>
          <div>
            <label className="text-xs font-semibold pm-body flex items-center gap-1.5 mb-2" style={{ color: C.textMuted }}>
              <Languages size={13} /> Language
            </label>
            <select
              value={filters.language}
              onChange={(e) => set("language", e.target.value)}
              className="w-full rounded-xl border px-3 py-3 text-sm pm-body outline-none"
              style={{ borderColor: C.border, color: C.text }}
            >
              {LANGUAGES.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold pm-body mb-2 flex items-center justify-between" style={{ color: C.textMuted }}>
            <span>Budget (optional)</span>
            <span style={{ color: C.text }}>
              {inr(filters.budgetMin)} – {inr(filters.budgetMax)}
            </span>
          </label>
          <div className="flex gap-3 items-center">
            <input
              type="range"
              min={500}
              max={8000}
              step={100}
              value={filters.budgetMin}
              onChange={(e) => set("budgetMin", Math.min(+e.target.value, filters.budgetMax - 200))}
              className="w-full accent-current"
              style={{ color: C.marigold }}
            />
            <input
              type="range"
              min={500}
              max={8000}
              step={100}
              value={filters.budgetMax}
              onChange={(e) => set("budgetMax", Math.max(+e.target.value, filters.budgetMin + 200))}
              className="w-full accent-current"
              style={{ color: C.marigold }}
            />
          </div>
        </div>

        <PrimaryButton full onClick={() => go("results")} icon={Search}>
          Find Pujaris
        </PrimaryButton>
      </div>
    </div>
  );
}

/* ---------------------------------- RESULTS ---------------------------------- */

function PujariCard({ pj, match, saved, toggleSave, compareChecked, toggleCompare, onView, onBook }) {
  return (
    <div className="rounded-2xl border p-4 md:p-5" style={{ borderColor: C.border, backgroundColor: C.card }}>
      <div className="flex gap-4">
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center text-base font-bold shrink-0 pm-display"
          style={{ backgroundColor: pj.color, color: "#fff" }}
        >
          {pj.initials}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <button onClick={() => onView(pj.id)} className="text-left">
              <p className="font-semibold pm-body text-[15px]" style={{ color: C.text }}>
                {pj.name}
              </p>
            </button>
            <button onClick={() => toggleSave(pj.id)} className="shrink-0">
              <Heart
                size={18}
                fill={saved ? C.rose : "none"}
                strokeWidth={2}
                style={{ color: saved ? C.rose : C.textFaint }}
              />
            </button>
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-xs pm-body" style={{ color: C.textMuted }}>
            {pj.verified === "FULLY_VERIFIED" && (
              <span className="flex items-center gap-1" style={{ color: C.sage }}>
                <ShieldCheck size={13} /> Verified
              </span>
            )}
            <span className="flex items-center gap-1">
              <Star size={13} fill={C.marigold} style={{ color: C.marigold }} /> {pj.rating} ({pj.reviews})
            </span>
            <span>{pj.experience} yrs exp.</span>
            <span>{pj.ceremonies}+ ceremonies</span>
          </div>
          <p className="text-xs pm-body mt-1.5" style={{ color: C.textFaint }}>
            {pj.languages.join(" • ")}
          </p>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {pj.specialties.slice(0, 3).map((s) => (
          <span key={s} className="text-[11px] px-2 py-0.5 rounded-full pm-body" style={{ backgroundColor: C.paperDeep, color: C.inkSoft }}>
            {ceremonyLabel(s)}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between text-sm pm-body">
        <span className="flex items-center gap-1" style={{ color: C.textMuted }}>
          <MapPin size={13} /> {pj.distance} km away
        </span>
        <span className="font-semibold" style={{ color: C.text }}>
          {inr(pj.price)} onwards
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between">
        <span
          className="text-xs font-medium pm-body flex items-center gap-1"
          style={{ color: pj.available ? C.sage : C.rose }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: pj.available ? C.sage : C.rose }} />
          {pj.available ? "Available on selected date" : `Next available ${pj.nextAvailable}`}
        </span>
        <span className="text-xs font-bold pm-body" style={{ color: C.marigoldDeep }}>
          {match}% Match
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <label className="flex items-center gap-1.5 text-xs pm-body pr-1" style={{ color: C.textMuted }}>
          <input type="checkbox" checked={compareChecked} onChange={() => toggleCompare(pj.id)} />
          Compare
        </label>
        <div className="flex-1" />
        <button
          onClick={() => onView(pj.id)}
          className="rounded-lg px-3.5 py-2 text-xs font-semibold pm-body border"
          style={{ borderColor: C.ink, color: C.ink }}
        >
          View Profile
        </button>
        <button
          onClick={() => onBook(pj.id)}
          className="rounded-lg px-3.5 py-2 text-xs font-semibold pm-body"
          style={{ backgroundColor: C.marigold, color: "#fff" }}
        >
          Request Booking
        </button>
      </div>
    </div>
  );
}

function ResultsScreen({ filters, go, saved, toggleSave, compareIds, toggleCompare, setSelectedId }) {
  const [sortBy, setSortBy] = useState("match");
  const [minRating, setMinRating] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const scored = useMemo(() => {
    let list = PUJARIS.map((pj) => ({ pj, match: computeMatch(pj, filters) }));
    list = list.filter((x) => x.pj.rating >= minRating);
    if (verifiedOnly) list = list.filter((x) => x.pj.verified === "FULLY_VERIFIED");
    const sorters = {
      match: (a, b) => b.match - a.match,
      rating: (a, b) => b.pj.rating - a.pj.rating,
      experience: (a, b) => b.pj.experience - a.pj.experience,
      distance: (a, b) => a.pj.distance - b.pj.distance,
      price: (a, b) => a.pj.price - b.pj.price,
    };
    return list.sort(sorters[sortBy]);
  }, [filters, sortBy, minRating, verifiedOnly]);

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <button onClick={() => go("search")} className="flex items-center gap-1 text-xs font-medium pm-body mb-4" style={{ color: C.textMuted }}>
        <ChevronLeft size={14} /> Edit search
      </button>
      <h1 className="pm-display text-2xl font-semibold" style={{ color: C.ink }}>
        Pujaris near {filters.location || "you"}
      </h1>
      <p className="text-sm pm-body mt-1" style={{ color: C.textMuted }}>
        {scored.length} Pujaris match your requirements for {ceremonyLabel(filters.ceremony)}.
      </p>

      <div className="flex items-center gap-2 mt-5 overflow-x-auto pm-scroll pb-1">
        <button
          onClick={() => setShowFilters((s) => !s)}
          className="shrink-0 flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium pm-body"
          style={{ borderColor: C.ink, color: C.ink }}
        >
          <SlidersHorizontal size={13} /> Filters
        </button>
        {[
          ["match", "Best Match"],
          ["rating", "Highest Rated"],
          ["experience", "Most Experienced"],
          ["distance", "Closest"],
          ["price", "Lowest Price"],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSortBy(key)}
            className="shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium pm-body border"
            style={{
              borderColor: sortBy === key ? C.marigold : C.border,
              backgroundColor: sortBy === key ? C.marigoldPale : "transparent",
              color: sortBy === key ? C.marigoldDeep : C.textMuted,
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {showFilters && (
        <div className="mt-3 rounded-xl border p-4 flex flex-wrap gap-5 text-xs pm-body" style={{ borderColor: C.border, backgroundColor: C.card }}>
          <label className="flex items-center gap-2" style={{ color: C.text }}>
            <input type="checkbox" checked={verifiedOnly} onChange={(e) => setVerifiedOnly(e.target.checked)} />
            Verified only
          </label>
          <div className="flex items-center gap-2" style={{ color: C.text }}>
            Min rating
            {[0, 4, 4.5].map((r) => (
              <button
                key={r}
                onClick={() => setMinRating(r)}
                className="px-2 py-1 rounded-md border"
                style={{ borderColor: minRating === r ? C.marigold : C.border, color: minRating === r ? C.marigoldDeep : C.textMuted }}
              >
                {r === 0 ? "Any" : `${r}+`}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mt-5 space-y-4">
        {scored.length === 0 ? (
          <EmptyState
            title="No Pujaris found"
            body="Try widening your budget or removing a filter — a few Pujaris nearby may still be a good fit."
            action={() => { setMinRating(0); setVerifiedOnly(false); }}
            actionLabel="Reset filters"
          />
        ) : (
          scored.map(({ pj, match }) => (
            <PujariCard
              key={pj.id}
              pj={pj}
              match={match}
              saved={saved.has(pj.id)}
              toggleSave={toggleSave}
              compareChecked={compareIds.has(pj.id)}
              toggleCompare={toggleCompare}
              onView={(id) => { setSelectedId(id); go("profile"); }}
              onBook={(id) => { setSelectedId(id); go("booking"); }}
            />
          ))
        )}
      </div>

      {compareIds.size >= 2 && (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-40 pm-pop">
          <button
            onClick={() => go("compare")}
            className="flex items-center gap-2 rounded-full px-5 py-3 shadow-lg text-sm font-semibold pm-body"
            style={{ backgroundColor: C.ink, color: "#fff" }}
          >
            <LayoutGrid size={15} /> Compare {compareIds.size} Pujaris <ChevronRight size={15} />
          </button>
        </div>
      )}
    </div>
  );
}

function EmptyState({ title, body, action, actionLabel, icon: Icon = AlertCircle }) {
  return (
    <div className="rounded-2xl border border-dashed p-10 text-center" style={{ borderColor: C.border }}>
      <Icon size={22} style={{ color: C.textFaint }} className="mx-auto mb-3" />
      <p className="font-semibold pm-body text-sm" style={{ color: C.text }}>
        {title}
      </p>
      <p className="text-xs pm-body mt-1 max-w-xs mx-auto" style={{ color: C.textFaint }}>
        {body}
      </p>
      {action && (
        <button onClick={action} className="mt-4 text-xs font-semibold pm-body underline underline-offset-2" style={{ color: C.marigoldDeep }}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

/* ---------------------------------- PROFILE ---------------------------------- */

function ProfileScreen({ id, go, saved, toggleSave, filters, setSelectedId, compareIds, toggleCompare }) {
  const pj = PUJARIS.find((p) => p.id === id);
  if (!pj) return <EmptyState title="Profile not found" body="This demo profile no longer exists." />;
  const match = computeMatch(pj, filters);
  const reviews = DEMO_REVIEWS[pj.id] || DEMO_REVIEWS.p1;

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <button onClick={() => go("results")} className="flex items-center gap-1 text-xs font-medium pm-body mb-4" style={{ color: C.textMuted }}>
        <ChevronLeft size={14} /> Back to results
      </button>

      <div className="rounded-2xl border p-6" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <div className="flex items-start gap-4">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center text-2xl font-bold shrink-0 pm-display"
            style={{ backgroundColor: pj.color, color: "#fff" }}
          >
            {pj.initials}
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="pm-display text-xl font-semibold" style={{ color: C.ink }}>
                {pj.name}
              </h1>
              {pj.verified === "FULLY_VERIFIED" ? (
                <Badge tone="sage" icon={ShieldCheck}>Verified Demo Profile</Badge>
              ) : (
                <Badge tone="ink">Phone verified</Badge>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-sm pm-body" style={{ color: C.textMuted }}>
              <span className="flex items-center gap-1">
                <Star size={14} fill={C.marigold} style={{ color: C.marigold }} /> {pj.rating} ({pj.reviews} reviews)
              </span>
              <span>{pj.experience} years experience</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} /> Hassan, {pj.distance} km away
              </span>
            </div>
          </div>
          <span className="text-sm font-bold pm-body shrink-0" style={{ color: C.marigoldDeep }}>
            {match}% Match
          </span>
        </div>

        <div className="mt-5 flex gap-2">
          <PrimaryButton onClick={() => { setSelectedId(pj.id); go("booking"); }}>Request Booking</PrimaryButton>
          <GhostButton onClick={() => toggleSave(pj.id)} icon={Heart}>
            {saved.has(pj.id) ? "Saved" : "Save"}
          </GhostButton>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4 mt-4">
        <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.card }}>
          <SectionLabel>About</SectionLabel>
          <p className="text-sm pm-body leading-relaxed" style={{ color: C.text }}>{pj.bio}</p>
        </div>
        <div className="rounded-2xl border p-5" style={{ borderColor: C.border, backgroundColor: C.card }}>
          <SectionLabel>Languages</SectionLabel>
          <div className="flex flex-wrap gap-2">
            {pj.languages.map((l) => (
              <Badge key={l} tone="ink">{l}</Badge>
            ))}
          </div>
          <div className="mt-5">
            <SectionLabel>Specializations</SectionLabel>
            <div className="flex flex-wrap gap-2">
              {pj.specialties.map((s) => (
                <Badge key={s} tone="marigold">{ceremonyLabel(s)}</Badge>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border p-5 mt-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <SectionLabel>Services & pricing</SectionLabel>
        <div className="divide-y" style={{ borderColor: C.border }}>
          {pj.specialties.map((s) => (
            <div key={s} className="flex items-center justify-between py-2.5 text-sm pm-body">
              <span style={{ color: C.text }}>{ceremonyLabel(s)}</span>
              <span className="font-semibold" style={{ color: C.text }}>
                {inr(Math.round(pj.price * (s === pj.specialties[0] ? 1 : 0.8)))} onwards
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-2xl border p-5 mt-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Availability</SectionLabel>
          <DemoTag />
        </div>
        <div className="grid grid-cols-7 gap-1.5 text-center text-xs pm-body">
          {Array.from({ length: 30 }, (_, i) => i + 1).map((d) => {
            const isTarget = d === 27;
            const busy = [5, 12, 19, 26].includes(d);
            return (
              <div
                key={d}
                className="rounded-lg py-2 font-medium"
                style={{
                  backgroundColor: isTarget ? C.marigold : busy ? C.rosePale : C.sagePale,
                  color: isTarget ? "#fff" : busy ? C.rose : C.sage,
                }}
              >
                {d}
              </div>
            );
          })}
        </div>
        <p className="text-xs pm-body mt-3" style={{ color: C.sage }}>🟢 Available on Sep 27, your selected date</p>
      </div>

      <div className="rounded-2xl border p-5 mt-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <div className="flex items-center justify-between mb-3">
          <SectionLabel>Reviews</SectionLabel>
          <DemoTag />
        </div>
        <div className="space-y-4">
          {reviews.map((r, i) => (
            <div key={i} className="pb-4" style={{ borderBottom: i < reviews.length - 1 ? `1px solid ${C.border}` : "none" }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <Star key={s} size={13} fill={s < r.rating ? C.marigold : "none"} style={{ color: C.marigold }} />
                  ))}
                </div>
                <Badge tone="sage" icon={CheckCircle2}>Verified booking</Badge>
              </div>
              <p className="text-sm pm-body mt-2" style={{ color: C.text }}>"{r.text}"</p>
              <p className="text-xs pm-body mt-1" style={{ color: C.textFaint }}>
                {r.name} (demo) · {r.tag}
              </p>
            </div>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2 mt-4 text-xs pm-body" style={{ color: C.textMuted }}>
        <input type="checkbox" checked={compareIds.has(pj.id)} onChange={() => toggleCompare(pj.id)} />
        Add to compare
      </label>
    </div>
  );
}

/* ---------------------------------- COMPARE ---------------------------------- */

function CompareScreen({ compareIds, go, filters, setSelectedId }) {
  const list = PUJARIS.filter((p) => compareIds.has(p.id)).slice(0, 3);
  if (list.length < 2) {
    return (
      <div className="max-w-2xl mx-auto px-5 py-14">
        <EmptyState
          title="Select at least 2 Pujaris to compare"
          body="Go back to results and tick 'Compare' on the profiles you're considering."
          action={() => go("results")}
          actionLabel="Back to results"
          icon={LayoutGrid}
        />
      </div>
    );
  }
  const rows = [
    ["Rating", (p) => `${p.rating} ★`],
    ["Experience", (p) => `${p.experience} yrs`],
    ["Ceremonies performed", (p) => `${p.ceremonies}+`],
    ["Distance", (p) => `${p.distance} km`],
    ["Languages", (p) => p.languages.join(", ")],
    ["Starting price", (p) => inr(p.price)],
    ["Availability", (p) => (p.available ? "Available" : `From ${p.nextAvailable}`)],
    ["Verification", (p) => (p.verified === "FULLY_VERIFIED" ? "Fully verified" : "Phone verified")],
    ["Match score", (p) => `${computeMatch(p, filters)}%`],
  ];
  const best = list.reduce((a, b) => (computeMatch(b, filters) > computeMatch(a, filters) ? b : a));

  return (
    <div className="max-w-4xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <button onClick={() => go("results")} className="flex items-center gap-1 text-xs font-medium pm-body mb-4" style={{ color: C.textMuted }}>
        <ChevronLeft size={14} /> Back to results
      </button>
      <h1 className="pm-display text-2xl font-semibold mb-1" style={{ color: C.ink }}>
        Compare Pujaris
      </h1>
      <p className="text-xs pm-body mb-6" style={{ color: C.textFaint }}>
        A higher match score reflects fit for your search — not a ranking of religious skill.
      </p>

      <div className="overflow-x-auto pm-scroll">
        <table className="w-full border-separate" style={{ borderSpacing: "0 8px" }}>
          <thead>
            <tr>
              <td></td>
              {list.map((p) => (
                <td key={p.id} className="px-3">
                  <div
                    className="rounded-xl p-3 text-center"
                    style={{ backgroundColor: p.id === best.id ? C.marigoldPale : C.paperDeep, border: p.id === best.id ? `1.5px solid ${C.marigold}` : "none" }}
                  >
                    <div
                      className="w-10 h-10 rounded-lg mx-auto flex items-center justify-center text-sm font-bold pm-display"
                      style={{ backgroundColor: p.color, color: "#fff" }}
                    >
                      {p.initials}
                    </div>
                    <p className="text-xs font-semibold pm-body mt-2" style={{ color: C.text }}>{p.name}</p>
                    {p.id === best.id && (
                      <p className="text-[10px] font-bold pm-body mt-0.5" style={{ color: C.marigoldDeep }}>BEST MATCH</p>
                    )}
                  </div>
                </td>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map(([label, fn]) => (
              <tr key={label}>
                <td className="text-xs font-semibold pm-body pr-3 whitespace-nowrap py-1" style={{ color: C.textMuted }}>
                  {label}
                </td>
                {list.map((p) => (
                  <td key={p.id} className="text-center text-sm pm-body py-1 px-3" style={{ color: C.text }}>
                    {fn(p)}
                  </td>
                ))}
              </tr>
            ))}
            <tr>
              <td></td>
              {list.map((p) => (
                <td key={p.id} className="px-3 pt-3">
                  <button
                    onClick={() => { setSelectedId(p.id); go("booking"); }}
                    className="w-full rounded-lg px-3 py-2 text-xs font-semibold pm-body"
                    style={{ backgroundColor: C.marigold, color: "#fff" }}
                  >
                    Book
                  </button>
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------------------------- BOOKING FLOW ---------------------------------- */

function BookingScreen({ id, filters, go, addBooking }) {
  const pj = PUJARIS.find((p) => p.id === id);
  const [time, setTime] = useState("10:00 AM");
  const [guests, setGuests] = useState("");
  const [notes, setNotes] = useState("Please bring the required puja guidance/material list.");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  if (!pj) return <EmptyState title="Pujari not found" body="Please pick a Pujari from the results first." />;

  const submit = () => {
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Enter a valid 10-digit phone number so the Pujari can confirm with you.");
      return;
    }
    addBooking({
      id: "b" + Date.now(),
      pujariId: pj.id,
      pujariName: pj.name,
      ceremony: ceremonyLabel(filters.ceremony),
      date: filters.date,
      time,
      location: filters.location || "Hassan",
      status: "Awaiting confirmation",
    });
    go("confirmation");
  };

  return (
    <div className="max-w-lg mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <button onClick={() => go("profile")} className="flex items-center gap-1 text-xs font-medium pm-body mb-4" style={{ color: C.textMuted }}>
        <ChevronLeft size={14} /> Back to profile
      </button>
      <h1 className="pm-display text-2xl font-semibold mb-5" style={{ color: C.ink }}>
        Request Booking
      </h1>

      <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
        <div className="flex items-center gap-3 pb-4" style={{ borderBottom: `1px solid ${C.border}` }}>
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-sm font-bold pm-display" style={{ backgroundColor: pj.color, color: "#fff" }}>
            {pj.initials}
          </div>
          <div>
            <p className="text-sm font-semibold pm-body" style={{ color: C.text }}>{pj.name}</p>
            <p className="text-xs pm-body" style={{ color: C.textFaint }}>{ceremonyLabel(filters.ceremony)} · {inr(pj.price)} onwards</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Field label="Ceremony" value={ceremonyLabel(filters.ceremony)} readOnly />
          <Field label="Date" value={filters.date} readOnly />
        </div>
        <div>
          <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: C.textMuted }}>Time</label>
          <select value={time} onChange={(e) => setTime(e.target.value)} className="w-full rounded-xl border px-3 py-2.5 text-sm pm-body outline-none" style={{ borderColor: C.border, color: C.text }}>
            {["7:00 AM", "8:30 AM", "10:00 AM", "11:30 AM", "5:00 PM"].map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <Field label="Location" value={filters.location || "Hassan"} readOnly />
        <div>
          <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: C.textMuted }}>Expected guests (optional)</label>
          <input value={guests} onChange={(e) => setGuests(e.target.value)} placeholder="e.g. 15" className="w-full rounded-xl border px-3 py-2.5 text-sm pm-body outline-none" style={{ borderColor: C.border, color: C.text }} />
        </div>
        <div>
          <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: C.textMuted }}>Notes for the Pujari</label>
          <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} className="w-full rounded-xl border px-3 py-2.5 text-sm pm-body outline-none resize-none" style={{ borderColor: C.border, color: C.text }} />
        </div>
        <div>
          <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: C.textMuted }}>Your phone number</label>
          <input value={phone} onChange={(e) => { setPhone(e.target.value); setError(""); }} placeholder="98XXXXXXXX" className="w-full rounded-xl border px-3 py-2.5 text-sm pm-body outline-none" style={{ borderColor: error ? C.rose : C.border, color: C.text }} />
          {error && <p className="text-xs pm-body mt-1.5 flex items-center gap-1" style={{ color: C.rose }}><AlertCircle size={12} /> {error}</p>}
        </div>

        <PrimaryButton full onClick={submit}>Send Booking Request</PrimaryButton>
        <p className="text-[11px] pm-body text-center" style={{ color: C.textFaint }}>
          This sends a request — {pj.name.split(" ")[0]} will confirm before anything is final.
        </p>
      </div>
    </div>
  );
}

function Field({ label, value, readOnly }) {
  return (
    <div>
      <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: "#736A5C" }}>{label}</label>
      <div className="rounded-xl border px-3 py-2.5 text-sm pm-body" style={{ borderColor: C.border, backgroundColor: C.paperDeep, color: C.text }}>
        {value}
      </div>
    </div>
  );
}

function ConfirmationScreen({ bookings, go }) {
  const b = bookings[bookings.length - 1];
  if (!b) return <EmptyState title="No recent booking" body="Request a booking first to see a confirmation here." action={() => go("search")} actionLabel="Find a Pujari" />;
  return (
    <div className="max-w-md mx-auto px-5 md:px-0 py-14 text-center pm-pop">
      <div className="w-16 h-16 rounded-full mx-auto flex items-center justify-center" style={{ backgroundColor: C.sagePale }}>
        <CheckCircle2 size={30} style={{ color: C.sage }} />
      </div>
      <h1 className="pm-display text-2xl font-semibold mt-5" style={{ color: C.ink }}>
        Booking Request Sent
      </h1>
      <p className="text-sm pm-body mt-2" style={{ color: C.textMuted }}>
        Your request has been sent to
      </p>
      <p className="text-base font-semibold pm-body mt-0.5" style={{ color: C.text }}>{b.pujariName}</p>

      <div className="rounded-2xl border p-5 mt-6 text-left space-y-2.5" style={{ borderColor: C.border, backgroundColor: C.card }}>
        {[["Ceremony", b.ceremony], ["Date", b.date], ["Time", b.time], ["Location", b.location]].map(([l, v]) => (
          <div key={l} className="flex items-center justify-between text-sm pm-body">
            <span style={{ color: C.textFaint }}>{l}</span>
            <span className="font-medium" style={{ color: C.text }}>{v}</span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-2" style={{ borderTop: `1px solid ${C.border}` }}>
          <span className="text-sm pm-body" style={{ color: C.textFaint }}>Status</span>
          <Badge tone="marigold">🟡 Awaiting confirmation</Badge>
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <GhostButton full onClick={() => go("landing")}>Back to Home</GhostButton>
        <PrimaryButton full onClick={() => go("bookings")}>View Booking</PrimaryButton>
      </div>
    </div>
  );
}

/* ---------------------------------- MY BOOKINGS ---------------------------------- */

function BookingsScreen({ bookings, go }) {
  const [tab, setTab] = useState("pending");
  const filtered = bookings.filter((b) =>
    tab === "pending" ? b.status === "Awaiting confirmation" : tab === "upcoming" ? b.status === "Confirmed" : b.status === "Completed"
  );
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <h1 className="pm-display text-2xl font-semibold mb-5" style={{ color: C.ink }}>
        My Bookings
      </h1>
      <div className="flex gap-2 mb-5">
        {[["pending", "Pending"], ["upcoming", "Upcoming"], ["completed", "Completed"]].map(([k, l]) => (
          <button
            key={k}
            onClick={() => setTab(k)}
            className="px-4 py-2 rounded-full text-xs font-semibold pm-body border"
            style={{
              borderColor: tab === k ? C.marigold : C.border,
              backgroundColor: tab === k ? C.marigoldPale : "transparent",
              color: tab === k ? C.marigoldDeep : C.textMuted,
            }}
          >
            {l}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <EmptyState
          title={tab === "pending" ? "No pending requests" : tab === "upcoming" ? "No upcoming bookings" : "No completed bookings yet"}
          body="Once you request a Pujari, your booking will show up here with its status."
          action={() => go("search")}
          actionLabel="Find a Pujari"
          icon={ScrollText}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((b) => {
            const pj = PUJARIS.find((p) => p.id === b.pujariId);
            return (
              <div key={b.id} className="rounded-xl border p-4 flex items-center gap-3" style={{ borderColor: C.border, backgroundColor: C.card }}>
                <div className="w-11 h-11 rounded-lg flex items-center justify-center text-sm font-bold pm-display shrink-0" style={{ backgroundColor: pj?.color || C.ink, color: "#fff" }}>
                  {pj?.initials || "?"}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold pm-body" style={{ color: C.text }}>{b.ceremony}</p>
                  <p className="text-xs pm-body" style={{ color: C.textFaint }}>{b.pujariName} · {b.date} · {b.time} · {b.location}</p>
                </div>
                <Badge tone={b.status === "Confirmed" ? "sage" : b.status === "Completed" ? "ink" : "marigold"}>
                  {b.status === "Awaiting confirmation" ? "🟡 Pending" : b.status}
                </Badge>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function SavedScreen({ saved, go, toggleSave, filters }) {
  const list = PUJARIS.filter((p) => saved.has(p.id));
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <h1 className="pm-display text-2xl font-semibold mb-5" style={{ color: C.ink }}>
        Saved Pujaris
      </h1>
      {list.length === 0 ? (
        <EmptyState title="You haven't saved any Pujaris" body="Tap the heart icon on a Pujari's card to save them here for later." action={() => go("search")} actionLabel="Find a Pujari" icon={Heart} />
      ) : (
        <div className="space-y-4">
          {list.map((pj) => (
            <PujariCard
              key={pj.id}
              pj={pj}
              match={computeMatch(pj, filters)}
              saved
              toggleSave={toggleSave}
              compareChecked={false}
              toggleCompare={() => {}}
              onView={() => go("profile")}
              onBook={() => go("booking")}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------------------------- JOIN AS PUJARI ---------------------------------- */

function JoinScreen({ go }) {
  return (
    <div className="max-w-lg mx-auto px-5 md:px-0 py-8 md:py-14 pb-28 md:pb-14 pm-rise">
      <h1 className="pm-display text-2xl md:text-3xl font-semibold" style={{ color: C.ink }}>
        Grow your Pujari practice with PujaMitra
      </h1>
      <p className="text-sm pm-body mt-2 mb-6" style={{ color: C.textMuted }}>
        Connect with families looking for Pujaris in your area.
      </p>

      <div className="grid grid-cols-2 gap-3 mb-7">
        {[
          ["Get discovered", Eye],
          ["Showcase experience", Sparkles],
          ["Receive requests", ScrollText],
          ["Build reviews", Star],
        ].map(([l, Icon]) => (
          <div key={l} className="rounded-xl border p-3.5 flex items-center gap-2.5" style={{ borderColor: C.border, backgroundColor: C.card }}>
            <Icon size={16} style={{ color: C.marigoldDeep }} />
            <span className="text-xs font-medium pm-body" style={{ color: C.text }}>{l}</span>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border p-5 space-y-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
        {["Full name", "Phone number", "Service location", "Years of experience"].map((l) => (
          <div key={l}>
            <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: C.textMuted }}>{l}</label>
            <input className="w-full rounded-xl border px-3 py-2.5 text-sm pm-body outline-none" style={{ borderColor: C.border, color: C.text }} placeholder={l} />
          </div>
        ))}
        <div>
          <label className="text-xs font-semibold pm-body mb-1.5 block" style={{ color: C.textMuted }}>Ceremonies you perform</label>
          <div className="flex flex-wrap gap-2">
            {CEREMONIES.slice(0, 5).map((c) => (
              <span key={c.id} className="text-xs px-2.5 py-1 rounded-full pm-body border" style={{ borderColor: C.border, color: C.textMuted }}>
                {c.glyph} {c.label}
              </span>
            ))}
          </div>
        </div>
        <PrimaryButton full onClick={() => go("pujariDashboard")}>Create Pujari Profile</PrimaryButton>
      </div>
    </div>
  );
}

/* ---------------------------------- PUJARI DASHBOARD ---------------------------------- */

function PujariDashboard({ go }) {
  const [requests, setRequests] = useState([
    { id: "r1", ceremony: "Gruhapravesha", date: "27 Sept", location: "Hassan", price: 3500, status: "pending" },
    { id: "r2", ceremony: "Satyanarayana Puja", date: "3 Oct", location: "Hassan", price: 2500, status: "pending" },
  ]);
  const act = (id, status) => setRequests((r) => r.map((x) => (x.id === id ? { ...x, status } : x)));

  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <div className="flex items-center justify-between mb-1">
        <h1 className="pm-display text-2xl font-semibold" style={{ color: C.ink }}>Pujari Dashboard</h1>
        <DemoTag />
      </div>
      <p className="text-xs pm-body mb-6" style={{ color: C.textFaint }}>Viewing as Sri Raghavendra Sharma</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[["Today", "1"], ["Upcoming", "4"], ["Profile views", "38"], ["Rating", "4.9"]].map(([l, v]) => (
          <div key={l} className="rounded-xl border p-3.5" style={{ borderColor: C.border, backgroundColor: C.card }}>
            <p className="pm-display text-xl font-semibold" style={{ color: C.ink }}>{v}</p>
            <p className="text-[11px] pm-body" style={{ color: C.textFaint }}>{l}</p>
          </div>
        ))}
      </div>

      <div className="rounded-xl border p-4 mb-6 flex items-center justify-between" style={{ borderColor: C.border, backgroundColor: C.marigoldPale }}>
        <span className="text-xs font-medium pm-body" style={{ color: C.marigoldDeep }}>Profile completeness</span>
        <span className="text-xs font-bold pm-body" style={{ color: C.marigoldDeep }}>82%</span>
      </div>

      <SectionLabel>Booking requests</SectionLabel>
      <div className="space-y-3">
        {requests.map((r) => (
          <div key={r.id} className="rounded-xl border p-4" style={{ borderColor: C.border, backgroundColor: C.card }}>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold pm-body" style={{ color: C.text }}>{r.ceremony}</p>
              <span className="text-sm font-semibold pm-body" style={{ color: C.text }}>{inr(r.price)}</span>
            </div>
            <p className="text-xs pm-body mt-1" style={{ color: C.textFaint }}>{r.date} · {r.location}</p>
            {r.status === "pending" ? (
              <div className="flex gap-2 mt-3">
                <button onClick={() => act(r.id, "accepted")} className="flex-1 rounded-lg py-2 text-xs font-semibold pm-body" style={{ backgroundColor: C.sage, color: "#fff" }}>Accept</button>
                <button onClick={() => act(r.id, "rejected")} className="flex-1 rounded-lg py-2 text-xs font-semibold pm-body border" style={{ borderColor: C.border, color: C.textMuted }}>Reject</button>
              </div>
            ) : (
              <Badge tone={r.status === "accepted" ? "sage" : "rose"}>{r.status === "accepted" ? "Accepted" : "Rejected"}</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------------------------- ADMIN ---------------------------------- */

function AdminScreen({ go }) {
  const [pending, setPending] = useState([
    { id: "v1", name: "Sri Demo Pujari", docs: "Aadhaar + reference call" },
  ]);
  return (
    <div className="max-w-2xl mx-auto px-5 md:px-0 py-7 pb-28 md:pb-14 pm-rise">
      <div className="flex items-center justify-between mb-1">
        <h1 className="pm-display text-2xl font-semibold" style={{ color: C.ink }}>Admin — Trust & Verification</h1>
        <DemoTag />
      </div>
      <p className="text-xs pm-body mb-6" style={{ color: C.textFaint }}>How PujaMitra keeps the network trustworthy</p>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[["Pujaris", "8"], ["Verified", "6"], ["Bookings", "1"], ["Reports", "0"]].map(([l, v]) => (
          <div key={l} className="rounded-xl border p-3.5" style={{ borderColor: C.border, backgroundColor: C.card }}>
            <p className="pm-display text-xl font-semibold" style={{ color: C.ink }}>{v}</p>
            <p className="text-[11px] pm-body" style={{ color: C.textFaint }}>{l}</p>
          </div>
        ))}
      </div>

      <SectionLabel>Pending verification</SectionLabel>
      {pending.length === 0 ? (
        <EmptyState title="Nothing pending" body="All submitted Pujari profiles have been reviewed." icon={ShieldCheck} />
      ) : (
        pending.map((p) => (
          <div key={p.id} className="rounded-xl border p-4 flex items-center justify-between" style={{ borderColor: C.border, backgroundColor: C.card }}>
            <div>
              <p className="text-sm font-semibold pm-body" style={{ color: C.text }}>{p.name}</p>
              <p className="text-xs pm-body" style={{ color: C.textFaint }}>Documents: {p.docs}</p>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setPending([])} className="rounded-lg px-3 py-1.5 text-xs font-semibold pm-body" style={{ backgroundColor: C.sage, color: "#fff" }}>Approve</button>
              <button onClick={() => setPending([])} className="rounded-lg px-3 py-1.5 text-xs font-semibold pm-body border" style={{ borderColor: C.border, color: C.textMuted }}>Reject</button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------------------------- APP ---------------------------------- */

export default function PujaMitraPrototype() {
  const [screen, setScreen] = useState("landing");
  const [selectedId, setSelectedId] = useState("p1");
  const [saved, setSaved] = useState(new Set());
  const [compareIds, setCompareIds] = useState(new Set());
  const [bookings, setBookings] = useState([]);
  const [filters, setFilters] = useState({
    ceremony: "gruhapravesha",
    location: "Hassan, Karnataka",
    date: "2026-09-27",
    language: "Kannada",
    budgetMin: 2500,
    budgetMax: 5000,
  });

  const go = (target, patch) => {
    if (patch) setFilters((f) => ({ ...f, ...patch }));
    setScreen(target);
    window.scrollTo?.({ top: 0, behavior: "instant" });
  };

  const toggleSave = (id) =>
    setSaved((s) => {
      const next = new Set(s);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const toggleCompare = (id) =>
    setCompareIds((s) => {
      const next = new Set(s);
      if (next.has(id)) next.delete(id);
      else if (next.size < 3) next.add(id);
      return next;
    });

  const addBooking = (b) => setBookings((list) => [...list, b]);

  const screens = {
    landing: <Landing go={go} />,
    search: <SearchScreen filters={filters} setFilters={setFilters} go={go} />,
    results: (
      <ResultsScreen
        filters={filters}
        go={go}
        saved={saved}
        toggleSave={toggleSave}
        compareIds={compareIds}
        toggleCompare={toggleCompare}
        setSelectedId={setSelectedId}
      />
    ),
    profile: (
      <ProfileScreen
        id={selectedId}
        go={go}
        saved={saved}
        toggleSave={toggleSave}
        filters={filters}
        setSelectedId={setSelectedId}
        compareIds={compareIds}
        toggleCompare={toggleCompare}
      />
    ),
    compare: <CompareScreen compareIds={compareIds} go={go} filters={filters} setSelectedId={setSelectedId} />,
    booking: <BookingScreen id={selectedId} filters={filters} go={go} addBooking={addBooking} />,
    confirmation: <ConfirmationScreen bookings={bookings} go={go} />,
    bookings: <BookingsScreen bookings={bookings} go={go} />,
    saved: <SavedScreen saved={saved} go={go} toggleSave={toggleSave} filters={filters} />,
    join: <JoinScreen go={go} />,
    pujariDashboard: <PujariDashboard go={go} />,
    admin: <AdminScreen go={go} />,
  };

  return (
    <div className="min-h-screen pm-body" style={{ backgroundColor: C.paper }}>
      {FONTS}
      <TopBar go={go} screen={screen} />
      {screens[screen]}
      <BottomNav go={go} screen={screen} />
    </div>
  );
}
