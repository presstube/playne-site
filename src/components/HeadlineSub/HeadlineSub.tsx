"use client"
import styles from './HeadlineSub.module.css'

type HeadlineTag = 'h1' | 'h2' | 'div'
type HeadlineAlign = 'left' | 'center'

export interface HeadlineSubProps {
  headline: string
  sub: string
  align?: HeadlineAlign
  fg?: string
  bg?: string
  borderColor?: string
  as?: HeadlineTag
  className?: string
}

function toTitleCase(input: string): string {
  return input
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
}

function limitWords(input: string, maxWords: number): string {
  const words = input.trim().split(/\s+/)
  if (words.length <= maxWords) return input.trim()
  return words.slice(0, maxWords).join(' ')
}

export default function HeadlineSub({
  headline,
  sub,
  align = 'center',
  fg = 'var(--brand-black)',
  bg = 'transparent',
  borderColor,
  as = 'h1',
  className,
}: HeadlineSubProps) {
  const Tag = as
  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')

  const headlineProcessed = limitWords(headline, 8).toUpperCase()
  const subProcessed = toTitleCase(limitWords(sub, 18))

  return (
    <div 
      className={cx(styles.wrapper, className)} 
      style={{ 
        backgroundColor: bg,
        border: borderColor ? `1px solid ${borderColor}` : undefined,
        borderRadius: '1rem',
      }}
    >
      <Tag
        className={cx(
          styles.headline,
          align === 'left' ? styles.alignLeft : styles.alignCenter,
          styles.caseCaps,
        )}
        style={{ color: fg }}
      >
        {headlineProcessed}
      </Tag>
      <div
        className={cx(
          styles.sub,
          align === 'left' ? styles.alignLeft : styles.alignCenter,
          styles.caseTitle,
        )}
        style={{ color: fg }}
      >
        {subProcessed}
      </div>
    </div>
  )
}


