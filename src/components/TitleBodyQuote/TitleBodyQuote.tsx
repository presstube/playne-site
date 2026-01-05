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

  // Helper to convert color to rgba with 90% opacity
  const colorToRgba = (color: string | undefined): string | undefined => {
    if (!color) return undefined
    
    // Handle CSS variables
    if (color.startsWith('var(')) {
      // Map known brand colors to their rgba values
      if (color === 'var(--brand-black)') return 'rgba(35, 31, 32, 0.9)'
      if (color === 'var(--brand-offwhite)') return 'rgba(234, 226, 218, 0.9)'
      if (color === 'var(--brand-yellow)') return 'rgba(255, 222, 23, 0.9)'
      return color // fallback
    }
    
    // If already rgba, modify opacity
    if (color.startsWith('rgba')) {
      return color.replace(/[\d.]+\)$/, '0.9)')
    }
    
    // If rgb, convert to rgba
    if (color.startsWith('rgb(')) {
      return color.replace('rgb(', 'rgba(').replace(')', ', 0.9)')
    }
    
    return color // fallback for hex or other formats
  }

  // Use custom colors if provided, otherwise use theme
  const customStyle = (fg || bg) ? {
    backgroundColor: colorToRgba(bg),
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
      <p className={styles.body} dangerouslySetInnerHTML={{ __html: body }} />
      <blockquote className={styles.quote}>{quote}</blockquote>
    </div>
  )
}

