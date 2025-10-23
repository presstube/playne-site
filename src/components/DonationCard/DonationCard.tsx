import { ReactNode } from 'react'
import Button from '../Button/Button'
import styles from './DonationCard.module.css'

interface DonationCardProps {
  amount: string
  title: string
  description: string | ReactNode
  benefits?: string[]
  onDonate?: (amount: string) => void
  className?: string
}

export default function DonationCard({ 
  amount,
  title,
  description,
  benefits,
  onDonate,
  className 
}: DonationCardProps) {
  const classNames = [
    styles.donationCard,
    className
  ].filter(Boolean).join(' ')

  const handleDonate = () => {
    if (onDonate) {
      onDonate(amount)
    }
  }

  return (
    <div className={classNames}>
      <div className={styles.content}>
        <div className={styles.amount}>{amount}</div>
        <h3 className={styles.title}>{title}</h3>
        <div className={styles.description}>
          {typeof description === 'string' ? <p>{description}</p> : description}
        </div>
        
        {benefits && benefits.length > 0 && (
          <ul className={styles.benefits}>
            {benefits.map((benefit, index) => (
              <li key={index}>{benefit}</li>
            ))}
          </ul>
        )}
        
        <Button 
          color="blue"
          size="large"
          fullWidth
          onClick={handleDonate}
        >
          Donate {amount}
        </Button>
      </div>
    </div>
  )
}
