/**
 * Email Service with Resend Integration
 * Handles all authentication-related email communications
 */

interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

interface EmailOptions {
  to: string | string[]
  from?: string
  replyTo?: string
  cc?: string | string[]
  bcc?: string | string[]
  attachments?: Array<{
    filename: string
    content: Buffer | string
  }>
}

interface EmailResult {
  success: boolean
  messageId?: string
  error?: string
}

class EmailService {
  private readonly apiKey: string
  private readonly fromEmail: string
  private readonly fromName: string
  private readonly isDevelopment: boolean

  constructor() {
    this.apiKey = process.env.RESEND_API_KEY || ''
    // Use Resend's default sender email that works without domain verification
    this.fromEmail = process.env.EMAIL_FROM || 'onboarding@resend.dev'
    this.fromName = process.env.EMAIL_FROM_NAME || 'WACE Team'
    this.isDevelopment = process.env.NODE_ENV !== 'production'
  }

  /**
   * Send email using Resend API (or console log in development)
   */
  private async sendEmail(
    template: EmailTemplate,
    options: EmailOptions
  ): Promise<EmailResult> {
    try {
      const from = options.from || `${this.fromName} <${this.fromEmail}>`

      // If no API key, always use development mode
      if (!this.apiKey || this.apiKey === 're_your_resend_api_key_here') {
        // Log to console instead of sending
        console.log('📧 Email (Dev Mode - No API Key):')
        console.log('To:', options.to)
        console.log('From:', from)
        console.log('Subject:', template.subject)
        if (template.text) {
          console.log('Content:', template.text)
        }
        console.log('---')

        return {
          success: true,
          messageId: `dev_${Date.now()}`,
        }
      }

      // In production with valid API key, use Resend API
      try {
        // Resend test mode restriction: can only send to account owner's email
        // Override recipient email in development/test mode
        const testEmail = process.env.RESEND_TEST_EMAIL
        let recipientEmail = options.to

        if (this.isDevelopment && testEmail) {
          const originalEmail = Array.isArray(options.to) ? options.to[0] : options.to
          recipientEmail = testEmail
          console.log(`📧 [Test Mode] Redirecting email from ${originalEmail} to ${testEmail}`)
          console.log(`   Subject: ${template.subject}`)
        }

        // Use Resend API directly
        const response = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            from,
            to: Array.isArray(recipientEmail) ? recipientEmail : [recipientEmail],
            subject: template.subject,
            html: template.html,
            text: template.text,
            reply_to: options.replyTo,
            cc: options.cc,
            bcc: options.bcc,
          }),
        })

        if (!response.ok) {
          const error = await response.json()
          console.error('Resend API error:', error)
          console.error('Status:', response.status)
          throw new Error(error.message || `Resend API error: ${response.status}`)
        }

        const data = await response.json()

        console.log('✅ Email sent successfully via Resend!')
        console.log('   Message ID:', data.id)

        return {
          success: true,
          messageId: data.id,
        }
      } catch (apiError) {
        console.error('Failed to send email via Resend:', apiError)
        throw apiError
      }
    } catch (error) {
      console.error('Failed to send email:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }
    }
  }

  /**
   * Simulate Resend API call (replace with actual Resend SDK in production)
   */
  private async simulateResendAPI(data: any): Promise<{ id: string }> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 100))
    
    // In production, this would use the Resend SDK:
    // const resend = new Resend(this.apiKey)
    // const response = await resend.emails.send(data)
    // return response
    
    return {
      id: `msg_${Date.now()}_${Math.random().toString(36).substring(7)}`,
    }
  }

  /**
   * Send OTP verification email
   */
  async sendOTPEmail(
    email: string,
    otp: string,
    options?: {
      userName?: string
      deviceInfo?: string
      ipAddress?: string
    }
  ): Promise<EmailResult> {
    const formattedOTP = otp.slice(0, 3) + ' ' + otp.slice(3)
    const expiryMinutes = process.env.OTP_EXPIRY_MINUTES || '5'
    
    // Log OTP for development
    if (!this.apiKey || this.apiKey === 're_your_resend_api_key_here') {
      console.log('🔐 OTP Code for', email, ':', formattedOTP)
      console.log('   Raw OTP:', otp)
    }
    
    const template: EmailTemplate = {
      subject: `${formattedOTP} is your WACE verification code`,
      html: this.getOTPEmailHTML({
        otp: formattedOTP,
        userName: options?.userName,
        deviceInfo: options?.deviceInfo,
        ipAddress: options?.ipAddress,
        expiryMinutes: parseInt(expiryMinutes),
      }),
      text: this.getOTPEmailText({
        otp: formattedOTP,
        expiryMinutes: parseInt(expiryMinutes),
      }),
    }

    return this.sendEmail(template, { to: email })
  }

  /**
   * Send welcome email after successful registration
   */
  async sendWelcomeEmail(
    email: string,
    userName?: string
  ): Promise<EmailResult> {
    const template: EmailTemplate = {
      subject: 'Welcome to WACE - Your AI Collaboration Workspace',
      html: this.getWelcomeEmailHTML(userName),
      text: this.getWelcomeEmailText(userName),
    }

    return this.sendEmail(template, { to: email })
  }

  /**
   * Send password reset email
   */
  async sendPasswordResetEmail(
    email: string,
    resetToken: string,
    userName?: string
  ): Promise<EmailResult> {
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password?token=${resetToken}`
    
    const template: EmailTemplate = {
      subject: 'Reset your WACE password',
      html: this.getPasswordResetEmailHTML(resetUrl, userName),
      text: this.getPasswordResetEmailText(resetUrl),
    }

    return this.sendEmail(template, { to: email })
  }

  /**
   * Send security alert email
   */
  async sendSecurityAlert(
    email: string,
    alertType: 'new_device' | 'password_changed' | 'suspicious_activity',
    details?: {
      deviceInfo?: string
      ipAddress?: string
      location?: string
      timestamp?: Date
    }
  ): Promise<EmailResult> {
    const subjects = {
      new_device: 'New device login to your WACE account',
      password_changed: 'Your WACE password was changed',
      suspicious_activity: 'Security alert for your WACE account',
    }

    const template: EmailTemplate = {
      subject: subjects[alertType],
      html: this.getSecurityAlertHTML(alertType, details),
      text: this.getSecurityAlertText(alertType, details),
    }

    return this.sendEmail(template, { to: email })
  }

  /**
   * Get OTP email HTML template
   */
  private getOTPEmailHTML(data: {
    otp: string
    userName?: string
    deviceInfo?: string
    ipAddress?: string
    expiryMinutes: number
  }): string {
    const greeting = data.userName ? `Hi ${data.userName},` : 'Hi there,'
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 24px; font-weight: bold; color: #2383e2; }
    .content { background: #f7f6f3; border-radius: 8px; padding: 30px; margin: 20px 0; }
    .otp-code { background: white; border: 2px solid #2383e2; border-radius: 8px; padding: 15px; text-align: center; font-size: 28px; font-weight: bold; letter-spacing: 8px; margin: 20px 0; color: #37352f; }
    .info { background: #fff9e6; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    .button { display: inline-block; padding: 12px 24px; background: #2383e2; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .device-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; font-size: 14px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">WACE</div>
    </div>
    <div class="content">
      <h2 style="color: #37352f; margin-top: 0;">${greeting}</h2>
      <p>Your verification code is:</p>
      <div class="otp-code">${data.otp}</div>
      <p>Enter this code to complete your sign in. This code will expire in <strong>${data.expiryMinutes} minutes</strong>.</p>
      
      ${data.deviceInfo || data.ipAddress ? `
      <div class="device-info">
        <strong>Sign in attempt details:</strong><br>
        ${data.deviceInfo ? `Device: ${data.deviceInfo}<br>` : ''}
        ${data.ipAddress ? `IP Address: ${data.ipAddress}<br>` : ''}
        Time: ${new Date().toLocaleString()}
      </div>
      ` : ''}
      
      <div class="info">
        <strong>🔒 Security tip:</strong> Never share this code with anyone. WACE team will never ask for this code.
      </div>
      
      <p style="color: #666; font-size: 14px;">If you didn't request this code, you can safely ignore this email.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} WACE. All rights reserved.</p>
      <p>This is an automated message, please do not reply.</p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Get OTP email text template
   */
  private getOTPEmailText(data: {
    otp: string
    expiryMinutes: number
  }): string {
    return `Your WACE verification code is: ${data.otp}

This code will expire in ${data.expiryMinutes} minutes.

If you didn't request this code, you can safely ignore this email.

Security tip: Never share this code with anyone. WACE team will never ask for this code.

© ${new Date().getFullYear()} WACE. All rights reserved.`
  }

  /**
   * Get welcome email HTML template
   */
  private getWelcomeEmailHTML(userName?: string): string {
    const greeting = userName ? `Hi ${userName},` : 'Welcome!'
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { text-align: center; padding: 20px 0; }
    .logo { font-size: 24px; font-weight: bold; color: #2383e2; }
    .content { background: #f7f6f3; border-radius: 8px; padding: 30px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #2383e2; color: white; text-decoration: none; border-radius: 6px; margin: 10px 0; }
    .feature { padding: 15px; margin: 10px 0; background: white; border-radius: 6px; }
    .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">WACE</div>
    </div>
    <div class="content">
      <h1 style="color: #37352f; margin-top: 0;">${greeting}</h1>
      <p>Welcome to WACE - Your AI-powered collaboration workspace!</p>
      
      <p>Here's what you can do with WACE:</p>
      
      <div class="feature">
        <strong>🤖 AI-Powered Pods</strong><br>
        Create intelligent workspaces with AI assistants tailored to your needs.
      </div>
      
      <div class="feature">
        <strong>👥 Team Collaboration</strong><br>
        Work seamlessly with your team using AI replicas and smart tools.
      </div>
      
      <div class="feature">
        <strong>📅 Workspace Integration</strong><br>
        Connect your Google Calendar, Gmail, and Microsoft Teams.
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" class="button">Go to Dashboard</a>
      </div>
      
      <p style="color: #666; font-size: 14px;">Need help? Check out our <a href="${process.env.NEXT_PUBLIC_APP_URL}/help">documentation</a> or contact support.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} WACE. All rights reserved.</p>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Get welcome email text template
   */
  private getWelcomeEmailText(userName?: string): string {
    const greeting = userName ? `Hi ${userName},` : 'Welcome!'
    
    return `${greeting}

Welcome to WACE - Your AI-powered collaboration workspace!

Here's what you can do with WACE:

• AI-Powered Pods: Create intelligent workspaces with AI assistants
• Team Collaboration: Work seamlessly with your team
• Workspace Integration: Connect your favorite tools

Get started: ${process.env.NEXT_PUBLIC_APP_URL}/dashboard

Need help? Visit ${process.env.NEXT_PUBLIC_APP_URL}/help

© ${new Date().getFullYear()} WACE. All rights reserved.`
  }

  /**
   * Get password reset email HTML template
   */
  private getPasswordResetEmailHTML(resetUrl: string, userName?: string): string {
    const greeting = userName ? `Hi ${userName},` : 'Hi there,'
    
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .content { background: #f7f6f3; border-radius: 8px; padding: 30px; margin: 20px 0; }
    .button { display: inline-block; padding: 12px 24px; background: #2383e2; color: white; text-decoration: none; border-radius: 6px; }
    .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="content">
      <h2>${greeting}</h2>
      <p>We received a request to reset your WACE password. Click the button below to create a new password:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${resetUrl}" class="button">Reset Password</a>
      </div>
      
      <p style="color: #666; font-size: 14px;">Or copy this link: ${resetUrl}</p>
      
      <div class="warning">
        This link will expire in 1 hour. If you didn't request this, please ignore this email.
      </div>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Get password reset email text template
   */
  private getPasswordResetEmailText(resetUrl: string): string {
    return `Reset your WACE password

Click this link to reset your password:
${resetUrl}

This link will expire in 1 hour.

If you didn't request this, please ignore this email.

© ${new Date().getFullYear()} WACE. All rights reserved.`
  }

  /**
   * Get security alert HTML template
   */
  private getSecurityAlertHTML(
    alertType: string,
    details?: any
  ): string {
    const alertMessages = {
      new_device: 'A new device just signed in to your account',
      password_changed: 'Your password was successfully changed',
      suspicious_activity: 'We detected unusual activity on your account',
    }

    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .alert { background: #fff3cd; border-left: 4px solid #dc3545; padding: 20px; border-radius: 4px; }
    .details { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
    .button { display: inline-block; padding: 10px 20px; background: #dc3545; color: white; text-decoration: none; border-radius: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="alert">
      <h2>Security Alert</h2>
      <p>${alertMessages[alertType] || 'Security event detected'}</p>
      
      ${details ? `
      <div class="details">
        ${details.deviceInfo ? `<strong>Device:</strong> ${details.deviceInfo}<br>` : ''}
        ${details.ipAddress ? `<strong>IP Address:</strong> ${details.ipAddress}<br>` : ''}
        ${details.location ? `<strong>Location:</strong> ${details.location}<br>` : ''}
        <strong>Time:</strong> ${details.timestamp ? new Date(details.timestamp).toLocaleString() : new Date().toLocaleString()}
      </div>
      ` : ''}
      
      <p>If this wasn't you, please secure your account immediately:</p>
      <a href="${process.env.NEXT_PUBLIC_APP_URL}/settings/security" class="button">Secure Account</a>
    </div>
  </div>
</body>
</html>
    `
  }

  /**
   * Get security alert text template
   */
  private getSecurityAlertText(
    alertType: string,
    details?: any
  ): string {
    return `Security Alert

${alertType.replace(/_/g, ' ').toUpperCase()}

${details ? `
Device: ${details.deviceInfo || 'Unknown'}
IP: ${details.ipAddress || 'Unknown'}
Time: ${details.timestamp ? new Date(details.timestamp).toLocaleString() : new Date().toLocaleString()}
` : ''}

If this wasn't you, secure your account at:
${process.env.NEXT_PUBLIC_APP_URL}/settings/security

© ${new Date().getFullYear()} WACE. All rights reserved.`
  }

  /**
   * Send batch emails (for notifications, updates, etc.)
   */
  async sendBatchEmails(
    emails: Array<{
      to: string
      template: EmailTemplate
      options?: Partial<EmailOptions>
    }>
  ): Promise<EmailResult[]> {
    const results: EmailResult[] = []
    
    // Process in batches to avoid rate limiting
    const batchSize = 10
    for (let i = 0; i < emails.length; i += batchSize) {
      const batch = emails.slice(i, i + batchSize)
      const batchResults = await Promise.all(
        batch.map(email => 
          this.sendEmail(email.template, {
            to: email.to,
            ...email.options,
          })
        )
      )
      results.push(...batchResults)
      
      // Add delay between batches to respect rate limits
      if (i + batchSize < emails.length) {
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }
    
    return results
  }
}

// Export singleton instance
export const emailService = new EmailService()

// Export for testing
export { EmailService }

// Export types
export type { EmailTemplate, EmailOptions, EmailResult }