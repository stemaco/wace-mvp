import crypto from 'crypto'
import { authStorage } from './storage'

export class OTPService {
  private static readonly OTP_LENGTH = 6
  private static readonly OTP_EXPIRY_MINUTES = 5
  private static readonly MAX_ATTEMPTS = 5
  private static readonly RESEND_COOLDOWN_SECONDS = 60

  /**
   * Generate a 6-digit OTP code
   */
  static generateOTP(): string {
    const digits = '0123456789'
    let otp = ''
    
    const randomBytes = crypto.randomBytes(this.OTP_LENGTH)
    for (let i = 0; i < this.OTP_LENGTH; i++) {
      otp += digits[randomBytes[i] % 10]
    }
    
    return otp
  }

  /**
   * Generate and store OTP for email
   */
  static async createOTP(email: string): Promise<string> {
    // Check if there's an existing OTP that hasn't expired
    const existingOTP = await authStorage.getOTP(email)
    
    if (existingOTP) {
      const timeSinceCreation = Date.now() - new Date(existingOTP.expiresAt).getTime() + (this.OTP_EXPIRY_MINUTES * 60 * 1000)
      const cooldownRemaining = this.RESEND_COOLDOWN_SECONDS * 1000 - timeSinceCreation
      
      if (cooldownRemaining > 0) {
        throw new Error(`Please wait ${Math.ceil(cooldownRemaining / 1000)} seconds before requesting a new OTP`)
      }
    }

    // Generate new OTP
    const code = this.generateOTP()
    
    // Store OTP
    await authStorage.createOTP(email, code)
    
    return code
  }

  /**
   * Verify OTP code
   */
  static async verifyOTP(email: string, code: string): Promise<boolean> {
    const storedOTP = await authStorage.getOTP(email)
    
    if (!storedOTP) {
      throw new Error('OTP not found or expired')
    }

    // Check if OTP has expired
    if (new Date(storedOTP.expiresAt) < new Date()) {
      await authStorage.deleteOTP(email)
      throw new Error('OTP has expired')
    }

    // Check attempts
    if (storedOTP.attempts >= this.MAX_ATTEMPTS) {
      await authStorage.deleteOTP(email)
      throw new Error('Maximum OTP verification attempts exceeded')
    }

    // Increment attempts
    await authStorage.incrementOTPAttempts(email)

    // Verify code
    const isValid = crypto.timingSafeEqual(
      Buffer.from(storedOTP.code),
      Buffer.from(code)
    )

    if (isValid) {
      // Delete OTP after successful verification
      await authStorage.deleteOTP(email)
    }

    return isValid
  }

  /**
   * Format OTP for display (with spaces for readability)
   */
  static formatOTP(code: string): string {
    return code.slice(0, 3) + ' ' + code.slice(3)
  }

  /**
   * Validate OTP format
   */
  static validateOTPFormat(code: string): boolean {
    // Remove spaces and validate
    const cleanCode = code.replace(/\s/g, '')
    return /^\d{6}$/.test(cleanCode)
  }

  /**
   * Clean OTP input (remove spaces and non-digits)
   */
  static cleanOTPInput(code: string): string {
    return code.replace(/\D/g, '').slice(0, this.OTP_LENGTH)
  }

  /**
   * Get OTP expiry time
   */
  static getExpiryTime(): Date {
    return new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000)
  }

  /**
   * Check if email has pending OTP
   */
  static async hasPendingOTP(email: string): Promise<boolean> {
    const otp = await authStorage.getOTP(email)
    return otp !== null && new Date(otp.expiresAt) > new Date()
  }

  /**
   * Get remaining time for OTP in seconds
   */
  static async getRemainingTime(email: string): Promise<number> {
    const otp = await authStorage.getOTP(email)
    
    if (!otp) {
      return 0
    }

    const remaining = Math.floor(
      (new Date(otp.expiresAt).getTime() - Date.now()) / 1000
    )
    
    return Math.max(0, remaining)
  }

  /**
   * Get remaining attempts for OTP
   */
  static async getRemainingAttempts(email: string): Promise<number> {
    const otp = await authStorage.getOTP(email)
    
    if (!otp) {
      return 0
    }

    return Math.max(0, this.MAX_ATTEMPTS - otp.attempts)
  }

  /**
   * Cancel/invalidate OTP
   */
  static async cancelOTP(email: string): Promise<void> {
    await authStorage.deleteOTP(email)
  }
}

// Export convenience functions
export const generateOTP = OTPService.generateOTP
export const createOTP = OTPService.createOTP
export const verifyOTP = OTPService.verifyOTP
export const formatOTP = OTPService.formatOTP
export const validateOTPFormat = OTPService.validateOTPFormat
export const cleanOTPInput = OTPService.cleanOTPInput
export const hasPendingOTP = OTPService.hasPendingOTP
export const getRemainingTime = OTPService.getRemainingTime
export const cancelOTP = OTPService.cancelOTP