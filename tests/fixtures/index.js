import { test as baseTest } from '@playwright/test'
import { AuthFixture } from './AuthFixture'

export const test = baseTest.extend({
  auth: async ({ page }, USE) => {
    const authFixture = new AuthFixture(page)
    await USE(authFixture)
  },
})

export { expect } from '@playwright/test'
