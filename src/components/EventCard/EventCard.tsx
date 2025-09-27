import { ReactNode } from 'react'
import Card from '../Card/Card'
import styles from './EventCard.module.css'

interface EventCardProps {
  title: string
  date: string
  time?: string
  location?: string
  type?: string
  description?: string | ReactNode
  children?: ReactNode
  className?: string
}

export default function EventCard({ 
  title,
  date,
  time,
  location,
  type,
  description,
  children,
  className 
}: EventCardProps) {
  return (
    <Card className={className}>
      <div className={styles.header}>
        <div className={styles.dateTime}>
          <div className={styles.date}>{date}</div>
          {time && <div className={styles.time}>{time}</div>}
        </div>
        {type && <div className={styles.type}>{type}</div>}
      </div>
      
      <div className={styles.content}>
        <h3 className={styles.title}>{title}</h3>
        {location && <div className={styles.location}>{location}</div>}
        
        {description && (
          <div className={styles.description}>
            {typeof description === 'string' ? <p>{description}</p> : description}
          </div>
        )}
        
        {children}
      </div>
    </Card>
  )
}
