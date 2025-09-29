import styles from './Headline.module.css'

type HeadlineTag = 'h1' | 'h2' | 'div'
type HeadlineAlign = 'left' | 'center'
type HeadlineCase = 'all-caps' | 'title-case'

export interface HeadlineProps {
  text: string
  caseType: HeadlineCase
  align?: HeadlineAlign
  fg?: string
  bg?: string
  borderColor?: string
  as?: HeadlineTag
  className?: string
}

function toTitleCase(input: string): string {
  // Basic title case: capitalize first letter of each word, lower the rest
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

export default function Headline({
  text,
  caseType,
  align = 'center',
  fg = 'var(--brand-black)',
  bg = 'transparent',
  borderColor,
  as = 'h1',
  className,
}: HeadlineProps) {
  const Tag = as

  const processed = (() => {
    if (caseType === 'all-caps') {
      const limited = limitWords(text, 8)
      return limited.toUpperCase()
    }
    const limited = limitWords(text, 18)
    return toTitleCase(limited)
  })()

  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')

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
          caseType === 'all-caps' ? styles.caseCaps : styles.caseTitle,
        )}
        style={{ color: fg }}
      >
        {processed}
      </Tag>
    </div>
  )
}


