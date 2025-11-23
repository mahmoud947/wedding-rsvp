"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

type FormState = {
  name: string;
  email: string;
  status: "coming" | "have_fun";
  message: string;
};

export default function WeddingPage() {
  const [form, setForm] = useState<FormState>({
    name: "",
    email: "",
    status: "coming",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<null | { type: "ok" | "error"; msg: string }>(
    null
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value as any }));
  };

  const handleSubmit = async () => {
    if (!form.name || !form.email) {
      setResult({
        type: "error",
        msg: "Please fill in all required fields",
      });
      return;
    }
    
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed");

      setResult({
        type: "ok",
        msg:
          form.status === "coming"
            ? "شكراً! Check your email for the calendar invite 💌"
            : "شكراً! Your message reached us ❤️",
      });

      setForm({ name: "", email: "", status: "coming", message: "" });
    } catch (err) {
      setResult({
        type: "error",
        msg: "Something went wrong, try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Matrix-style code rain background */}
      <CodeRain />
      
      {/* Animated gradient orbs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-20 h-96 w-96 rounded-full bg-gradient-to-br from-pink-500/40 to-purple-500/40 blur-3xl"
        animate={{ 
          scale: [1, 1.2, 1],
          x: [0, 50, 0],
          y: [0, -30, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-cyan-500/40 to-blue-500/40 blur-3xl"
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, -50, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-gradient-to-br from-emerald-500/30 to-teal-500/30 blur-3xl"
        animate={{ 
          scale: [1, 1.1, 1],
          x: [0, 30, 0],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating code symbols */}
      <FloatingCodeSymbols />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-10 lg:flex-row lg:items-stretch">
          {/* LEFT - Hero Section */}
          <motion.section
            className="flex-1 space-y-6"
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            {/* Terminal-style header */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-emerald-500/30 bg-slate-900/80 p-4 backdrop-blur-xl"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              whileHover={{ scale: 1.02 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 via-transparent to-cyan-500/10 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="flex items-center gap-2 mb-2">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500" />
                </div>
                <span className="text-xs text-slate-400 font-mono">~/wedding-invitation</span>
              </div>
              <div className="font-mono text-sm space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-400">$</span>
                  <TypewriterText text="git commit -m 'Two hearts merged successfully ❤️'" />
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2 }}
                  className="text-slate-400 text-xs"
                >
                  [main 💍] Two hearts merged successfully ❤️
                </motion.div>
              </div>
            </motion.div>

            {/* Main heading with glitch effect */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.8 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 rounded-full border border-pink-500/30 bg-pink-500/10 px-4 py-2 backdrop-blur-md"
                animate={{ 
                  boxShadow: [
                    "0 0 20px rgba(236, 72, 153, 0.3)",
                    "0 0 40px rgba(236, 72, 153, 0.5)",
                    "0 0 20px rgba(236, 72, 153, 0.3)",
                  ]
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span 
                  className="text-2xl"
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  💻
                </motion.span>
                <span className="text-xs font-mono uppercase tracking-[0.3em] text-pink-300">
                  Wedding.init()
                </span>
              </motion.div>

              <h1 className="text-balance text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
                <motion.span
                  className="inline-block bg-gradient-to-r from-white via-slate-200 to-white bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Mahmoud
                </motion.span>
                {" "}
                <motion.span
                  className="inline-block text-pink-400"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  &amp;
                </motion.span>
                {" "}
                <motion.span
                  className="inline-block bg-gradient-to-r from-pink-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent"
                  animate={{ 
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Sajda
                </motion.span>
              </h1>

              {/* Code-style subtitle */}
              <motion.div
                className="rounded-xl border border-slate-700/50 bg-slate-900/50 p-4 font-mono text-sm backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <div className="space-y-1 text-slate-300">
                  <div><span className="text-purple-400">class</span> <span className="text-cyan-400">Wedding</span> &#123;</div>
                  <div className="pl-4"><span className="text-pink-400">SeniorAndroidDev</span> mahmoud;</div>
                  <div className="pl-4"><span className="text-emerald-400">BackendDev</span> sajda;</div>
                  <div className="pl-4 text-slate-500">// Two developers, one love story 💕</div>
                  <div>&#125;</div>
                </div>
              </motion.div>
            </motion.div>

            {/* Info cards with tech styling */}
            <motion.div
              className="grid gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.8 }}
            >
              <TechInfoCard 
                icon="📅" 
                label="DATE" 
                value="20 Dec 2025"
                color="from-pink-500 to-purple-500"
              />
              <TechInfoCard 
                icon="⏰" 
                label="TIME" 
                value="7:00 PM"
                color="from-cyan-500 to-blue-500"
              />
              <TechInfoCard 
                icon="📍" 
                label="LOCATION" 
                value="Cairo, Egypt"
                color="from-emerald-500 to-teal-500"
              />
            </motion.div>

            {/* Timeline */}
            <motion.div
              className="group relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-slate-900/90 to-slate-800/90 p-6 backdrop-blur-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2, duration: 0.8 }}
              whileHover={{ scale: 1.02, borderColor: "rgba(236, 72, 153, 0.3)" }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-pink-500/5 via-purple-500/5 to-cyan-500/5 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative">
                <p className="mb-4 flex items-center gap-2 text-xs font-mono uppercase tracking-[0.25em] text-slate-300">
                  <span className="text-lg">⚡</span>
                  EVENT TIMELINE
                </p>
                <div className="space-y-3">
                  <TimelineItem time="7:00 PM" event="Guests arrival & welcome" icon="🎯" />
                  <TimelineItem time="8:00 PM" event="Ceremony & photos" icon="💍" />
                  <TimelineItem time="9:00 PM" event="Dinner, music & dancing" icon="🎶" />
                </div>
              </div>
            </motion.div>
          </motion.section>

          {/* RIGHT - RSVP Form */}
          <motion.section
            className="flex-1 lg:max-w-xl"
            initial={{ x: 60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <motion.div
              className="group sticky top-4 overflow-hidden rounded-3xl border border-pink-500/30 bg-gradient-to-br from-slate-900/95 to-slate-800/95 p-8 shadow-2xl shadow-pink-500/20 backdrop-blur-2xl"
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.6,
                duration: 0.8,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0 0 60px rgba(236, 72, 153, 0.4)"
              }}
            >
              {/* Animated border glow */}
              <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity group-hover:opacity-100">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-xl" />
              </div>

              <motion.div
                className="relative mb-6 flex items-center justify-between gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.3em] text-pink-400">
                    RSVP.confirm()
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-white">
                    Join Our Celebration
                  </h2>
                </div>
                <motion.div
                  className="relative flex h-14 w-14 items-center justify-center"
                  animate={{ 
                    rotate: [0, 360],
                  }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                >
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 opacity-20 blur-lg" />
                  <div className="relative flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pink-500 to-purple-500">
                    <span className="text-2xl">💌</span>
                  </div>
                </motion.div>
              </motion.div>

              <div className="relative space-y-5">
                <TechInput
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name..."
                  required
                />
                <TechInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  required
                />

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.1 }}
                >
                  <label className="font-mono text-sm font-medium text-slate-200">
                    Will you join us?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    <TechChoiceButton
                      active={form.status === "coming"}
                      onClick={() => setForm((s) => ({ ...s, status: "coming" }))}
                      label="I'm coming"
                      emoji="🎉"
                    />
                    <TechChoiceButton
                      active={form.status === "have_fun"}
                      onClick={() => setForm((s) => ({ ...s, status: "have_fun" }))}
                      label="Can't make it"
                      emoji="❤️"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  <label className="font-mono text-sm font-medium text-slate-200">
                    Leave us a message
                  </label>
                  <motion.textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="// Your wishes, advice, or inside jokes..."
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-500 focus:border-pink-500/50 focus:bg-slate-950/70 focus:ring-2 focus:ring-pink-500/20"
                    whileFocus={{ scale: 1.01 }}
                  />
                </motion.div>

                <motion.button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="group relative mt-6 inline-flex w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 p-[2px] font-mono text-sm font-bold shadow-lg shadow-pink-500/50 outline-none transition disabled:cursor-not-allowed disabled:opacity-50"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className="relative flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-6 py-3 transition group-hover:bg-slate-900/50">
                    {loading ? (
                      <>
                        <motion.span
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        >
                          ⚙️
                        </motion.span>
                        Processing...
                      </>
                    ) : (
                      <>
                        <span>Send RSVP</span>
                        <motion.span
                          animate={{ x: [0, 4, 0] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          →
                        </motion.span>
                      </>
                    )}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {result && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      className={`rounded-xl border p-4 text-center font-mono text-sm ${
                        result.type === "ok"
                          ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-300"
                          : "border-rose-500/30 bg-rose-500/10 text-rose-300"
                      }`}
                    >
                      {result.msg}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

/* --- Components --- */

function TypewriterText({ text }: { text: string }) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.substring(0, i + 1));
        i++;
      } else {
        clearInterval(interval);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [text]);

  return <span className="text-slate-200">{displayText}</span>;
}

function TechInfoCard({ icon, label, value, color }: { 
  icon: string; 
  label: string; 
  value: string;
  color: string;
}) {
  return (
    <motion.div
      className="group relative overflow-hidden rounded-xl border border-white/10 bg-slate-900/80 p-4 backdrop-blur-md"
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        borderColor: "rgba(255, 255, 255, 0.2)"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 transition-opacity group-hover:opacity-10`} />
      <motion.div 
        className="mb-2 text-2xl"
        animate={{ rotate: [0, 10, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        {icon}
      </motion.div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
        {label}
      </p>
      <p className="mt-1 font-semibold text-white">{value}</p>
    </motion.div>
  );
}

function TimelineItem({ time, event, icon }: { time: string; event: string; icon: string }) {
  return (
    <motion.div
      className="group flex items-start gap-3"
      whileHover={{ x: 8 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <motion.span 
        className="mt-0.5 text-xl"
        whileHover={{ scale: 1.2, rotate: 10 }}
      >
        {icon}
      </motion.span>
      <div className="flex-1">
        <div className="font-mono text-xs text-pink-400">{time}</div>
        <div className="text-sm text-slate-200 transition-colors group-hover:text-white">{event}</div>
      </div>
    </motion.div>
  );
}

function TechInput({ label, name, value, placeholder, type = "text", required, onChange }: {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <label className="font-mono text-sm font-medium text-slate-200">{label}</label>
      <motion.input
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl border border-white/10 bg-slate-950/50 px-4 py-3 font-mono text-sm text-white outline-none placeholder:text-slate-500 focus:border-pink-500/50 focus:bg-slate-950/70 focus:ring-2 focus:ring-pink-500/20"
        whileFocus={{ scale: 1.01 }}
      />
    </motion.div>
  );
}

function TechChoiceButton({ active, label, emoji, onClick }: {
  active: boolean;
  label: string;
  emoji: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`group relative overflow-hidden rounded-xl border p-4 font-mono text-sm font-medium transition ${
        active
          ? "border-pink-500/50 bg-gradient-to-br from-pink-500/20 to-purple-500/20 text-white shadow-lg shadow-pink-500/20"
          : "border-white/10 bg-slate-950/30 text-slate-300 hover:border-white/20 hover:bg-slate-950/50"
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {active && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-pink-500/30 via-purple-500/30 to-cyan-500/30"
          animate={{ 
            backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
          style={{ backgroundSize: "200% 200%" }}
        />
      )}
      <span className="relative flex items-center justify-center gap-2">
        <span className="text-lg">{emoji}</span>
        {label}
      </span>
    </motion.button>
  );
}

function CodeRain() {
  const columns = 30;
  const symbols = "01{}[]<>/()=>;※♥♡";
  
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-20">
      {Array.from({ length: columns }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute top-0 font-mono text-xs text-emerald-400"
          style={{ 
            left: `${(i / columns) * 100}%`,
          }}
          initial={{ y: -100, opacity: 0 }}
          animate={{ 
            y: "100vh",
            opacity: [0, 1, 0.5, 0],
          }}
          transition={{
            duration: 8 + Math.random() * 4,
            repeat: Infinity,
            delay: Math.random() * 5,
            ease: "linear",
          }}
        >
          {Array.from({ length: 15 }).map((_, j) => {
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            return (
              <div key={j}>
                {randomSymbol}
              </div>
            );
          })}
        </motion.div>
      ))}
    </div>
  );
}

function FloatingCodeSymbols() {
  const symbols = [
    { text: "</>", color: "text-pink-400" },
    { text: "{ }", color: "text-cyan-400" },
    { text: "=>", color: "text-purple-400" },
    { text: "♥", color: "text-rose-400" },
    { text: "( )", color: "text-blue-400" },
    { text: "[ ]", color: "text-emerald-400" },
  ];

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {symbols.map((symbol, i) => {
        const left = `${15 + i * 15}%`;
        const delay = i * 1.2;
        const duration = 15 + i * 2;

        return (
          <motion.div
            key={i}
            className={`absolute font-mono text-4xl ${symbol.color}`}
            style={{ left, opacity: 0.15 }}
            initial={{ y: "110%", rotate: 0 }}
            animate={{ 
              y: "-10%", 
              rotate: [0, 360],
              opacity: [0, 0.15, 0.1, 0]
            }}
            transition={{
              delay,
              duration,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {symbol.text}
          </motion.div>
        );
      })}
    </div>
  );
}