'use client'

import { useRef } from 'react'
import { motion, useInView } from 'framer-motion'

import {
  FaHtml5,
  FaCss3Alt,
  FaJs,
  FaReact,
  FaNodeJs,
  FaDatabase,
  FaGitAlt,
  FaGithub,
  FaFigma,
  FaCode,
  FaServer,
  FaTools,
} from 'react-icons/fa'

// ─── Data ────────────────────────────────────────────────────────────────────

const SKILL_CATEGORIES = [
  {
    id: 'frontend',
    title: 'Frontend',
    description: 'Building responsive, user-friendly interfaces with modern web technologies.',
    icon: FaCode,
    accent: 'from-blue-500 to-cyan-400',
    skills: [
      { name: 'HTML', icon: FaHtml5, proficiency: 95 },
      { name: 'CSS', icon: FaCss3Alt, proficiency: 92 },
      { name: 'JavaScript', icon: FaJs, proficiency: 90 },
      { name: 'React.js', icon: FaReact, proficiency: 88 },
      { name: 'Next.js', icon: FaCode, proficiency: 85 },
      { name: 'Tailwind CSS', icon: FaCss3Alt, proficiency: 90 },
    ],
  },
  {
    id: 'backend',
    title: 'Backend',
    description: 'Developing scalable server-side logic and robust RESTful APIs.',
    icon: FaServer,
    accent: 'from-violet-500 to-purple-500',
    skills: [
      { name: 'Node.js', icon: FaNodeJs, proficiency: 85 },
      { name: 'Express.js', icon: FaNodeJs, proficiency: 82 },
      { name: 'REST API', icon: FaCode, proficiency: 88 },
      { name: 'Prisma', icon: FaDatabase, proficiency: 80 },
    ],
  },
  {
    id: 'database',
    title: 'Database',
    description: 'Managing and querying data across SQL and NoSQL systems.',
    icon: FaDatabase,
    accent: 'from-cyan-500 to-teal-400',
    skills: [
      { name: 'MongoDB', icon: FaDatabase, proficiency: 82 },
      { name: 'MySQL', icon: FaDatabase, proficiency: 78 },
      { name: 'PostgreSQL', icon: FaDatabase, proficiency: 80 },
      { name: 'Supabase', icon: FaDatabase, proficiency: 76 },
    ],
  },
  {
    id: 'tools',
    title: 'Tools',
    description: 'Everyday tools for development, collaboration, and deployment.',
    icon: FaTools,
    accent: 'from-indigo-500 to-blue-500',
    skills: [
      { name: 'Git', icon: FaGitAlt, proficiency: 90 },
      { name: 'GitHub', icon: FaGithub, proficiency: 88 },
      { name: 'VS Code', icon: FaCode, proficiency: 95 },
      { name: 'Postman', icon: FaCode, proficiency: 85 },
      { name: 'Vercel', icon: FaCode, proficiency: 82 },
      { name: 'Figma', icon: FaFigma, proficiency: 72 },
    ],
  },
]

// ─── Animation variants ──────────────────────────────────────────────────────

const gridVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.15 },
  },
}

const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  },
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function SkillBadge({ skill, index, inView }) {
  const Icon = skill.icon

  return (
    <motion.li
      initial={{ opacity: 0, scale: 0.9 }}
      animate={inView ? { opacity: 1, scale: 1 } : {}}
      transition={{ delay: 0.15 + index * 0.05, duration: 0.3 }}
      className="space-y-2"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-400" aria-hidden="true" />
          <span className="text-sm text-zinc-300">{skill.name}</span>
        </div>
        <span className="text-xs tabular-nums text-zinc-500">{skill.proficiency}%</span>
      </div>

      {/* Progress bar */}
      <div
        className="h-1 overflow-hidden rounded-full bg-zinc-800"
        role="progressbar"
        aria-valuenow={skill.proficiency}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${skill.name} proficiency`}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.proficiency}%` } : { width: 0 }}
          transition={{ duration: 0.7, delay: 0.2 + index * 0.05, ease: 'easeOut' }}
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400"
        />
      </div>
    </motion.li>
  )
}

function CategoryCard({ category }) {
  const cardRef = useRef(null)
  const inView = useInView(cardRef, { once: true, margin: '-40px' })
  const CategoryIcon = category.icon

  return (
    <motion.article
      ref={cardRef}
      variants={cardVariants}
      whileHover={{ y: -4, scale: 1.01, transition: { duration: 0.3 } }}
      className="group flex h-full flex-col rounded-2xl border border-zinc-800 bg-zinc-900/50 p-6 shadow-md shadow-black/20 transition-shadow duration-300 hover:border-zinc-700 hover:shadow-lg hover:shadow-blue-500/5"
    >
      {/* Category icon */}
      <div
        className={`mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${category.accent}`}
        aria-hidden="true"
      >
        <CategoryIcon className="h-5 w-5 text-white" />
      </div>

      <h3 className="mb-1 text-base font-semibold text-white">{category.title}</h3>
      <p className="mb-5 text-sm leading-relaxed text-zinc-400">{category.description}</p>

      {/* Skill chips */}
      <div className="mb-5 flex flex-wrap gap-2">
        {category.skills.map((skill) => {
          const Icon = skill.icon
          return (
            <span
              key={skill.name}
              className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-800/60 px-2.5 py-1 text-xs font-medium text-zinc-300 transition-colors duration-300 group-hover:border-zinc-700"
            >
              <Icon className="h-3 w-3 text-zinc-400" aria-hidden="true" />
              {skill.name}
            </span>
          )
        })}
      </div>

      {/* Progress bars */}
      <ul className="mt-auto space-y-3" aria-label={`${category.title} skill levels`}>
        {category.skills.map((skill, i) => (
          <SkillBadge key={skill.name} skill={skill} index={i} inView={inView} />
        ))}
      </ul>
    </motion.article>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function SkillsSection() {
  const sectionRef = useRef(null)
  const headerInView = useInView(sectionRef, { once: true, margin: '-60px' })

  return (
    <section
      ref={sectionRef}
      id="skills"
      aria-labelledby="skills-heading"
      className="relative overflow-hidden bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8"
    >
      {/* Subtle background glow */}
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-14 max-w-2xl text-center"
        >
          <span className="mb-4 inline-block rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1 text-xs font-medium tracking-wide text-blue-300">
            My Skills
          </span>

          <h2
            id="skills-heading"
            className="bg-gradient-to-r from-white via-blue-100 to-cyan-200 bg-clip-text text-3xl font-bold tracking-tight text-transparent sm:text-4xl lg:text-5xl"
          >
            Skills & Technologies
          </h2>

          <p className="mt-4 text-base leading-relaxed text-zinc-400 sm:text-lg">
            Technologies and tools I use to design, build, and ship full-stack
            web applications with clean code and great user experience.
          </p>
        </motion.header>

        {/* Grid: 1 → 2 → 4 columns */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
          className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4"
        >
          {SKILL_CATEGORIES.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}