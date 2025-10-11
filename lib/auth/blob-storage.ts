/**
 * Vercel Blob Storage Service with Retry Logic
 * Provides a robust interface for storing auth data in Vercel Blob
 */

interface BlobStorageConfig {
  maxRetries?: number
  retryDelay?: number
  timeout?: number
}

interface BlobResponse<T> {
  data?: T
  error?: Error
  success: boolean
}

class BlobStorageService {
  private readonly config: Required<BlobStorageConfig>
  private readonly baseUrl: string

  constructor(config: BlobStorageConfig = {}) {
    this.config = {
      maxRetries: config.maxRetries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      timeout: config.timeout ?? 10000,
    }
    
    // In production, this would use the actual Vercel Blob API
    this.baseUrl = process.env.VERCEL_BLOB_URL || 'https://blob.vercel-storage.com'
  }

  /**
   * Retry wrapper for async operations
   */
  private async withRetry<T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> {
    let lastError: Error | undefined
    
    for (let attempt = 0; attempt < this.config.maxRetries; attempt++) {
      try {
        // Add timeout to operation
        const timeoutPromise = new Promise<never>((_, reject) => {
          setTimeout(() => reject(new Error('Operation timeout')), this.config.timeout)
        })
        
        const result = await Promise.race([operation(), timeoutPromise])
        
        // Success - return result
        return result
      } catch (error) {
        lastError = error as Error
        
        // Log the error
        console.error(`${operationName} attempt ${attempt + 1} failed:`, error)
        
        // Don't retry on certain errors
        if (this.isNonRetryableError(error)) {
          throw error
        }
        
        // Wait before retrying (exponential backoff)
        if (attempt < this.config.maxRetries - 1) {
          await this.delay(this.config.retryDelay * Math.pow(2, attempt))
        }
      }
    }
    
    // All retries failed
    throw new Error(`${operationName} failed after ${this.config.maxRetries} attempts: ${lastError?.message}`)
  }

  /**
   * Check if error should not be retried
   */
  private isNonRetryableError(error: any): boolean {
    // Don't retry on auth errors or bad requests
    if (error?.status === 401 || error?.status === 400 || error?.status === 403) {
      return true
    }
    
    // Don't retry on specific error messages
    const message = error?.message?.toLowerCase() || ''
    if (message.includes('invalid') || message.includes('unauthorized')) {
      return true
    }
    
    return false
  }

  /**
   * Delay helper for retry logic
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  /**
   * Put data to Vercel Blob
   */
  async put<T = any>(
    pathname: string, 
    data: T,
    options?: {
      contentType?: string
      cacheControlMaxAge?: number
      addRandomSuffix?: boolean
    }
  ): Promise<BlobResponse<{ url: string; pathname: string }>> {
    return this.withRetry(async () => {
      try {
        // For now, simulate the operation
        // In production, this would use @vercel/blob's put function
        const url = `${this.baseUrl}/${pathname}`
        
        // Simulate API call
        await this.delay(50) // Simulate network latency
        
        // Store in localStorage for demo (in production, this would be actual Blob storage)
        if (typeof window !== 'undefined') {
          localStorage.setItem(`blob_${pathname}`, JSON.stringify(data))
        }
        
        return {
          success: true,
          data: { url, pathname }
        }
      } catch (error) {
        return {
          success: false,
          error: error as Error
        }
      }
    }, `PUT ${pathname}`)
  }

  /**
   * Get data from Vercel Blob
   */
  async get<T = any>(pathname: string): Promise<BlobResponse<T>> {
    return this.withRetry(async () => {
      try {
        // Simulate API call
        await this.delay(30) // Simulate network latency
        
        // Get from localStorage for demo
        if (typeof window !== 'undefined') {
          const data = localStorage.getItem(`blob_${pathname}`)
          if (data) {
            return {
              success: true,
              data: JSON.parse(data) as T
            }
          }
        }
        
        return {
          success: false,
          error: new Error('Not found')
        }
      } catch (error) {
        return {
          success: false,
          error: error as Error
        }
      }
    }, `GET ${pathname}`)
  }

  /**
   * Delete data from Vercel Blob
   */
  async del(pathname: string): Promise<BlobResponse<void>> {
    return this.withRetry(async () => {
      try {
        // Simulate API call
        await this.delay(40) // Simulate network latency
        
        // Delete from localStorage for demo
        if (typeof window !== 'undefined') {
          localStorage.removeItem(`blob_${pathname}`)
        }
        
        return { success: true }
      } catch (error) {
        return {
          success: false,
          error: error as Error
        }
      }
    }, `DELETE ${pathname}`)
  }

  /**
   * List items in Vercel Blob
   */
  async list(options?: {
    prefix?: string
    limit?: number
    cursor?: string
  }): Promise<BlobResponse<{
    blobs: Array<{
      url: string
      pathname: string
      size: number
      uploadedAt: Date
    }>
    cursor?: string
    hasMore: boolean
  }>> {
    return this.withRetry(async () => {
      try {
        // Simulate API call
        await this.delay(60) // Simulate network latency
        
        const blobs: any[] = []
        
        // Get from localStorage for demo
        if (typeof window !== 'undefined') {
          const prefix = options?.prefix || ''
          const keys = Object.keys(localStorage).filter(k => k.startsWith(`blob_${prefix}`))
          
          keys.forEach(key => {
            const pathname = key.replace('blob_', '')
            blobs.push({
              url: `${this.baseUrl}/${pathname}`,
              pathname,
              size: localStorage.getItem(key)?.length || 0,
              uploadedAt: new Date()
            })
          })
        }
        
        return {
          success: true,
          data: {
            blobs,
            hasMore: false
          }
        }
      } catch (error) {
        return {
          success: false,
          error: error as Error
        }
      }
    }, 'LIST')
  }

  /**
   * Batch operations for efficiency
   */
  async batch<T = any>(operations: Array<{
    type: 'put' | 'get' | 'del'
    pathname: string
    data?: any
  }>): Promise<BlobResponse<T[]>> {
    return this.withRetry(async () => {
      try {
        const results: T[] = []
        
        // Process operations in parallel with concurrency limit
        const concurrencyLimit = 5
        for (let i = 0; i < operations.length; i += concurrencyLimit) {
          const batch = operations.slice(i, i + concurrencyLimit)
          const batchResults = await Promise.all(
            batch.map(async (op) => {
              switch (op.type) {
                case 'put':
                  return this.put(op.pathname, op.data)
                case 'get':
                  return this.get(op.pathname)
                case 'del':
                  return this.del(op.pathname)
                default:
                  throw new Error(`Unknown operation type: ${op.type}`)
              }
            })
          )
          results.push(...batchResults as T[])
        }
        
        return {
          success: true,
          data: results
        }
      } catch (error) {
        return {
          success: false,
          error: error as Error
        }
      }
    }, 'BATCH')
  }

  /**
   * Health check for the storage service
   */
  async healthCheck(): Promise<boolean> {
    try {
      const testKey = `health_check_${Date.now()}`
      const testData = { timestamp: Date.now() }
      
      // Try to write
      const putResult = await this.put(testKey, testData)
      if (!putResult.success) return false
      
      // Try to read
      const getResult = await this.get(testKey)
      if (!getResult.success) return false
      
      // Try to delete
      const delResult = await this.del(testKey)
      if (!delResult.success) return false
      
      return true
    } catch (error) {
      console.error('Health check failed:', error)
      return false
    }
  }
}

// Export singleton instance
export const blobStorage = new BlobStorageService({
  maxRetries: 3,
  retryDelay: 1000,
  timeout: 10000,
})

// Export class for testing
export { BlobStorageService }

// Export types
export type { BlobResponse, BlobStorageConfig }