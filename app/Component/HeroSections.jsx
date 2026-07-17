"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Github,
  Linkedin,
  Mail,
  Twitter,
  Download,
  ArrowUpRight,
  Sparkles,
  ChevronDown,
  Rocket,
  GraduationCap,
  Users,
} from "lucide-react";
import {
  SiReact,
  SiNextdotjs,
  SiNodedotjs,
  SiExpress,
  SiMongodb,
  SiTailwindcss,
  SiTypescript,
  SiPrisma,
  SiSupabase,
} from "react-icons/si";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/* ------------------------------------------------------------------ */
/*  Static content                                                     */
/* ------------------------------------------------------------------ */

const ROLES = [
  "Full Stack Developer",
  "MERN Stack Developer",
  "Next.js Developer",
  "React Developer",
];

const SOCIAL_LINKS = [
  { label: "GitHub", href: "https://github.com/yourusername", icon: Github },
  { label: "LinkedIn", href: "https://linkedin.com/in/yourusername", icon: Linkedin },
  { label: "Email", href: "mailto:hello@mahar.dev", icon: Mail },
  { label: "Twitter / X", href: "https://twitter.com/yourusername", icon: Twitter },
];

const TECH_BADGES = [
  { label: "React", icon: SiReact, className: "top-[4%] left-[6%]", delay: 0, color: "text-[#61DAFB]" },
  { label: "Next.js", icon: SiNextdotjs, className: "top-[18%] right-[2%]", delay: 0.4, color: "text-slate-900 dark:text-white" },
  { label: "Node.js", icon: SiNodedotjs, className: "top-[42%] -left-4", delay: 0.8, color: "text-[#539E43]" },
  { label: "Express", icon: SiExpress, className: "top-[58%] right-[0%]", delay: 1.2, color: "text-slate-900 dark:text-white" },
  { label: "MongoDB", icon: SiMongodb, className: "bottom-[20%] left-[2%]", delay: 1.6, color: "text-[#47A248]" },
  { label: "Tailwind", icon: SiTailwindcss, className: "bottom-[6%] right-[10%]", delay: 2.0, color: "text-[#38BDF8]" },
  { label: "TypeScript", icon: SiTypescript, className: "top-[2%] left-[38%]", delay: 2.4, color: "text-[#3178C6]" },
  { label: "Prisma", icon: SiPrisma, className: "bottom-[36%] right-[-2%]", delay: 2.8, color: "text-slate-900 dark:text-white" },
  { label: "Supabase", icon: SiSupabase, className: "bottom-[-2%] left-[36%]", delay: 3.2, color: "text-[#3ECF8E]" },
];

const ACHIEVEMENTS = [
  { label: "Projects Completed", value: "20+", icon: Rocket, className: "-left-6 top-[8%]" },
  { label: "Years of Learning", value: "3+", icon: GraduationCap, className: "-right-6 top-[36%]" },
  { label: "Happy Clients", value: "15+", icon: Users, className: "-left-8 bottom-[18%]" },
  { label: "GitHub Contributions", value: "500+", icon: Github, className: "-right-4 bottom-[-4%]" },
];

/* ------------------------------------------------------------------ */
/*  Typewriter hook (no external dependency)                           */
/* ------------------------------------------------------------------ */

function useTypewriter(words, typingSpeed = 85, deletingSpeed = 45, pauseTime = 1600) {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[index];

    if (!deleting && subIndex === currentWord.length) {
      const pause = setTimeout(() => setDeleting(true), pauseTime);
      return () => clearTimeout(pause);
    }

    if (deleting && subIndex === 0) {
      setDeleting(false);
      setIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(
      () => setSubIndex((prev) => prev + (deleting ? -1 : 1)),
      deleting ? deletingSpeed : typingSpeed
    );
    return () => clearTimeout(timeout);
  }, [subIndex, deleting, index, words, typingSpeed, deletingSpeed, pauseTime]);

  return words[index].substring(0, subIndex);
}

/* ------------------------------------------------------------------ */
/*  Animation variants                                                  */
/* ------------------------------------------------------------------ */

const containerStagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function Hero() {
  const typedRole = useTypewriter(ROLES);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section
      id="home"
      className="relative flex min-h-screen w-full items-center overflow-hidden bg-white dark:bg-[#0a0a0f]"
      aria-label="Hero section"
    >
      {/* ---------------------------------------------------------- */}
      {/* Background layers                                          */}
      {/* ---------------------------------------------------------- */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        {/* dotted grid */}
        <div
          className="absolute inset-0 opacity-[0.35] dark:opacity-[0.25]"
          style={{
            backgroundImage:
              "radial-gradient(rgba(99,102,241,0.35) 1px, transparent 1px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* animated gradient blobs */}
        <motion.div
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-400/30 blur-3xl dark:bg-indigo-500/20"
          animate={{ x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -right-24 top-1/3 h-[28rem] w-[28rem] rounded-full bg-violet-400/25 blur-3xl dark:bg-violet-500/20"
          animate={{ x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-fuchsia-300/20 blur-3xl dark:bg-fuchsia-500/10"
          animate={{ x: [0, 25, 0], y: [0, -20, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* fade to background at edges for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-white dark:to-[#0a0a0f]" />
      </div>

      <div className="relative mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-16 px-4 py-32 sm:px-6 lg:grid-cols-2 lg:gap-12 lg:px-8">
        {/* ---------------------------------------------------------- */}
        {/* Left column — text content                                  */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial="hidden"
          animate="show"
          variants={containerStagger}
          className="flex flex-col items-start text-left"
        >
          {/* Badge */}
          <motion.div variants={fadeUp}>
            <Badge
              variant="outline"
              className="mb-6 flex items-center gap-2 rounded-full border-indigo-400/30 bg-indigo-500/5 px-4 py-1.5 text-xs font-medium text-indigo-600 dark:text-indigo-300"
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Available for Work
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            </Badge>
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp}
            className="text-4xl font-bold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-5xl lg:text-6xl"
          >
            Hi, I&apos;m{" "}
            <span className="bg-gradient-to-r from-indigo-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent bg-[length:200%_auto] animate-[gradient_6s_ease_infinite]">
              Mahar
            </span>
            <br />
            <span className="inline-flex min-h-[1.2em] items-center">
              {typedRole}
              <span className="ml-1 inline-block h-[1em] w-[2px] animate-pulse bg-indigo-500 dark:bg-indigo-400" />
            </span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={fadeUp}
            className="mt-6 max-w-lg text-base leading-relaxed text-slate-600 dark:text-white/60 sm:text-lg"
          >
            I design and build fast, scalable web applications with the MERN
            stack and Next.js—turning ideas into polished, production-ready
            products.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex flex-col gap-4 sm:flex-row"
          >
            <Button
              onClick={() => scrollToSection("projects")}
              className="group rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-6 text-sm font-medium text-white shadow-[0_0_25px_rgba(99,102,241,0.35)] transition-transform hover:scale-[1.03] hover:opacity-90 hover:shadow-[0_0_32px_rgba(99,102,241,0.5)]"
            >
              View Projects
              <ArrowUpRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
            </Button>

            <Button
              asChild
              variant="outline"
              className="rounded-full border-slate-300 bg-white/60 px-6 py-6 text-sm font-medium text-slate-900 backdrop-blur-xl transition-transform hover:scale-[1.03] hover:bg-white/80 dark:border-white/15 dark:bg-white/5 dark:text-white dark:hover:bg-white/10"
            >
              <a href="/resume.pdf" download aria-label="Download resume">
                Download Resume
                <Download className="ml-1.5 h-4 w-4" />
              </a>
            </Button>
          </motion.div>

          {/* Social icons */}
          <motion.div
            variants={fadeUp}
            className="mt-10 flex items-center gap-3"
            aria-label="Social media links"
          >
            {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
              <motion.a
                key={label}
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                aria-label={label}
                whileHover={{ y: -4, scale: 1.08 }}
                whileTap={{ scale: 0.94 }}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white/60 text-slate-600 shadow-sm backdrop-blur-xl transition-colors hover:border-indigo-400/50 hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:border-white/10 dark:bg-white/5 dark:text-white/70 dark:hover:text-white"
              >
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </motion.a>
            ))}
          </motion.div>
        </motion.div>

        {/* ---------------------------------------------------------- */}
        {/* Right column — visual                                       */}
        {/* ---------------------------------------------------------- */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          className="relative mx-auto hidden aspect-square w-full max-w-md items-center justify-center lg:flex"
        >
          {/* rotating glow ring */}
          <motion.div
            className="absolute inset-6 rounded-full bg-[conic-gradient(from_0deg,rgba(99,102,241,0.5),rgba(217,70,239,0.4),rgba(99,102,241,0.5))] blur-2xl"
            animate={{ rotate: 360 }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            aria-hidden="true"
          />

          {/* profile image container */}
          <div className="relative flex h-72 w-72 items-center justify-center rounded-[2rem] border border-white/40 bg-white/40 p-2 shadow-[0_20px_60px_rgba(99,102,241,0.25)] backdrop-blur-xl dark:border-white/10 dark:bg-white/5 sm:h-80 sm:w-80">
            <div className="relative h-full w-full overflow-hidden rounded-[1.6rem]">
              <Image
                src="/profile.jpg"
                alt="Portrait of Mahar, full stack developer"
                fill
                loading="lazy"
                sizes="(max-width: 1024px) 0px, 320px"
                className="object-cover"
              />
            </div>
          </div>

          {/* floating tech badges */}
          {TECH_BADGES.map(({ label, icon: Icon, className, delay, color }) => (
            <motion.div
              key={label}
              className={cn(
                "absolute flex items-center gap-1.5 rounded-full border border-white/40 bg-white/70 px-3 py-1.5 text-xs font-medium text-slate-700 shadow-md backdrop-blur-xl dark:border-white/10 dark:bg-white/10 dark:text-white/80",
                className
              )}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 4.5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay,
              }}
            >
              <Icon className={cn("h-3.5 w-3.5", color)} aria-hidden="true" />
              {label}
            </motion.div>
          ))}

          {/* floating achievement cards */}
          {ACHIEVEMENTS.map(({ label, value, icon: Icon, className }, i) => (
            <motion.div
              key={label}
              className={cn("absolute w-40", className)}
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "mirror",
                ease: "easeInOut",
                delay: i * 0.6,
              }}
            >
              <Card className="border-white/40 bg-white/70 shadow-lg backdrop-blur-xl dark:border-white/10 dark:bg-white/10">
                <CardContent className="flex items-center gap-3 p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-white">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div className="leading-tight">
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      {value}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-white/50">
                      {label}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Scroll indicator                                            */}
      {/* ---------------------------------------------------------- */}
      <motion.button
        onClick={() => scrollToSection("about")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        aria-label="Scroll to About section"
        className="absolute bottom-8 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-slate-400 transition-colors hover:text-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 dark:text-white/40 dark:hover:text-white"
      >
        <span className="text-[11px] font-medium uppercase tracking-widest">
          Scroll
        </span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" aria-hidden="true" />
        </motion.span>
      </motion.button>

      {/* keyframes for the animated gradient text */}
      <style jsx global>{`
        @keyframes gradient {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
      `}</style>
    </section>
  );
}