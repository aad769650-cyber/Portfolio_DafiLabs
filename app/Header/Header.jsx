"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Home", href: "home" },
  { label: "About", href: "about" },
  { label: "Skills", href: "skills" },
  { label: "Projects", href: "projects" },
  { label: "Experience", href: "experience" },
  { label: "Contact", href: "contact" },
];

const SECTION_IDS = NAV_LINKS.map((link) => link.href);

const listVariants = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, x: 24 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

function useScrollSpy(sectionIds, offset = 100) {
  const [activeId, setActiveId] = useState(sectionIds[0] ?? "");
  const tickingRef = useRef(false);

  useEffect(() => {
    if (sectionIds.length === 0) return;

    const getSections = () =>
      sectionIds
        .map((id) => document.getElementById(id))
        .filter((el) => el !== null);

    const handleScroll = () => {
      if (tickingRef.current) return;
      tickingRef.current = true;

      requestAnimationFrame(() => {
        const sections = getSections();
        const scrollPosition = window.scrollY + offset;

        if (sections.length > 0) {
          let current = sections[0].id;
          for (const section of sections) {
            if (section.offsetTop <= scrollPosition) {
              current = section.id;
            }
          }
          setActiveId((prev) => (prev === current ? prev : current));
        }

        tickingRef.current = false;
      });
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [offset]);

  return activeId;
}

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const activeSection = useScrollSpy(SECTION_IDS, 120);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToSection = useCallback((id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY - 80;
    window.scrollTo({ top, behavior: "smooth" });
  }, []);

  const handleMobileNavigate = (id) => {
    setMobileOpen(false);
    window.setTimeout(() => scrollToSection(id), 150);
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 w-full border-b backdrop-blur-xl transition-colors duration-300",
        isScrolled
          ? "border-white/10 bg-[#0a0a0f]/80 shadow-[0_8px_30px_rgba(0,0,0,0.35)]"
          : "border-transparent bg-[#0a0a0f]/40"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="#home"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection("home");
          }}
          className="relative flex items-center gap-2 rounded-md text-xl font-semibold tracking-tight text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0f]"
          aria-label="Go to home section"
        >
          Mahar
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            .dev
          </span>
        </Link>

        {/* Desktop nav */}
        <nav
          className="hidden items-center gap-1 md:flex"
          aria-label="Primary navigation"
        >
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.href;
            return (
              <button
                key={link.href}
                onClick={() => scrollToSection(link.href)}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "relative rounded-full px-4 py-2 text-sm font-medium transition-colors",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                )}
              >
                {isActive && (
                  <motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full bg-white/10"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{link.label}</span>
              </button>
            );
          })}
        </nav>

        {/* CTA + mobile trigger */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => scrollToSection("contact")}
            className="hidden rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 px-5 text-sm font-medium text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] transition-transform hover:scale-[1.03] hover:opacity-90 hover:shadow-[0_0_28px_rgba(99,102,241,0.5)] md:inline-flex"
          >
            Let&apos;s Talk
          </Button>

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label={mobileOpen ? "Close menu" : "Open menu"}
                className="text-white hover:bg-white/10 md:hidden"
              >
                <AnimatePresence mode="wait" initial={false}>
                  {mobileOpen ? (
                    <motion.span
                      key="close"
                      initial={{ rotate: -90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: 90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                    >
                      <X className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  ) : (
                    <motion.span
                      key="menu"
                      initial={{ rotate: 90, opacity: 0 }}
                      animate={{ rotate: 0, opacity: 1 }}
                      exit={{ rotate: -90, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex"
                    >
                      <Menu className="h-5 w-5" aria-hidden="true" />
                    </motion.span>
                  )}
                </AnimatePresence>
              </Button>
            </SheetTrigger>

            <SheetContent
              side="right"
              className="w-[80%] border-white/10 bg-[#0a0a0f]/95 backdrop-blur-xl sm:w-[380px]"
            >
              <SheetHeader>
                <SheetTitle className="text-left text-lg font-semibold text-white">
                  Mahar
                  <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                    .dev
                  </span>
                </SheetTitle>
              </SheetHeader>

              <motion.nav
                variants={listVariants}
                initial="hidden"
                animate="show"
                aria-label="Mobile navigation"
                className="mt-8 flex flex-col gap-1"
              >
                {NAV_LINKS.map((link) => {
                  const isActive = activeSection === link.href;
                  return (
                    <motion.button
                      key={link.href}
                      variants={itemVariants}
                      onClick={() => handleMobileNavigate(link.href)}
                      aria-current={isActive ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-4 py-3 text-left text-base font-medium transition-colors",
                        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400",
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/60 hover:bg-white/5 hover:text-white"
                      )}
                    >
                      {link.label}
                    </motion.button>
                  );
                })}
              </motion.nav>

              <div className="mt-8 border-t border-white/10 pt-6">
                <Button
                  onClick={() => handleMobileNavigate("contact")}
                  className="w-full rounded-full bg-gradient-to-r from-indigo-500 to-violet-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.35)] hover:opacity-90"
                >
                  Let&apos;s Talk
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </motion.header>
  );
}