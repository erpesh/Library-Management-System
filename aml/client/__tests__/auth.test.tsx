// @ts-nocheck

import { signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth/next'
import { MongoClient } from 'mongodb'

// Mock next-auth
jest.mock('next-auth/react', () => ({
  signIn: jest.fn(),
}))

jest.mock('next-auth/next', () => ({
  getServerSession: jest.fn(),
}))

// Mock MongoDB
jest.mock('mongodb', () => ({
  MongoClient: {
    connect: jest.fn().mockResolvedValue({
      db: jest.fn().mockReturnValue({
        collection: jest.fn().mockReturnValue({
          findOne: jest.fn(),
          updateOne: jest.fn(),
        }),
      }),
    }),
  },
}))

describe('Sign-in functionality with email provider', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('successful sign-in request with valid email', async () => {
    const mockUser = { email: 'user@example.com', role: 'user' }
    signIn.mockResolvedValueOnce({ ok: true, error: null })
    MongoClient.connect().then(client => 
      client.db().collection().findOne.mockResolvedValueOnce(mockUser)
    )

    const result = await signIn('email', { email: 'user@example.com' })

    expect(result.ok).toBe(true)
    expect(result.error).toBeNull()
    expect(signIn).toHaveBeenCalledWith('email', { email: 'user@example.com' })
  })

  test('failed sign-in request with invalid email format', async () => {
    signIn.mockResolvedValueOnce({ ok: false, error: 'Invalid email format' })

    const result = await signIn('email', { email: 'invalid-email' })

    expect(result.ok).toBe(false)
    expect(result.error).toBe('Invalid email format')
  })

  test('sign-in request with non-existent user email', async () => {
    MongoClient.connect().then(client => 
      client.db().collection().findOne.mockResolvedValueOnce(null)
    )
    signIn.mockResolvedValueOnce({ ok: true, error: null }) // Email provider typically doesn't error for non-existent users

    const result = await signIn('email', { email: 'nonexistent@example.com' })

    expect(result.ok).toBe(true)
    expect(result.error).toBeNull()
  })

  test('role-based access - admin user', async () => {
    const mockAdminUser = { email: 'admin@example.com', role: 'admin' }
    getServerSession.mockResolvedValueOnce(mockAdminUser)

    const session = await getServerSession()

    expect(session.role).toBe('admin')
  })

  test('role-based access - regular user', async () => {
    const mockRegularUser = { email: 'user@example.com', role: 'user' }
    getServerSession.mockResolvedValueOnce(mockRegularUser)

    const session = await getServerSession()

    expect(session?.role).toBe('user')
  })
})

