import mongoose from 'mongoose'
import { describe, expect, test } from '@jest/globals'

import { createUser } from '../services/users'

describe('creating users', () => {
  test('should succeed when username and password is provided', async () => {
    const user = { username: 'Ngoni', password: '123' }
    const createdUser = await createUser(user)

    expect(createdUser._id).toBeInstanceOf(mongoose.Types.ObjectId)
  })

  test('should fail if username is not provided', async () => {
    const user = { password: '123' }
    try {
      await createUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(mongoose.Error.ValidationError)
      expect(error.message).toContain('`username` is required')
    }
  })

  test('should fail if password is not provided', async () => {
    const user = { username: 'Ngoni' }
    try {
      await createUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('data and salt arguments required')
    }
  })

  test('should fail if username and password is not provided', async () => {
    const user = {}
    try {
      await createUser(user)
    } catch (error) {
      expect(error).toBeInstanceOf(Error)
      expect(error.message).toContain('data and salt arguments required')
    }
  })
})
