import React from 'react'
import './Button.scss'

interface ButtonProps {
  text: string
  variant?: 'primary' | 'secondary' | 'tertiary'
  className?: string
  style?: React.CSSProperties
}

export const Button: React.FC<ButtonProps> = ({
  text = 'Clik me!',
  variant = 'primary',
  className = '',
  ...rest
}) => {
  return (
    <button className={`btn btn-${variant} ${className}`} {...rest}>
      { text}
    </button>
  )
}
