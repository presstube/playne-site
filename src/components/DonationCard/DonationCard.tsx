import { ReactNode } from 'react'
import Card from '../Card/Card'
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
  const handleDonate = () => {
    if (onDonate) {
      onDonate(amount)
    }
  }

  return (
    <Card variant="bordered" className={className}>
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
          variant="primary"
          size="large"
          fullWidth
          onClick={handleDonate}
        >
          Donate {amount}
        </Button>
      </div>
    </Card>
  )
}
