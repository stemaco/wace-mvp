import crypto from 'crypto'

const SALT_LENGTH = 32
const ITERATIONS = 10000
const KEY_LENGTH = 64
const DIGEST = 'sha512'

export class PasswordService {
  /**
   * Hash a password using PBKDF2
   * In production, replace with argon2 for better security
   */
  static async hash(password: string): Promise<string> {
    return new Promise((resolve, reject) => {
      // Generate a salt
      const salt = crypto.randomBytes(SALT_LENGTH)
      
      // Hash the password
      crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
        if (err) reject(err)
        
        // Combine salt and hash
        const combined = Buffer.concat([salt, derivedKey])
        resolve(combined.toString('base64'))
      })
    })
  }

  /**
   * Verify a password against a hash
   */
  static async verify(password: string, hash: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const combined = Buffer.from(hash, 'base64')
        
        // Extract salt and hash
        const salt = combined.slice(0, SALT_LENGTH)
        const originalHash = combined.slice(SALT_LENGTH)
        
        // Hash the provided password with the same salt
        crypto.pbkdf2(password, salt, ITERATIONS, KEY_LENGTH, DIGEST, (err, derivedKey) => {
          if (err) reject(err)
          
          // Compare the hashes
          resolve(crypto.timingSafeEqual(originalHash, derivedKey))
        })
      } catch (error) {
        resolve(false)
      }
    })
  }

  /**
   * Validate password strength
   */
  static validateStrength(password: string): {
    isValid: boolean
    errors: string[]
  } {
    const errors: string[] = []
    
    if (password.length < 8) {
      errors.push('Password must be at least 8 characters long')
    }
    
    if (password.length > 100) {
      errors.push('Password must not exceed 100 characters')
    }
    
    if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter')
    }
    
    if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter')
    }
    
    if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number')
    }
    
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      errors.push('Password must contain at least one special character')
    }
    
    return {
      isValid: errors.length === 0,
      errors,
    }
  }

  /**
   * Generate a secure random password
   */
  static generateSecurePassword(length: number = 16): string {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?'
    let password = ''
    
    const randomBytes = crypto.randomBytes(length)
    for (let i = 0; i < length; i++) {
      password += charset[randomBytes[i] % charset.length]
    }
    
    return password
  }

  /**
   * Generate a password reset token
   */
  static generateResetToken(): string {
    return crypto.randomBytes(32).toString('hex')
  }

  /**
   * Hash a reset token for storage
   */
  static hashResetToken(token: string): string {
    return crypto
      .createHash('sha256')
      .update(token)
      .digest('hex')
  }
}

// Export convenience functions
export const hashPassword = PasswordService.hash
export const verifyPassword = PasswordService.verify
export const validatePasswordStrength = PasswordService.validateStrength
export const generateSecurePassword = PasswordService.generateSecurePassword
export const generateResetToken = PasswordService.generateResetToken
export const hashResetToken = PasswordService.hashResetToken