import styles from './HeadlineAllCaps.module.css'

type HeadlineTag = 'h1' | 'h2' | 'div'
type HeadlineAlign = 'left' | 'center'
type HeadlineSize = 'sm' | 'md' | 'lg'
type HeadlineTheme = 'light' | 'dark'

export interface HeadlineAllCapsProps {
  text: string
  as?: HeadlineTag
  align?: HeadlineAlign
  size?: HeadlineSize
  theme?: HeadlineTheme
  uppercase?: boolean
  className?: string
}

export default function HeadlineAllCaps({
  text,
  as = 'h1',
  align = 'center',
  size = 'md',
  theme = 'light',
  uppercase = true,
  className,
}: HeadlineAllCapsProps) {
  const Tag = as
  const cx = (...args: Array<string | false | null | undefined>) => args.filter(Boolean).join(' ')
  return (
    <Tag
      className={cx(
        styles.headline,
        styles[`size_${size}`],
        align === 'left' ? styles.alignLeft : styles.alignCenter,
        theme === 'dark' ? styles.themeDark : styles.themeLight,
        !uppercase && styles.noTransform,
        className,
      )}
    >
      {uppercase ? text.toUpperCase() : text}
    </Tag>
  )
}


