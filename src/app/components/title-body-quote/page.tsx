"use client"
import { useCallback, useMemo, useState } from 'react'
import TitleBodyQuote from '@/components/TitleBodyQuote/TitleBodyQuote'
import styles from './page.module.css'

// Data from spike-1/src/brand/snippets.json
const SUBTITLE_BODY = [
  {
    subtitle: "Who Are We?",
    body: "Founded by Shantell Martin, Playne creates engaging, interactive learning experiences that foster confidence, critical thinking, and self‑expression."
  },
  {
    subtitle: "What We Do",
    body: "We pair original artworks with thoughtfully designed lessons so students can explore their bodies, feelings, and ideas through drawing, movement, and discussion."
  },
  {
    subtitle: "How It Works",
    body: "Simple materials, open prompts, and plenty of reflection. Lessons are flexible, welcoming, and built to work in classrooms, after‑school programs, and community spaces."
  },
  {
    subtitle: "Why Playne?",
    body: "Because young people deserve tools that help them think freely, care for themselves and others, and imagine new possibilities."
  },
  {
    subtitle: "Our Approach",
    body: "Playful, practical, and people‑centered. We blend observation, making, and conversation to help ideas click in the hands, the body, and the mind."
  },
  {
    subtitle: "Accessibility",
    body: "Activities are designed to be inclusive and adaptable, using everyday supplies and a shared rhythm that invites every learner into the process."
  },
  {
    subtitle: "Pillars Of Learning",
    body: "Anatomy and Body Awareness, Wellness and Self‑Care, Nutrition and Healthy Living, and Financial Literacy — explored through the lens of art."
  },
  {
    subtitle: "For Educators",
    body: "Clear prompts, structured timing, and flexible extensions make it easy to facilitate thoughtful, creative sessions with any group."
  },
  {
    subtitle: "For Young People",
    body: "A safe space to try ideas, practice expression, and build resilience — one line, breath, and conversation at a time."
  },
  {
    subtitle: "Outcomes",
    body: "Students practice creative problem‑solving, empathy, and everyday readiness — skills that live beyond the page."
  },
  {
    subtitle: "Curriculum Flow",
    body: "Each unit begins with looking and conversation, moves through a making activity that connects bodies and ideas, and ends with reflection. This rhythm helps learners settle into a shared pace, build confidence through repetition, and notice their own growth over time — not just the final result."
  },
  {
    subtitle: "What Materials We Use",
    body: "We prioritize simple, accessible tools — paper, pens, markers — so classes can happen anywhere. When schools have more resources, we add movement prompts, large‑scale surfaces, and collaborative walls. The goal is to remove barriers to participation and keep the focus on curiosity and exploration."
  },
  {
    subtitle: "Community Practice",
    body: "Playne works best as a shared practice. We set agreements for listening and respect, rotate roles for leading and supporting, and invite students to connect what they make to their lives. Over time, the room learns how to create together, care for materials, and celebrate many different ways of thinking."
  },
  {
    subtitle: "For Families",
    body: "Families can adapt the lessons at home with a table, a few drawing tools, and a willingness to try. We include prompts for conversation, playful movement warm‑ups, and reflective questions that help young people explain what they made and why — turning dinner tables into studios and living rooms into classrooms."
  },
  {
    subtitle: "Accessibility In Action",
    body: "Activities are designed with multiple entry points. Students may respond verbally, with gestures, or by making. Timers keep the pace consistent; options allow for seated or standing participation; cues are read aloud and shown on screen. This flexibility keeps the work inclusive without diluting rigor."
  },
  {
    subtitle: "Educator Support",
    body: "Each lesson comes with step‑by‑step timing, facilitation tips, and extensions for different grade bands. We offer suggestions for managing materials, grouping students, and closing a session when energy is high. With practice, educators can personalize the cadence while keeping the Playne spirit intact."
  },
  {
    subtitle: "Assessment, Lightly",
    body: "We focus on process over product. Quick exit notes, photographed sketches, and short reflections provide a snapshot of learning without turning creativity into a test. These small artifacts help track growth in language, self‑awareness, and problem‑solving across the semester."
  },
  {
    subtitle: "Why Movement Matters",
    body: "Before drawing, we invite the body into the room. A few breaths, a shakeout, or a simple posture exercise helps students reconnect attention and energy. This small ritual lowers the barrier to starting, supports regulation, and makes it easier to shift from the hallway into a creative mindset."
  },
  {
    subtitle: "Safety And Care",
    body: "Playne builds psychological safety through predictable routines and opt‑in participation. Students choose how to share, decide whether to collaborate, and are encouraged to set gentle boundaries. Care for each other and for materials is part of the learning — a studio practice as much as an academic one."
  },
  {
    subtitle: "Extending Beyond Class",
    body: "We encourage students to carry the Playne approach into everyday life: bring a small notebook, notice lines and shapes on a walk, or map decisions before spending money. These habits turn creativity into a tool for thinking, not just a time‑boxed activity, and help learning stay alive between sessions."
  }
]

const PULL_QUOTES = [
  "Art teaches more than technique — it teaches resilience, adaptability, and the ability to see the world in new ways.",
  "We ask students who they are before telling them who to be.",
  "Learning becomes real when hands, bodies, and ideas move together.",
  "Confidence grows when we make, reflect, and try again — gently.",
  "A single line can open a conversation that changes the day.",
  "Play is not a break from learning; it is how learning breathes.",
  "When we draw together, we practice being present with each other.",
  "Creative practice is a map; curiosity is the compass we carry.",
  "Small, consistent acts of making build a lifelong voice.",
  "We learn with our whole bodies — minds, feelings, and hands at once."
]

export default function Page() {
  const [subBodyIdx, setSubBodyIdx] = useState(0)
  const [quoteIdx, setQuoteIdx] = useState(0)
  const [isDark, setIsDark] = useState(false)

  const currentSubBody = useMemo(
    () => SUBTITLE_BODY[subBodyIdx % SUBTITLE_BODY.length],
    [subBodyIdx]
  )
  const currentQuote = useMemo(
    () => PULL_QUOTES[quoteIdx % PULL_QUOTES.length],
    [quoteIdx]
  )

  const handleClick = useCallback(() => {
    setSubBodyIdx((p) => (p + 1) % SUBTITLE_BODY.length)
    setQuoteIdx((p) => (p + 1) % PULL_QUOTES.length)
    setIsDark(Math.random() < 0.5) // Randomly toggle theme on each click
  }, [])

  return (
    <div className={styles.page}>
      <div 
        className={styles.card} 
        onClick={handleClick}
        role="button" 
        aria-label="Click to cycle content and randomize theme" 
        tabIndex={0}
        onKeyDown={(e) => { 
          if (e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault()
            handleClick()
          } 
        }}
      >
        <div className={styles.inner}>
          <TitleBodyQuote
            subtitle={currentSubBody.subtitle}
            body={currentSubBody.body}
            quote={currentQuote}
            isDark={isDark}
          />
        </div>
      </div>
    </div>
  )
}

