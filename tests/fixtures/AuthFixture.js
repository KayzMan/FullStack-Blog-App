export class AuthFixture {
  constructor(page) {
    this.page = page
  }

  async signUpAndLogin() {
    const testUser = 'test' + Date.now()

    await this.page.goto('/')

    await this.page.getByRole('button', { name: 'Sign Up' }).click()
    await this.page.getByRole('textbox', { name: 'username' }).click()
    await this.page.getByRole('textbox', { name: 'username' }).fill(testUser)
    await this.page.getByRole('textbox', { name: 'password' }).click()
    await this.page.getByRole('textbox', { name: 'password' }).fill('test')
    await this.page
      .locator('form')
      .getByRole('button', { name: 'Sign Up' })
      .click()

    await this.page.waitForURL('**/login')

    await this.page.getByRole('textbox', { name: 'username' }).click()
    await this.page.getByRole('textbox', { name: 'username' }).fill(testUser)
    await this.page.getByRole('textbox', { name: 'password' }).click()
    await this.page.getByRole('textbox', { name: 'password' }).fill('test')
    await this.page
      .locator('form')
      .getByRole('button', { name: 'Log In' })
      .click()

    await this.page.waitForURL('**/')

    return testUser
  }
}
