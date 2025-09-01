import mongoose from 'mongoose'
import { beforeAll, afterAll } from '@jest/globals'
import { initDatabase } from '../db/init.js'

// before all tests run...
beforeAll(async () => {
  await initDatabase()
})

// after all tests finish running...
afterAll(async () => {
  await mongoose.disconnect()
})
