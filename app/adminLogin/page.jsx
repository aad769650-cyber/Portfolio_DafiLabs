"use client";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { useRouter } from "next/navigation";

const ADMIN_EMAIL = "admin@admin.com";
const ADMIN_PASSWORD = "admin123";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Loader2,
  Check,
  AlertCircle,
  
  CheckCircle2,
  XCircle,
  X,
  Users,
  Activity,
  Server,
  Bell,
  TrendingUp,
  Fingerprint,
} from "lucide-react";
import {
  AreaChart,
  Area,
  ResponsiveContainer,
} from "recharts";


import {toast} from "sonner"

/**
 * ============================================================================
 * AdminControlCenter — premium split-screen admin login
 * ----------------------------------------------------------------------------
 * ROUTING: adapted for Next.js App Router using `useRouter` from
 * "next/navigation" and `router.push(...)` for client-side navigation.
 *
 * MOTION: animations here are hand-built with CSS keyframes + inline
 * transforms (staggered entrances, floating elements, tilt-on-hover,
 * glow-on-focus) rather than the framer-motion package, since that package
 * isn't available in this sandbox. The easing curves and stagger timings
 * are written to read the same as a Framer Motion implementation — if your
 * real project has framer-motion installed, the effects marked below can be
 * swapped for <motion.div> variants 1:1.
 * ============================================================================
 */

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CHART_DATA = [
  { v: 30 }, { v: 45 }, { v: 38 }, { v: 52 }, { v: 48 }, { v: 65 },
  { v: 58 }, { v: 72 }, { v: 68 }, { v: 80 }, { v: 76 }, { v: 92 },
];

const ACTIVITY_ROWS = [
  { label: "New admin session", time: "just now", tone: "cyan" },
  { label: "Permissions synced", time: "2m ago", tone: "violet" },
  { label: "Backup completed", time: "14m ago", tone: "emerald" },
];

const PARTICLES = Array.from({ length: 22 }, (_, i) => ({
  id: i,
  left: (i * 47) % 100,
  top: (i * 31) % 100,
  size: 2 + ((i * 7) % 4),
  delay: (i % 10) * 0.6,
  duration: 6 + (i % 5) * 2,
}));

// ---------------------------------------------------------------------------
// Shared keyframes (injected once)
// ---------------------------------------------------------------------------

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Poppins:wght@600;700&display=swap');

    @keyframes riseIn { from { opacity: 0; transform: translateY(22px); } to { opacity: 1; transform: translateY(0); } }
    @keyframes panelIn { from { opacity: 0; transform: translateY(34px) scale(0.97); } to { opacity: 1; transform: translateY(0) scale(1); } }
    @keyframes drift1 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(60px,-40px) rotate(12deg); } }
    @keyframes drift2 { 0%,100% { transform: translate(0,0) rotate(0deg); } 50% { transform: translate(-50px,50px) rotate(-10deg); } }
    @keyframes drift3 { 0%,100% { transform: translate(0,0); } 50% { transform: translate(30px,30px); } }
    @keyframes floatY { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-14px); } }
    @keyframes floatY2 { 0%,100% { transform: translateY(0); } 50% { transform: translateY(12px); } }
    @keyframes pulseDot { 0%,100% { opacity: 0.25; transform: scale(1); } 50% { opacity: 0.9; transform: scale(1.6); } }
    @keyframes glowPulse { 0%,100% { opacity: 0.5; } 50% { opacity: 1; } }
    @keyframes notifyLoop { 0%,10% { opacity: 0; transform: translateY(10px); } 18%,82% { opacity: 1; transform: translateY(0); } 92%,100% { opacity: 0; transform: translateY(-6px); } }
    @keyframes shimmer { 0% { background-position: 0% 50%; } 100% { background-position: 200% 50%; } }
    @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `}</style>
);

// ---------------------------------------------------------------------------
// Background: aurora mesh + drifting blobs + particle field
// ---------------------------------------------------------------------------

function AuroraBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 15% 20%, rgba(99,102,241,0.20), transparent 45%), radial-gradient(circle at 85% 15%, rgba(34,211,238,0.16), transparent 45%), radial-gradient(circle at 50% 90%, rgba(168,85,247,0.18), transparent 50%)",
        }}
      />
      <div
        className="absolute top-[-10%] left-[-5%] w-[38rem] h-[38rem] rounded-full blur-[110px] mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.35), transparent 70%)", animation: "drift1 18s ease-in-out infinite" }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[42rem] h-[42rem] rounded-full blur-[120px] mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(34,211,238,0.3), transparent 70%)", animation: "drift2 22s ease-in-out infinite" }}
      />
      <div
        className="absolute top-1/3 left-1/2 w-[30rem] h-[30rem] rounded-full blur-[100px] mix-blend-screen"
        style={{ background: "radial-gradient(circle, rgba(168,85,247,0.28), transparent 70%)", animation: "drift3 20s ease-in-out infinite" }}
      />
      {/* fine grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />
      {/* particles */}
      {PARTICLES.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-300"
          style={{
            left: `${p.left}%`,
            top: `${p.top}%`,
            width: p.size,
            height: p.size,
            animation: `pulseDot ${p.duration}s ease-in-out ${p.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Left panel pieces
// ---------------------------------------------------------------------------

function StatCard({ icon: Icon, label, value, trend, className, delay, floatVariant }) {
  return (
    <div
      className={`absolute rounded-2xl border border-white/10 bg-white/[0.06] backdrop-blur-xl px-4 py-3.5 shadow-2xl shadow-black/40 ${className}`}
      style={{
        animation: `riseIn 0.7s ease-out ${delay}s both, ${floatVariant} 7s ease-in-out ${delay}s infinite`,
      }}
    >
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500/30 to-cyan-400/30 flex items-center justify-center">
          <Icon className="w-4 h-4 text-cyan-300" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider text-slate-400">{label}</p>
          <p className="text-sm font-semibold text-white">{value}</p>
        </div>
        {trend && (
          <span className="ml-1 flex items-center gap-0.5 text-[10px] text-emerald-400">
            <TrendingUp className="w-3 h-3" />
            {trend}
          </span>
        )}
      </div>
    </div>
  );
}

function FloatingNotification({ className, delay, icon: Icon, text }) {
  return (
    <div
      className={`absolute rounded-xl border border-white/10 bg-white/[0.07] backdrop-blur-xl px-3.5 py-2.5 shadow-xl flex items-center gap-2 ${className}`}
      style={{ animation: `notifyLoop 9s ease-in-out ${delay}s infinite` }}
    >
      <Icon className="w-3.5 h-3.5 text-violet-300 shrink-0" />
      <span className="text-[11px] text-slate-200 whitespace-nowrap">{text}</span>
    </div>
  );
}

function LiveDashboardPreview() {
  return (
    <div
      className="absolute bottom-10 left-1/2 -translate-x-1/2 w-[19rem] rounded-2xl border border-white/10 bg-white/[0.05] backdrop-blur-2xl shadow-2xl shadow-black/50 p-4"
      style={{ animation: "riseIn 0.8s ease-out 0.5s both, floatY 9s ease-in-out 0.5s infinite" }}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-medium text-slate-300">System Activity</span>
        </div>
        <Activity className="w-3.5 h-3.5 text-slate-500" />
      </div>
      <div className="h-16 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={CHART_DATA}>
            <defs>
              <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#22d3ee" stopOpacity={0.5} />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="v"
              stroke="#67e8f9"
              strokeWidth={2}
              fill="url(#chartFill)"
              isAnimationActive
              animationDuration={1800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-2 space-y-1.5">
        {ACTIVITY_ROWS.map((row) => (
          <div key={row.label} className="flex items-center justify-between text-[10.5px]">
            <span className="flex items-center gap-1.5 text-slate-300">
              <span
                className={`w-1.5 h-1.5 rounded-full ${
                  row.tone === "cyan"
                    ? "bg-cyan-400"
                    : row.tone === "violet"
                    ? "bg-violet-400"
                    : "bg-emerald-400"
                }`}
              />
              {row.label}
            </span>
            <span className="text-slate-500">{row.time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandSide() {
  return (
    <div className="relative hidden lg:flex lg:w-[56%] min-h-screen items-center justify-center overflow-hidden bg-[#0B1120] px-12">
      <AuroraBackground />

      {/* Floating stat cards */}
      <StatCard
        icon={Users}
        label="Active Users"
        value="12,482"
        trend="+4.2%"
        className="top-[14%] left-[10%]"
        delay={0.3}
        floatVariant="floatY"
      />
      <StatCard
        icon={ShieldCheck}
        label="Security Score"
        value="98.6"
        className="top-[10%] right-[8%]"
        delay={0.6}
        floatVariant="floatY2"
      />
      <StatCard
        icon={Server}
        label="Uptime"
        value="99.99%"
        className="top-[42%] left-[4%]"
        delay={0.9}
        floatVariant="floatY"
      />

      <FloatingNotification
        icon={Bell}
        text="New login detected — Lahore, PK"
        className="top-[30%] right-[6%]"
        delay={0}
      />
      <FloatingNotification
        icon={Fingerprint}
        text="2FA verification passed"
        className="bottom-[38%] left-[8%]"
        delay={3.2}
      />

      <LiveDashboardPreview />

      {/* Central copy */}
      <div
        className="relative z-10 max-w-md text-center"
        style={{ animation: "riseIn 0.8s ease-out 0.15s both" }}
      >
        <div className="mx-auto mb-6 w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-2xl shadow-indigo-900/40">
          <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.2} />
        </div>
        <h1
          className="text-4xl font-bold tracking-tight text-white"
          style={{ fontFamily: "'Poppins', sans-serif" }}
        >
          Admin Control Center
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">
          Securely manage users, analytics, permissions, and system operations
          from one powerful dashboard.
        </p>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Right panel: form pieces
// ---------------------------------------------------------------------------

function ToastStack({ toasts, onDismiss }) {
  return (
    <div className="fixed top-5 right-5 z-[100] flex flex-col gap-3 w-[calc(100%-2.5rem)] sm:w-96" aria-live="polite">
      {toasts.map((t) => (
        <div
          key={t.id}
          role="alert"
          className={`flex items-start gap-3 rounded-2xl border px-4 py-3.5 shadow-2xl backdrop-blur-xl ${
            t.type === "success"
              ? "bg-emerald-500/10 border-emerald-400/30 text-emerald-200"
              : "bg-rose-500/10 border-rose-400/30 text-rose-200"
          }`}
          style={{ animation: "riseIn 0.35s ease-out" }}
        >
          {t.type === "success" ? (
            <CheckCircle2 className="w-5 h-5 mt-0.5 shrink-0" />
          ) : (
            <XCircle className="w-5 h-5 mt-0.5 shrink-0" />
          )}
          <p className="text-sm leading-snug flex-1">{t.message}</p>
          <button onClick={() => onDismiss(t.id)} aria-label="Dismiss notification" className="text-current/60 hover:text-current transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}

function GlowInput({ id, label, type, value, onChange, onKeyUp, icon: Icon, error, rightSlot, autoComplete, delay }) {
  const [focused, setFocused] = useState(false);
  const floated = focused || value.length > 0;

  return (
    <div className="w-full" style={{ animation: `riseIn 0.5s ease-out ${delay}s both` }}>
      <div className="relative group">
        {/* glow ring on focus */}
        <div
          className={`absolute -inset-[1.5px] rounded-2xl transition-opacity duration-300 pointer-events-none ${
            error ? "opacity-70" : focused ? "opacity-100" : "opacity-0"
          }`}
          style={{
            background: error
              ? "linear-gradient(90deg, #f43f5e, #fb7185)"
              : "linear-gradient(90deg, #6366f1, #22d3ee, #a855f7)",
            filter: "blur(6px)",
          }}
        />
        <div className="relative">
          <Icon
            className={`absolute left-4 top-1/2 -translate-y-1/2 w-4.5 h-4.5 transition-all duration-300 ${
              error ? "text-rose-400" : focused ? "text-cyan-300 scale-110" : "text-slate-500"
            }`}
          />
          <input
            id={id}
            type={type}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            autoComplete={autoComplete}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            placeholder={label}
            className={`relative w-full bg-[#0d1326] border rounded-2xl pl-11 pr-11 pt-5 pb-2 text-sm text-slate-100
              placeholder-transparent outline-none transition-all duration-200
              ${error ? "border-rose-400/50" : "border-white/10"}`}
          />
          <label
            htmlFor={id}
            className={`absolute left-11 pointer-events-none transition-all duration-200 origin-left ${
              floated ? "top-2 text-[11px] text-cyan-300" : "top-1/2 -translate-y-1/2 text-sm text-slate-500"
            }`}
          >
            {label}
          </label>
          {rightSlot}
        </div>
      </div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 flex items-center gap-1.5 text-xs text-rose-400" style={{ animation: "riseIn 0.2s ease-out" }}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}

function LoginSide() {
  // Form state
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [capsLockOn, setCapsLockOn] = useState(false);
  const router = useRouter();

  // Tilt effect
  const panelRef = useRef(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const handleMouseMove = (e) => {
    const rect = panelRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -4, y: px * 6 });
  };
  const resetTilt = () => setTilt({ x: 0, y: 0 });

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toastId = useRef(0);
  const pushToast = (type, message) => {
    const id = ++toastId.current;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => dismissToast(id), 4200);
  };
  const dismissToast = (id) => setToasts((prev) => prev.filter((t) => t.id !== id));

  // Mock navigation — swap for real router.push in your app (see file header)
  const mockNavigate = (path) => {
    console.log(`[mock navigate] → ${path}`);
    pushToast("success", `Redirecting to ${path} …`);
  };

  const validate = () => {
    const next = {};
    if (!email.trim()) next.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = "Enter a valid email address.";
    if (!password) next.password = "Password is required.";
    else if (password.length < 6) next.password = "Password must be at least 6 characters.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
 

    // Mock authentication call — replace with your real API request.
    setTimeout(() => {
       if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
        localStorage.setItem("isAuthenticate",true)
      router.push("/admin");
    
      } else {
        pushToast("error", "Invalid email or password. Please try again.");
      }
    }, 1600);
  };

  return (
    <div className="relative flex-1 min-h-screen flex items-center justify-center bg-[#0B1120] px-5 py-10 lg:px-14 overflow-hidden">
      {/* subtle right-side ambient glow, distinct from left aurora */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none lg:hidden">
        <AuroraBackground />
      </div>
      <div
        className="absolute top-[-10%] right-[-15%] w-[30rem] h-[30rem] rounded-full blur-[120px] pointer-events-none hidden lg:block"
        style={{ background: "radial-gradient(circle, rgba(99,102,241,0.22), transparent 70%)", animation: "drift1 20s ease-in-out infinite" }}
      />

      <ToastStack toasts={toasts} onDismiss={dismissToast} />

      <div
        ref={panelRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={resetTilt}
        className="relative z-10 w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.055] backdrop-blur-2xl shadow-2xl shadow-black/50 px-7 py-9 sm:px-10 sm:py-10 transition-transform duration-200 ease-out"
        style={{
          animation: "panelIn 0.7s cubic-bezier(0.16,1,0.3,1) both",
          transform: `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-7" style={{ animation: "riseIn 0.5s ease-out 0.1s both" }}>
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 via-violet-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-indigo-900/40 mb-4">
            <ShieldCheck className="w-7 h-7 text-white" strokeWidth={2.2} />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-white" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Welcome Back
          </h2>
          <p className="text-sm mt-1.5 text-slate-400">Sign in to access your admin workspace</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <GlowInput
            id="email"
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            error={errors.email}
            autoComplete="email"
            delay={0.18}
          />

          <div style={{ animation: "riseIn 0.5s ease-out 0.26s both" }}>
            <GlowInput
              id="password"
              label="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => setCapsLockOn(e.getModifierState?.("CapsLock") ?? false)}
              icon={Lock}
              error={errors.password}
              autoComplete="current-password"
              delay={0}
              rightSlot={
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4.5 h-4.5" /> : <Eye className="w-4.5 h-4.5" />}
                </button>
              }
            />
            {capsLockOn && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs text-amber-400" style={{ animation: "fadeIn 0.2s ease-out" }}>
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                Caps Lock is on
              </p>
            )}
          </div>

          {/* Remember me + Forgot password */}
          <div className="flex items-center justify-between pt-1" style={{ animation: "riseIn 0.5s ease-out 0.34s both" }}>
            <label className="flex items-center gap-2.5 cursor-pointer select-none">
              <button
                type="button"
                role="switch"
                aria-checked={rememberMe}
                onClick={() => setRememberMe((r) => !r)}
                className={`relative w-9 h-5 rounded-full transition-colors duration-200 ${
                  rememberMe ? "bg-gradient-to-r from-indigo-500 to-cyan-400" : "bg-white/10"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    rememberMe ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-xs text-slate-400">Remember me</span>
            </label>
            <a href="#forgot-password" className="text-xs font-medium text-cyan-300 hover:text-cyan-200 transition-colors focus:outline-none focus-visible:underline">
              Forgot password?
            </a>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="relative w-full mt-2 py-3.5 rounded-2xl font-semibold text-sm text-white overflow-hidden
              shadow-lg shadow-indigo-900/40 transition-all duration-200
              hover:shadow-cyan-500/30 hover:scale-[1.015] active:scale-[0.985]
              disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100
              focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60
              flex items-center justify-center gap-2"
            style={{
              animation: "riseIn 0.5s ease-out 0.42s both",
              background: "linear-gradient(90deg, #6366f1, #22d3ee, #a855f7, #6366f1)",
              backgroundSize: "300% 100%",
              ...(!isSubmitting && { animation: "riseIn 0.5s ease-out 0.42s both, shimmer 6s linear infinite" }),
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" />
                Signing in…
              </>
            ) : (
              "Sign in to dashboard"
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6" style={{ animation: "riseIn 0.5s ease-out 0.5s both" }}>
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-[11px] tracking-wide text-slate-500">OR</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Google sign-in */}
        <button
          type="button"
          onClick={() => pushToast("success", "Continuing with Google …")}
          className="w-full py-3 rounded-2xl font-medium text-sm flex items-center justify-center gap-2.5
            border border-white/10 bg-white/[0.04] text-slate-200
            transition-all duration-200 hover:bg-white/[0.08] hover:scale-[1.01] active:scale-[0.99]
            focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/40"
          style={{ animation: "riseIn 0.5s ease-out 0.58s both" }}
        >
          Sign in with Google
        </button>

        {/* Footer */}
        <div
          className="mt-8 pt-5 border-t border-white/10 text-center text-[11px] leading-relaxed text-slate-500"
          style={{ animation: "riseIn 0.5s ease-out 0.66s both" }}
        >
          © 2026 Company Name. All rights reserved.
          <br />
          <a href="#privacy" className="hover:text-cyan-300 transition-colors">Privacy Policy</a>
          <span className="mx-1.5">·</span>
          <a href="#terms" className="hover:text-cyan-300 transition-colors">Terms of Service</a>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Root
// ---------------------------------------------------------------------------

export default function AdminLogin() {
  return (
    <div
      className="min-h-screen w-full flex bg-[#0B1120]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <GlobalStyles />
      <BrandSide />
      <LoginSide />
    </div>
  );
}