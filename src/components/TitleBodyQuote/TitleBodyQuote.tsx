"use client"
import styles from './TitleBodyQuote.module.css'

export interface TitleBodyQuoteProps {
  subtitle: string
  body: string
  quote: string
  isDark?: boolean
  className?: string
  fg?: string
  bg?: string
}

export default function TitleBodyQuote({
  subtitle,
  body,
  quote,
  isDark = false,
  className,
  fg,
  bg,
}: TitleBodyQuoteProps) {
  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')

  // Use custom colors if provided, otherwise use theme
  const customStyle = (fg || bg) ? {
    backgroundColor: bg,
    color: fg,
    border: bg === 'var(--brand-offwhite)' || bg === '#EAEADA' ? '1px solid rgba(35, 31, 32, 0.2)' : 'none'
  } : undefined

  return (
    <div 
      className={cx(
        styles.wrapper,
        !customStyle && (isDark ? styles.themeDark : styles.themeLight),
        className
      )}
      style={customStyle}
    >
      <h4 className={styles.subtitle}>{subtitle}</h4>
      <p className={styles.body}>{body}</p>
      <blockquote className={styles.quote}>{quote}</blockquote>
    </div>
  )
}

