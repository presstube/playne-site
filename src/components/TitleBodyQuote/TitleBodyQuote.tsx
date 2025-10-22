"use client"
import styles from './TitleBodyQuote.module.css'

export interface TitleBodyQuoteProps {
  subtitle: string
  body: string
  quote: string
  isDark?: boolean
  className?: string
}

export default function TitleBodyQuote({
  subtitle,
  body,
  quote,
  isDark = false,
  className,
}: TitleBodyQuoteProps) {
  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')

  return (
    <div 
      className={cx(
        styles.wrapper,
        isDark ? styles.themeDark : styles.themeLight,
        className
      )}
    >
      <h4 className={styles.subtitle}>{subtitle}</h4>
      <p className={styles.body}>{body}</p>
      <blockquote className={styles.quote}>{quote}</blockquote>
    </div>
  )
}

