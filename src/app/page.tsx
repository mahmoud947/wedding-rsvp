"use client";

import { useState } from "react";
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    <div className="relative min-h-screen overflow-hidden bg-slate-950 text-white">
      {/* Animated gradient background */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(248,113,113,0.32),_transparent_55%),radial-gradient(circle_at_bottom,_rgba(56,189,248,0.32),_transparent_55%)]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
      />

      {/* Soft blur blobs */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 h-80 w-80 rounded-full bg-pink-500/30 blur-3xl"
        animate={{ y: [0, -20, 0], scale: [1, 1.03, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-sky-400/30 blur-3xl"
        animate={{ y: [0, 20, 0], scale: [1, 1.05, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Floating hearts */}
      <FloatingHearts />

      <main className="relative z-10 flex min-h-screen flex-col items-center justify-center px-4 py-10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 lg:flex-row lg:items-stretch">
          {/* LEFT */}
          <motion.section
            className="flex-1 space-y-6"
            initial={{ x: -40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1 backdrop-blur-md"
              initial={{ y: -10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-slate-200">
                Wedding Invitation
              </span>
            </motion.div>

            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.6 }}
            >
              <h1 className="text-balance text-4xl font-semibold tracking-tight sm:text-5xl md:text-6xl">
                Mahmoud Kamal El-Din &amp;{" "}
                <span className="text-pink-300">Sajda Abu Bakr</span>
              </h1>
              <p className="text-slate-200/80">
                Two developers, one love story – Senior Android dev × Backend dev – and
                you’re invited to our big day. Join us for code-level vibes, real-life
                romance, and a night full of fun.
              </p>
            </motion.div>

            <motion.div
              className="grid gap-4 sm:grid-cols-3"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <InfoChip title="Date" value="20 Dec 2025" emoji="📅" />
              <InfoChip title="Time" value="7:00 PM" emoji="⏰" />
              <InfoChip title="Location" value="Cairo, Egypt" emoji="📍" />
            </motion.div>

            <motion.div
              className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <p className="mb-3 text-xs font-medium uppercase tracking-[0.2em] text-slate-300">
                THE PLAN
              </p>
              <ul className="space-y-2 text-sm text-slate-100/90">
                <li>✨ 7:00 PM – Guests arrival &amp; welcome</li>
                <li>💍 8:00 PM – Ceremony &amp; photos</li>
                <li>🎶 9:00 PM – Dinner, music &amp; dancing</li>
              </ul>
            </motion.div>
          </motion.section>

          {/* RIGHT – RSVP card */}
          <motion.section
            className="flex-1 lg:max-w-lg"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div
              className="relative rounded-3xl border border-white/15 bg-white/10 p-6 shadow-[0_18px_45px_rgba(15,23,42,0.85)] backdrop-blur-2xl sm:p-8"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                delay: 0.5,
                duration: 0.5,
                type: "spring",
                stiffness: 120,
              }}
            >
              <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10" />

              <motion.div
                className="mb-4 flex items-center justify-between gap-4"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.4 }}
              >
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-200/80">
                    RSVP
                  </p>
                  <h2 className="text-lg font-semibold text-white">
                    Let us know you’re in
                  </h2>
                </div>
                <motion.div
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-pink-400/80 shadow-lg"
                  animate={{ scale: [1, 1.1, 1], rotate: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                >
                  <span className="text-xl">💌</span>
                </motion.div>
              </motion.div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <AnimatedInput
                  label="Name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
                <AnimatedInput
                  label="Email"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="we@love-you.com"
                  required
                />

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9, duration: 0.4 }}
                >
                  <label className="text-sm font-medium text-slate-100">
                    Will you join us?
                  </label>
                  <div className="flex gap-2">
                    <ChoiceChip
                      active={form.status === "coming"}
                      onClick={() => setForm((s) => ({ ...s, status: "coming" }))}
                      label="I’m coming 🎉"
                    />
                    <ChoiceChip
                      active={form.status === "have_fun"}
                      onClick={() => setForm((s) => ({ ...s, status: "have_fun" }))}
                      label="Have fun without me ❤️"
                    />
                  </div>
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.0, duration: 0.4 }}
                >
                  <label className="text-sm font-medium text-slate-100">
                    Leave us a message
                  </label>
                  <motion.textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Wishes, advice, inside jokes – we want it all 🥰"
                    className="w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300/60 focus:border-pink-300 focus:bg-white/10"
                    whileFocus={{ scale: 1.01, borderColor: "#f9a8d4" }}
                    transition={{ type: "spring", stiffness: 250, damping: 18 }}
                  />
                </motion.div>

                <motion.button
                  type="submit"
                  disabled={loading}
                  className="relative mt-3 inline-flex w-full items-center justify-center overflow-hidden rounded-full bg-gradient-to-r from-pink-500 via-fuchsia-500 to-sky-400 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-pink-500/40 outline-none transition active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                >
                  <motion.div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,transparent,rgba(255,255,255,0.5),transparent)]"
                    initial={{ x: "-150%" }}
                    animate={{ x: "150%" }}
                    transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
                  />
                  <span className="relative z-10">
                    {loading ? "Sending..." : "Send RSVP & Get Calendar Invite"}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {result && (
                    <motion.p
                      key={result.msg}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      className={`mt-2 text-center text-sm ${
                        result.type === "ok" ? "text-emerald-300" : "text-rose-300"
                      }`}
                    >
                      {result.msg}
                    </motion.p>
                  )}
                </AnimatePresence>
              </form>
            </motion.div>
          </motion.section>
        </div>
      </main>
    </div>
  );
}

/* --- Small components --- */

function InfoChip(props: { title: string; value: string; emoji?: string }) {
  return (
    <motion.div
      className="rounded-2xl border border-white/20 bg-white/5 p-3 backdrop-blur-md"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
    >
      <p className="flex items-center text-xs font-medium uppercase tracking-[0.22em] text-slate-200/80">
        {props.emoji && <span className="mr-1 text-base">{props.emoji}</span>}
        {props.title}
      </p>
      <p className="mt-1 text-sm font-semibold text-white">{props.value}</p>
    </motion.div>
  );
}

type AnimatedInputProps = {
  label: string;
  name: string;
  value: string;
  placeholder?: string;
  type?: string;
  required?: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

function AnimatedInput({
  label,
  name,
  value,
  placeholder,
  type = "text",
  required,
  onChange,
}: AnimatedInputProps) {
  return (
    <motion.div
      className="space-y-2"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <label className="text-sm font-medium text-slate-100">{label}</label>
      <motion.input
        name={name}
        type={type}
        value={value}
        required={required}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-2xl border border-white/15 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-slate-300/60 focus:border-pink-300 focus:bg-white/10"
        whileFocus={{ scale: 1.01, borderColor: "#f9a8d4" }}
        transition={{ type: "spring", stiffness: 250, damping: 18 }}
      />
    </motion.div>
  );
}

function ChoiceChip({
  active,
  label,
  onClick,
}: {
  active: boolean;
  label: string;
  onClick: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-full border px-3 py-1.5 text-xs font-medium transition ${
        active
          ? "border-pink-300 bg-pink-500/30 text-white shadow-md shadow-pink-400/40"
          : "border-white/20 bg-white/0 text-slate-100 hover:bg-white/10"
      }`}
      whileTap={{ scale: 0.96 }}
      whileHover={{ scale: 1.03 }}
    >
      {label}
    </motion.button>
  );
}

function FloatingHearts() {
  const items = Array.from({ length: 8 });

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {items.map((_, i) => {
        const left = `${10 + i * 10 + (i % 2 === 0 ? 4 : -3)}%`;
        const delay = i * 0.8;
        const duration = 9 + i * 0.7;
        const size = 18 + (i % 4) * 4;

        return (
          <motion.div
            key={i}
            className="absolute text-pink-300/70"
            style={{ left }}
            initial={{ y: "110%", opacity: 0, scale: 0.8 }}
            animate={{ y: "-10%", opacity: [0, 1, 0.8, 0], scale: [0.8, 1.05, 1] }}
            transition={{
              delay,
              duration,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <span style={{ fontSize: `${size}px` }}>❤</span>
          </motion.div>
        );
      })}
    </div>
  );
}