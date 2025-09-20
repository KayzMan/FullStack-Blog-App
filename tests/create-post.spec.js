import { test, expect } from './fixtures/index.js'

test('allows creating a new post', async ({ page, auth }) => {
  const testUser = await auth.signUpAndLogin()

  await page.getByRole('button', { name: 'Create New' }).click()
  await page.locator('[id="\'create-title"]').click()
  await page.locator('[id="\'create-title"]').fill('Test Post')
  await page.locator('[id="\'create-title"]').press('Tab')
  await page.getByRole('textbox', { name: 'contents' }).fill('Hello, World!')
  await page.getByRole('textbox', { name: 'contents' }).press('Tab')
  await page.getByRole('textbox', { name: 'editable input' }).fill('firstTag')
  await page.getByRole('button', { name: 'submit' }).click()
  await page.getByText('Add tag').click()
  await page.getByRole('textbox', { name: 'editable input' }).fill('secondTag')
  await page.getByRole('button', { name: 'submit' }).click()
  await page.getByRole('button', { name: 'Create' }).click()

  await page.waitForURL('/')

  await expect(page.getByText(`Test PostWritten by ${testUser}`)).toBeVisible()
})
