# Firestore Collections Structure

## Overview
This document describes the Firestore collections used for authentication and user management in the WACE MVP application.

## Collections

### 1. `users`
Stores user account information.

**Document ID**: Custom generated user ID (e.g., `user_timestamp_randomhex`)

**Fields**:
```typescript
{
  id: string              // User ID (same as document ID)
  email: string           // User's email (lowercase)
  name: string            // User's full name / username
  password: string        // Hashed password (pbkdf2: salt:hash format)
  role: string            // User role: 'user' | 'admin' | 'premium'
  isVerified: boolean     // Email verification status
  createdAt: string       // ISO timestamp
  updatedAt: string       // ISO timestamp
}
```

**Example**:
```json
{
  "id": "user_lz8x9k2_a3b4c5d6e7f8g9h0",
  "email": "john@example.com",
  "name": "John Doe",
  "password": "salt123abc:hash456def...",
  "role": "user",
  "isVerified": true,
  "createdAt": "2025-10-17T10:30:00.000Z",
  "updatedAt": "2025-10-17T10:30:00.000Z"
}
```

---

### 2. `email_mappings`
Maps email addresses to user IDs for quick lookups during signin.

**Document ID**: User's email (lowercase)

**Fields**:
```typescript
{
  userId: string          // Reference to users collection
  createdAt: string       // ISO timestamp
}
```

**Example**:
```json
{
  "userId": "user_lz8x9k2_a3b4c5d6e7f8g9h0",
  "createdAt": "2025-10-17T10:30:00.000Z"
}
```

---

### 3. `temp_signups`
Temporary storage for signup data during OTP verification.

**Document ID**: User's email (lowercase)

**Fields**:
```typescript
{
  email: string           // User's email
  name: string            // User's name
  password: string        // Hashed password
  otp: string             // 6-digit OTP code
  expiresAt: string       // ISO timestamp (5 minutes from creation)
  createdAt: string       // ISO timestamp
}
```

**Lifecycle**:
- Created when user submits signup form
- Deleted after successful OTP verification or expiration

**Example**:
```json
{
  "email": "jane@example.com",
  "name": "Jane Smith",
  "password": "salt789xyz:hash012abc...",
  "otp": "123456",
  "expiresAt": "2025-10-17T10:35:00.000Z",
  "createdAt": "2025-10-17T10:30:00.000Z"
}
```

---

### 4. `sessions`
Stores active user sessions.

**Document ID**: Session ID (random hex string)

**Fields**:
```typescript
{
  id: string              // Session ID (same as document ID)
  userId: string          // Reference to users collection
  email: string           // User's email
  name: string            // User's name
  role: string            // User's role
  createdAt: string       // ISO timestamp
  expiresAt: string       // ISO timestamp (7 days from creation)
}
```

**Example**:
```json
{
  "id": "a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6",
  "userId": "user_lz8x9k2_a3b4c5d6e7f8g9h0",
  "email": "john@example.com",
  "name": "John Doe",
  "role": "user",
  "createdAt": "2025-10-17T10:30:00.000Z",
  "expiresAt": "2025-10-24T10:30:00.000Z"
}
```

---

### 5. `rate_limits`
Tracks rate limiting for authentication attempts.

**Document ID**: Rate limit key (format: `login:email` or `register:ip`)

**Fields**:
```typescript
{
  attempts: number[]      // Array of timestamps (milliseconds)
  lastAttempt: number     // Last attempt timestamp (milliseconds)
}
```

**Example**:
```json
{
  "attempts": [1729158600000, 1729158620000],
  "lastAttempt": 1729158620000
}
```

---

## Security Considerations

### Password Storage
- Passwords are hashed using **PBKDF2** with:
  - 10,000 iterations
  - 64-byte key length
  - SHA-512 algorithm
  - Random 16-byte salt
- Format: `salt:hash` (both hex encoded)
- Plain text passwords are NEVER stored

### Session Management
- Sessions expire after 7 days
- Stored as HTTP-only cookies
- Session ID is a cryptographically random 32-byte hex string

### Rate Limiting
- Login attempts: 5 per email per 15 minutes
- Registration attempts: 5 per IP per 15 minutes
- OTP verification: Tracked per email

---

## Firestore Security Rules

**Recommended security rules** (create `firestore.rules` file):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Users collection - only authenticated users can read their own data
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if false; // Only server-side writes
    }

    // Email mappings - only server can access
    match /email_mappings/{email} {
      allow read, write: if false; // Only server-side access
    }

    // Temp signups - only server can access
    match /temp_signups/{email} {
      allow read, write: if false; // Only server-side access
    }

    // Sessions - only server can access
    match /sessions/{sessionId} {
      allow read, write: if false; // Only server-side access
    }

    // Rate limits - only server can access
    match /rate_limits/{key} {
      allow read, write: if false; // Only server-side access
    }
  }
}
```

**Note**: The current implementation uses Firebase Admin SDK on the server side, which bypasses security rules. The rules above are for additional security if client-side access is ever added.

---

## Data Collected During Signup

The signup process collects the following data:

1. **Username** - Stored in `name` field (serves as display name)
2. **Email** - Stored in lowercase, used for authentication
3. **Password** - Hashed and securely stored (never plain text)

Additional fields added automatically:
- `id` - Unique user identifier
- `role` - Default: 'user'
- `isVerified` - Set to true after OTP verification
- `createdAt` - Account creation timestamp
- `updatedAt` - Last update timestamp

---

## Cleanup & Maintenance

### Automatic Cleanup
The system includes a cleanup function to remove expired data:
- Expired temp signups (>5 minutes old)
- Expired sessions (>7 days old)

### Manual Cleanup
To clean up expired data, call:
```typescript
await firestoreService.cleanupExpiredData()
```

---

## Environment Variables Required

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account-email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

---

**Last Updated**: 2025-10-17
**Version**: 1.0.0
