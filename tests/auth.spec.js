import { test, expect } from '@playwright/test'

test('allows sign up and login', async ({ page }) => {
  const testUser = 'test' + Date.now()

  await page.goto('/')

  await page.getByRole('button', { name: 'Sign Up' }).click()
  await page.getByRole('textbox', { name: 'username' }).click()
  await page.getByRole('textbox', { name: 'username' }).fill(testUser)
  await page.getByRole('textbox', { name: 'password' }).click()
  await page.getByRole('textbox', { name: 'password' }).fill('test')
  await page.locator('form').getByRole('button', { name: 'Sign Up' }).click()

  await page.waitForURL('**/login')

  await page.getByRole('textbox', { name: 'username' }).click()
  await page.getByRole('textbox', { name: 'username' }).fill(testUser)
  await page.getByRole('textbox', { name: 'password' }).click()
  await page.getByRole('textbox', { name: 'password' }).fill('test')
  await page.locator('form').getByRole('button', { name: 'Log In' }).click()

  await page.waitForURL('**/')

  await expect(page.locator('nav')).toContainText(testUser)
})
