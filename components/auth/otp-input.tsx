"use client"

import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface OTPInputProps {
  value?: string
  onChange?: (value: string) => void
  onComplete?: (value: string) => void
  length?: number
  disabled?: boolean
  autoFocus?: boolean
  className?: string
  error?: boolean
}

export function OTPInput({
  value = '',
  onChange,
  onComplete,
  length = 6,
  disabled = false,
  autoFocus = true,
  className,
  error = false,
}: OTPInputProps) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''))
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Update internal state when value prop changes
  useEffect(() => {
    if (value) {
      const otpArray = value.split('').slice(0, length)
      const newOtp = [...otpArray, ...new Array(length - otpArray.length).fill('')]
      setOtp(newOtp)
    }
  }, [value, length])

  // Focus first input on mount if autoFocus is true
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleChange = (index: number, value: string) => {
    if (disabled) return

    // Only allow digits
    const digit = value.replace(/\D/g, '').slice(0, 1)
    
    const newOtp = [...otp]
    newOtp[index] = digit
    setOtp(newOtp)

    const otpString = newOtp.join('')
    onChange?.(otpString)

    // Move to next input if digit entered
    if (digit && index < length - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    // Check if complete
    if (otpString.length === length && !newOtp.includes('')) {
      onComplete?.(otpString)
    }
  }

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (disabled) return

    // Handle backspace
    if (e.key === 'Backspace') {
      e.preventDefault()
      
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ''
        setOtp(newOtp)
        onChange?.(newOtp.join(''))
      } else if (index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ''
        setOtp(newOtp)
        onChange?.(newOtp.join(''))
        inputRefs.current[index - 1]?.focus()
      }
    }

    // Handle arrow keys
    if (e.key === 'ArrowLeft' && index > 0) {
      e.preventDefault()
      inputRefs.current[index - 1]?.focus()
    }

    if (e.key === 'ArrowRight' && index < length - 1) {
      e.preventDefault()
      inputRefs.current[index + 1]?.focus()
    }

    // Handle Enter key
    if (e.key === 'Enter') {
      const otpString = otp.join('')
      if (otpString.length === length && !otp.includes('')) {
        onComplete?.(otpString)
      }
    }
  }

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    if (disabled) return
    
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text/plain')
    const digits = pastedData.replace(/\D/g, '').slice(0, length).split('')
    
    if (digits.length === 0) return

    const newOtp = [...otp]
    digits.forEach((digit, i) => {
      if (i < length) {
        newOtp[i] = digit
      }
    })
    
    setOtp(newOtp)
    const otpString = newOtp.join('')
    onChange?.(otpString)

    // Focus on next empty input or last input
    const firstEmptyIndex = newOtp.findIndex(val => val === '')
    const focusIndex = firstEmptyIndex === -1 ? length - 1 : firstEmptyIndex
    inputRefs.current[focusIndex]?.focus()

    // Check if complete
    if (otpString.length === length && !newOtp.includes('')) {
      onComplete?.(otpString)
    }
  }

  const handleFocus = (index: number) => {
    // Select the input content when focused
    inputRefs.current[index]?.select()
  }

  return (
    <div className={cn("flex gap-2", className)}>
      {otp.map((digit, index) => (
        <React.Fragment key={index}>
          <input
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            pattern="[0-9]"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={cn(
              "w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 transition-all",
              "focus:outline-none focus:ring-2 focus:ring-offset-2",
              {
                "border-gray-300 focus:border-blue-500 focus:ring-blue-500": !error,
                "border-red-500 focus:border-red-500 focus:ring-red-500": error,
                "bg-gray-100 cursor-not-allowed": disabled,
                "bg-white": !disabled,
              }
            )}
            autoComplete="off"
            aria-label={`Digit ${index + 1}`}
          />
          {/* Add visual separator after 3rd digit */}
          {index === 2 && (
            <div className="flex items-center px-1">
              <span className="text-gray-400 text-2xl">-</span>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// Countdown timer component
interface OTPTimerProps {
  expiresAt: Date | string
  onExpire?: () => void
  className?: string
}

export function OTPTimer({ expiresAt, onExpire, className }: OTPTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number>(0)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime()
      const expiry = new Date(expiresAt).getTime()
      const difference = Math.max(0, expiry - now)
      return Math.floor(difference / 1000) // Convert to seconds
    }

    setTimeLeft(calculateTimeLeft())

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft()
      setTimeLeft(remaining)
      
      if (remaining === 0) {
        clearInterval(timer)
        onExpire?.()
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [expiresAt, onExpire])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (timeLeft === 0) {
    return (
      <p className={cn("text-sm text-red-600", className)}>
        Code expired
      </p>
    )
  }

  return (
    <p className={cn("text-sm text-gray-600", className)}>
      Code expires in <span className="font-semibold">{formatTime(timeLeft)}</span>
    </p>
  )
}