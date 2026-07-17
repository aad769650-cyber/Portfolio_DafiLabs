'use client'

import { useState, useEffect, useCallback } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid,
} from 'recharts'

// React Icons only — no Lucide
import { FaGoogle, FaGithub, FaLinkedin, FaTwitter, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'
import { IoLogOutOutline, IoCheckmarkCircle, IoSend, IoPerson, IoMail, IoLockClosed } from 'react-icons/io5'
import { MdOutlineMessage, MdDashboard, MdTrendingUp } from 'react-icons/md'
import { BsShieldCheck, BsClockHistory } from 'react-icons/bs'

// import { supabase } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'

// ─── Constants ───────────────────────────────────────────────────────────────

const CONTACT_INFO = [
  { icon: FaEnvelope, label: 'Email', value: 'hello@portfolio.dev', href: 'mailto:hello@portfolio.dev' },
  { icon: FaPhone, label: 'Phone', value: '+1 (555) 123-4567', href: 'tel:+15551234567' },
  { icon: FaMapMarkerAlt, label: 'Location', value: 'San Francisco, CA', href: null },
]

const SOCIAL_LINKS = [
  { icon: FaGithub, href: 'https://github.com', label: 'GitHub' },
  { icon: FaLinkedin, href: 'https://linkedin.com', label: 'LinkedIn' },
  { icon: FaTwitter, href: 'https://twitter.com', label: 'Twitter' },
]

const STATS_CARDS = [
  { label: 'Response Rate', value: '98%', icon: BsShieldCheck },
  { label: 'Avg. Reply', value: '< 2h', icon: BsClockHistory },
  { label: 'Projects', value: '50+', icon: MdTrendingUp },
]

const WEEKLY_DATA = [
  { day: 'Mon', messages: 4 },
  { day: 'Tue', messages: 7 },
  { day: 'Wed', messages: 5 },
  { day: 'Thu', messages: 12 },
  { day: 'Fri', messages: 8 },
  { day: 'Sat', messages: 3 },
  { day: 'Sun', messages: 2 },
]

const MONTHLY_DATA = [
  { month: 'Jan', messages: 28 },
  { month: 'Feb', messages: 35 },
  { month: 'Mar', messages: 42 },
  { month: 'Apr', messages: 38 },
  { month: 'May', messages: 51 },
  { month: 'Jun', messages: 47 },
]

const CATEGORY_DATA = [
  { name: 'General', value: 35, color: '#6366f1' },
  { name: 'Project', value: 28, color: '#8b5cf6' },
  { name: 'Support', value: 18, color: '#ec4899' },
  { name: 'Partnership', value: 19, color: '#14b8a6' },
]

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#ec4899', '#14b8a6']

// ─── Zod Schemas ─────────────────────────────────────────────────────────────

const passwordRules = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Must contain an uppercase letter')
  .regex(/[a-z]/, 'Must contain a lowercase letter')
  .regex(/[0-9]/, 'Must contain a number')
  .regex(/[^A-Za-z0-9]/, 'Must contain a special character')

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

const signupSchema = z
  .object({
    fullName: z.string().min(2, 'Full name is required'),
    email: z.string().min(1, 'Email is required').email('Invalid email address'),
    password: passwordRules,
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  subject: z.string().min(3, 'Subject is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
})

// ─── Animation Variants ────────────────────────────────────────────────────────

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
}

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
}

const scaleHover = {
  rest: { scale: 1 },
  hover: { scale: 1.02, transition: { duration: 0.2 } },
}

const formSwitch = {
  initial: { opacity: 0, x: 20, scale: 0.98 },
  animate: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -20, scale: 0.98, transition: { duration: 0.25 } },
}

// ─── Helper Components ─────────────────────────────────────────────────────────

function BlobBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <motion.div
        animate={{ x: [0, 30, 0], y: [0, -20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, -25, 0], y: [0, 25, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute -right-32 top-1/4 h-80 w-80 rounded-full bg-violet-500/15 blur-[100px]"
      />
      <motion.div
        animate={{ x: [0, 20, 0], y: [0, 15, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-pink-500/10 blur-[100px]"
      />
    </div>
  )
}

function GlassCard({ children, className = '', glow = false }) {
  return (
    <motion.div
      variants={scaleHover}
      initial="rest"
      whileHover="hover"
      className={`relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-6 shadow-xl shadow-black/20 backdrop-blur-xl dark:bg-white/[0.03] ${
        glow ? 'transition-shadow duration-300 hover:shadow-indigo-500/20' : ''
      } ${className}`}
    >
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-indigo-500/10 via-transparent to-violet-500/10" />
      <div className="relative z-10">{children}</div>
    </motion.div>
  )
}

function GradientBorder({ children, className = '' }) {
  return (
    <div className={`relative rounded-2xl p-[1px] bg-gradient-to-br from-indigo-500/50 via-violet-500/30 to-pink-500/50 ${className}`}>
      <div className="rounded-2xl bg-zinc-950/90 backdrop-blur-xl">{children}</div>
    </div>
  )
}

function RippleButton({ children, onClick, disabled, type = 'button', variant = 'default', className = '' }) {
  const [ripples, setRipples] = useState([])

  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const id = Date.now()
    setRipples((prev) => [...prev, { id, x, y }])
    setTimeout(() => setRipples((prev) => prev.filter((r) => r.id !== id)), 600)
    onClick?.(e)
  }

  return (
    <Button
      type={type}
      variant={variant}
      disabled={disabled}
      onClick={handleClick}
      className={`relative overflow-hidden ${className}`}
    >
      {ripples.map((r) => (
        <motion.span
          key={r.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 4, opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute h-8 w-8 rounded-full bg-white/30"
          style={{ left: r.x - 16, top: r.y - 16 }}
        />
      ))}
      {children}
    </Button>
  )
}

function FieldError({ message }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.p
          initial={{ opacity: 0, y: -4, height: 0 }}
          animate={{ opacity: 1, y: 0, height: 'auto' }}
          exit={{ opacity: 0, y: -4, height: 0 }}
          className="mt-1.5 text-xs text-red-400"
        >
          {message}
        </motion.p>
      )}
    </AnimatePresence>
  )
}

function PasswordStrength({ password = '' }) {
  const checks = [
    { label: '8+ chars', valid: password.length >= 8 },
    { label: 'Uppercase', valid: /[A-Z]/.test(password) },
    { label: 'Lowercase', valid: /[a-z]/.test(password) },
    { label: 'Number', valid: /[0-9]/.test(password) },
    { label: 'Special', valid: /[^A-Za-z0-9]/.test(password) },
  ]
  const score = checks.filter((c) => c.valid).length
  const colors = ['bg-red-500', 'bg-orange-500', 'bg-yellow-500', 'bg-lime-500', 'bg-emerald-500']
  const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong']

  return (
    <div className="space-y-2">
      <div className="flex gap-1">
        {checks.map((_, i) => (
          <motion.div
            key={i}
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            className={`h-1 flex-1 origin-left rounded-full transition-colors duration-300 ${
              i < score ? colors[score - 1] : 'bg-white/10'
            }`}
          />
        ))}
      </div>
      <div class="flex flex-wrap gap-2">
        {checks.map((check) => (
          <span
            key={check.label}
            className={`text-[10px] font-medium transition-colors ${
              check.valid ? 'text-emerald-400' : 'text-zinc-500'
            }`}
          >
            {check.valid ? '✓' : '○'} {check.label}
          </span>
        ))}
      </div>
      {password && (
        <p className="text-xs text-zinc-400">{labels[Math.max(0, score - 1)]}</p>
      )}
    </div>
  )
}

function SuccessCheckmark() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 15 }}
      className="flex flex-col items-center gap-3 py-6"
    >
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: 'spring', stiffness: 300 }}
      >
        <IoCheckmarkCircle className="h-16 w-16 text-emerald-400" />
      </motion.div>
      <p className="text-lg font-medium text-white">Message Sent!</p>
    </motion.div>
  )
}

function DashboardPreview() {
  const dashboardStats = [
    { label: 'Total Messages', value: '247', change: '+12%' },
    { label: "Today's Messages", value: '8', change: '+3' },
    { label: 'Last Message', value: '2 min ago', change: null },
    { label: 'User Status', value: 'Active', change: 'Online' },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="mt-8 space-y-6"
    >
      <div className="flex items-center gap-2">
        <MdDashboard className="h-5 w-5 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Dashboard Preview</h3>
      </div>

      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {dashboardStats.map((stat, i) => (
          <motion.div
            key={stat.label}
            custom={i}
            variants={fadeUp}
            initial="hidden"
            animate="visible"
          >
            <GlassCard className="p-4">
              <p className="text-xs text-zinc-400">{stat.label}</p>
              <p className="mt-1 text-xl font-bold text-white">{stat.value}</p>
              {stat.change && (
                <Badge variant="secondary" className="mt-2 bg-indigo-500/20 text-indigo-300">
                  {stat.change}
                </Badge>
              )}
            </GlassCard>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <GlassCard glow>
          <p className="mb-4 text-sm font-medium text-zinc-300">Weekly Messages</p>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={WEEKLY_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="day" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #ffffff10',
                  borderRadius: '8px',
                }}
              />
              <Bar dataKey="messages" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard glow>
          <p className="mb-4 text-sm font-medium text-zinc-300">Monthly Messages</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={MONTHLY_DATA}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="month" stroke="#71717a" fontSize={12} />
              <YAxis stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #ffffff10',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="messages"
                stroke="#8b5cf6"
                fill="url(#areaGrad)"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard glow>
          <p className="mb-4 text-sm font-medium text-zinc-300">Contact Categories</p>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={CATEGORY_DATA}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {CATEGORY_DATA.map((entry, index) => (
                  <Cell key={entry.name} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #ffffff10',
                  borderRadius: '8px',
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </GlassCard>

        <GlassCard glow>
          <p className="mb-4 text-sm font-medium text-zinc-300">Response Rate</p>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart
              data={[
                { week: 'W1', rate: 92 },
                { week: 'W2', rate: 94 },
                { week: 'W3', rate: 96 },
                { week: 'W4', rate: 98 },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" />
              <XAxis dataKey="week" stroke="#71717a" fontSize={12} />
              <YAxis domain={[80, 100]} stroke="#71717a" fontSize={12} />
              <Tooltip
                contentStyle={{
                  background: '#18181b',
                  border: '1px solid #ffffff10',
                  borderRadius: '8px',
                }}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#14b8a6"
                fill="#14b8a620"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </GlassCard>
      </div>
    </motion.div>
  )
}

function AuthForm({ onAuthSuccess }) {
  const [authTab, setAuthTab] = useState('login')
  const [loading, setLoading] = useState(false)

  const loginForm = useForm({ resolver: zodResolver(loginSchema), mode: 'onChange' })
  const signupForm = useForm({ resolver: zodResolver(signupSchema), mode: 'onChange' })

  const watchPassword = signupForm.watch('password', '')

  const handleLogin = async (data) => {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    })
    setLoading(false)
    if (error) {
      toast.error(error.message)
      return
    }
    toast.success('Welcome back!')
    onAuthSuccess()
  }

  const handleSignup = async (data) => {
    // setLoading(true)
    // const { error } = await supabase.auth.signUp({
    //   email: data.email,
    //   password: data.password,
    //   options: { data: { full_name: data.fullName } },
    // })
    // setLoading(false)
    // if (error) {
    //   toast.error(error.message)
    //   return
    // }
    toast.success('Account created! Check your email to verify.')
    // onAuthSuccess()
  }

  const handleGoogleLogin = async () => {
    // setLoading(true)
    // const { error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: { redirectTo: `${window.location.origin}/contact` },
    // })
    // setLoading(false)
    // if (error) toast.error(error.message)
    console.log("Logic added soon");
    
  }

  return (
    <GradientBorder>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="text-white">Get in Touch</CardTitle>
          <CardDescription className="text-zinc-400">
            Sign in to send a message securely
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={authTab} onValueChange={setAuthTab}>
            <TabsList className="grid w-full grid-cols-2 bg-white/5">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="login" key="login" forceMount>
                {authTab === 'login' && (
                  <motion.form
                    key="login-form"
                    variants={formSwitch}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={loginForm.handleSubmit(handleLogin)}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <Label htmlFor="login-email" className="text-zinc-300">Email</Label>
                      <div className="relative mt-1.5">
                        <IoMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="login-email"
                          type="email"
                          placeholder="you@example.com"
                          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                          {...loginForm.register('email')}
                        />
                      </div>
                      <FieldError message={loginForm.formState.errors.email?.message} />
                    </div>

                    <div>
                      <Label htmlFor="login-password" className="text-zinc-300">Password</Label>
                      <div className="relative mt-1.5">
                        <IoLockClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="login-password"
                          type="password"
                          placeholder="••••••••"
                          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                          {...loginForm.register('password')}
                        />
                      </div>
                      <FieldError message={loginForm.formState.errors.password?.message} />
                    </div>

                    <RippleButton type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500">
                      {loading ? 'Signing in...' : 'Login'}
                    </RippleButton>

                    <Separator className="bg-white/10" />

                    <RippleButton
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={handleGoogleLogin}
                      className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <FaGoogle className="mr-2 h-4 w-4" />
                      Login with Google
                    </RippleButton>
                  </motion.form>
                )}
              </TabsContent>

              <TabsContent value="signup" key="signup" forceMount>
                {authTab === 'signup' && (
                  <motion.form
                    key="signup-form"
                    variants={formSwitch}
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    onSubmit={signupForm.handleSubmit(handleSignup)}
                    className="mt-4 space-y-4"
                  >
                    <div>
                      <Label htmlFor="signup-name" className="text-zinc-300">Full Name</Label>
                      <div className="relative mt-1.5">
                        <IoPerson className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="signup-name"
                          placeholder="John Doe"
                          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                          {...signupForm.register('fullName')}
                        />
                      </div>
                      <FieldError message={signupForm.formState.errors.fullName?.message} />
                    </div>

                    <div>
                      <Label htmlFor="signup-email" className="text-zinc-300">Email</Label>
                      <div className="relative mt-1.5">
                        <IoMail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="signup-email"
                          type="email"
                          placeholder="you@example.com"
                          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                          {...signupForm.register('email')}
                        />
                      </div>
                      <FieldError message={signupForm.formState.errors.email?.message} />
                    </div>

                    <div>
                      <Label htmlFor="signup-password" className="text-zinc-300">Password</Label>
                      <div className="relative mt-1.5">
                        <IoLockClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="signup-password"
                          type="password"
                          placeholder="••••••••"
                          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                          {...signupForm.register('password')}
                        />
                      </div>
                      <FieldError message={signupForm.formState.errors.password?.message} />
                      <div className="mt-2">
                        <PasswordStrength password={watchPassword} />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="signup-confirm" className="text-zinc-300">Confirm Password</Label>
                      <div className="relative mt-1.5">
                        <IoLockClosed className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                        <Input
                          id="signup-confirm"
                          type="password"
                          placeholder="••••••••"
                          className="border-white/10 bg-white/5 pl-10 text-white placeholder:text-zinc-500"
                          {...signupForm.register('confirmPassword')}
                        />
                      </div>
                      <FieldError message={signupForm.formState.errors.confirmPassword?.message} />
                    </div>

                    <RippleButton type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-500">
                      {loading ? 'Creating account...' : 'Sign Up'}
                    </RippleButton>

                    <RippleButton
                      type="button"
                      variant="outline"
                      disabled={loading}
                      onClick={handleGoogleLogin}
                      className="w-full border-white/10 bg-white/5 text-white hover:bg-white/10"
                    >
                      <FaGoogle className="mr-2 h-4 w-4" />
                      Sign up with Google
                    </RippleButton>
                  </motion.form>
                )}
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </CardContent>
      </Card>
    </GradientBorder>
  )
}

function UserProfile({ user, onLogout }) {
  const displayName =
    user.user_metadata?.full_name || user.email?.split('@')[0] || 'User'
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex items-center gap-4 rounded-xl border border-white/10 bg-white/5 p-4"
    >
      <Avatar className="h-12 w-12 border border-indigo-500/30">
        <AvatarImage src={user.user_metadata?.avatar_url} />
        <AvatarFallback className="bg-indigo-600 text-white">{initials}</AvatarFallback>
      </Avatar>
      <div className="flex-1">
        <p className="font-medium text-white">{displayName}</p>
        <p className="text-sm text-zinc-400">{user.email}</p>
      </div>
      <RippleButton
        variant="outline"
        size="sm"
        onClick={onLogout}
        className="border-white/10 text-zinc-300 hover:bg-white/5"
      >
        <IoLogOutOutline className="mr-1 h-4 w-4" />
        Logout
      </RippleButton>
    </motion.div>
  )
}

function ContactFormPanel({ user }) {
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const form = useForm({
    resolver: zodResolver(contactSchema),
    mode: 'onChange',
    defaultValues: {
      name: user.user_metadata?.full_name || '',
      email: user.email || '',
      subject: '',
      message: '',
    },
  })

  const onSubmit = async (formData) => {
    console.log(formData)
    setLoading(true)

    try {
      const res = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          ...formData,
        }),
      })

      if (!res.ok) throw new Error('Failed to save message')

      toast.success('Message sent successfully!')
      form.reset()
      setSubmitted(true)
      setTimeout(() => setSubmitted(false), 3000)
    } catch (err) {
      toast.error(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <GradientBorder>
        <div className="p-8">
          <SuccessCheckmark />
        </div>
      </GradientBorder>
    )
  }

  return (
    <GradientBorder>
      <Card className="border-0 bg-transparent shadow-none">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <MdOutlineMessage className="h-5 w-5 text-indigo-400" />
            Send a Message
          </CardTitle>
          <CardDescription className="text-zinc-400">
            Fill out the form and I&apos;ll get back to you soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <motion.form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {['name', 'email', 'subject'].map((field) => (
              <div key={field}>
                <Label htmlFor={field} className="capitalize text-zinc-300">
                  {field}
                </Label>
                <Input
                  id={field}
                  type={field === 'email' ? 'email' : 'text'}
                  className="mt-1.5 border-white/10 bg-white/5 text-white placeholder:text-zinc-500"
                  {...form.register(field)}
                />
                <FieldError message={form.formState.errors[field]?.message} />
              </div>
            ))}

            <div>
              <Label htmlFor="message" className="text-zinc-300">Message</Label>
              <textarea
                id="message"
                rows={4}
                className="mt-1.5 flex w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                {...form.register('message')}
              />
              <FieldError message={form.formState.errors.message?.message} />
            </div>

            <RippleButton
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500"
            >
              {loading ? (
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="mr-2 inline-block h-4 w-4 rounded-full border-2 border-white/30 border-t-white"
                />
              ) : (
                <IoSend className="mr-2 h-4 w-4" />
              )}
              {loading ? 'Sending...' : 'Send Message'}
            </RippleButton>
          </motion.form>
        </CardContent>
      </Card>
    </GradientBorder>
  )
}

// ─── Main Component ────────────────────────────────────────────────────────────

export default function Contact() {
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [showDashboard, setShowDashboard] = useState(false)

  const initSession = useCallback(async () => {
    // const { data: { session } } = await supabase.auth.getSession()
    // setUser(session?.user ?? null)
    setAuthLoading(false)
  }, [])

  useEffect(() => {
    initSession()

    // const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
    //   setUser(session?.user ?? null)
    // })

    // return () => subscription.unsubscribe()
  }, [initSession])

  const handleLogout = async () => {
    // await supabase.auth.signOut()
    setShowDashboard(false)
    toast.success('Logged out successfully')
  }

  return (
    <section
      id="contact"
      className="relative min-h-screen overflow-hidden bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8"
    >
      <BlobBackground />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-16 text-center"
        >
          <Badge className="mb-4 bg-indigo-500/20 text-indigo-300 hover:bg-indigo-500/20">
            Contact
          </Badge>
          <h2 className="bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
            Let&apos;s Work Together
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-400">
            Have a project in mind? I&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left — Contact Info */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="space-y-8"
          >
            {/* Availability */}
            <motion.div custom={0} variants={fadeUp}>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-2">
                <motion.span
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="h-2 w-2 rounded-full bg-emerald-400"
                />
                <span className="text-sm font-medium text-emerald-300">Available for work</span>
              </div>
            </motion.div>

            {/* Contact details */}
            <motion.div custom={1} variants={fadeUp} className="space-y-4">
              {CONTACT_INFO.map(({ icon: Icon, label, value, href }) => (
                <motion.a
                  key={label}
                  href={href || undefined}
                  whileHover={{ x: 4 }}
                  className={`flex items-center gap-4 rounded-xl border border-white/5 bg-white/[0.02] p-4 transition-colors hover:border-indigo-500/30 hover:bg-white/[0.04] ${!href ? 'pointer-events-none' : ''}`}
                >
                  <motion.div
                    animate={{ y: [0, -3, 0] }}
                    transition={{ duration: 3, repeat: Infinity, delay: Math.random() }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/20"
                  >
                    <Icon className="h-5 w-5 text-indigo-400" />
                  </motion.div>
                  <div>
                    <p className="text-xs text-zinc-500">{label}</p>
                    <p className="font-medium text-white">{value}</p>
                  </div>
                </motion.a>
              ))}
            </motion.div>

            {/* Social */}
            <motion.div custom={2} variants={fadeUp}>
              <p className="mb-3 text-sm text-zinc-500">Follow me</p>
              <div className="flex gap-3">
                {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.1, y: -2 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-zinc-400 transition-colors hover:border-indigo-500/50 hover:text-indigo-400"
                    aria-label={label}
                  >
                    <Icon className="h-4 w-4" />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Stats */}
            <motion.div custom={3} variants={fadeUp} className="grid grid-cols-3 gap-3">
              {STATS_CARDS.map(({ label, value, icon: Icon }) => (
                <GlassCard key={label} className="p-4 text-center" glow>
                  <Icon className="mx-auto mb-2 h-5 w-5 text-indigo-400" />
                  <p className="text-lg font-bold text-white">{value}</p>
                  <p className="text-[10px] text-zinc-500">{label}</p>
                </GlassCard>
              ))}
            </motion.div>

            {/* CTA */}
            <motion.div custom={4} variants={fadeUp}>
              <GlassCard className="bg-gradient-to-br from-indigo-600/20 to-violet-600/10" glow>
                <h3 className="text-lg font-semibold text-white">Ready to start?</h3>
                <p className="mt-2 text-sm text-zinc-400">
                  Book a free 30-minute consultation call.
                </p>
                <RippleButton className="mt-4 bg-white text-zinc-900 hover:bg-zinc-100">
                  Schedule a Call
                </RippleButton>
              </GlassCard>
            </motion.div>
          </motion.div>

          {/* Right — Auth / Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            {authLoading ? (
              <div className="flex h-64 items-center justify-center">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  className="h-8 w-8 rounded-full border-2 border-indigo-500/30 border-t-indigo-500"
                />
              </div>
            ) : (
              <AnimatePresence mode="wait">
                {!user ? (
                  <motion.div key="auth" {...formSwitch}>
                    <AuthForm onAuthSuccess={initSession} />
                  </motion.div>
                ) : (
                  <motion.div key="contact" {...formSwitch} className="space-y-6">
                    <UserProfile user={user} onLogout={handleLogout} />
                    <ContactFormPanel
                      user={user}
                      onSuccess={() => setShowDashboard(true)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}

            {showDashboard && user && <DashboardPreview />}
          </motion.div>
        </div>
      </div>
    </section>
  )
}