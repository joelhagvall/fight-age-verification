import { expect, test } from '@playwright/test'

test('renders campaign page and toggles language and theme', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.goto('http://localhost:3000/')

  await expect(
    page.getByRole('heading', {
      name: 'The internet should not require ID.',
    })
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'It is happening now' })).toBeVisible()
  await expect(page.getByText('What starts as child safety')).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: 'Why ID checks miss the point',
    })
  ).toBeVisible()
  await expect(page.getByText('Age checks sound simple')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Who is actually affected?' })).toBeVisible()
  await expect(page.getByText('The person who wants to learn online')).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Make your voice heard' })).toBeVisible()
  await expect(page.getByLabel('Country/region')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Short' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Detailed' })).toBeVisible()
  await page.waitForTimeout(500)
  const reviewButton = page.getByRole('button', { name: 'Review email' })
  await reviewButton.scrollIntoViewIfNeeded()
  await reviewButton.evaluate((button) => {
    ;(button as HTMLButtonElement).click()
  })
  await expect(page.getByText('I am writing to ask you to oppose mandatory')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy text' })).toBeVisible()
  await expect(page.getByRole('button', { name: 'Copy recipients' })).toBeVisible()
  await expect(page.getByRole('link', { name: 'Open email' })).toHaveAttribute(
    'href',
    /mailto:/
  )
  await page.getByRole('button', { name: 'Back' }).click()
  await expect(page.getByRole('button', { name: 'Review email' })).toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expectThemeToggle(page, 'Use dark mode')

  await page.waitForTimeout(500)
  await page.getByRole('button', { name: 'SV', exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole('heading', {
      name: 'Internet ska inte kräva ID.',
    })
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Gör din röst hörd' })).toBeVisible()

  await clickThemeToggle(page, 'Använd mörkt läge')
  await expect(page.locator('html')).toHaveClass(/dark/)

  await expect(page.getByText('Jag skriver till dig för att be dig motsätta dig')).toBeVisible()
})

test('navbar does not mutate the URL', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.goto('http://localhost:3000/')

  await expect(page).toHaveURL(/\/$/)
  await clickNavItem(page, 'Email')
  await expect(page.getByRole('heading', { name: 'Make your voice heard' })).toBeVisible()
  await expect(page).toHaveURL(/\/$/)
})

test('footer pages can navigate back into the campaign flow', async ({ page }) => {
  await page.goto('/about?lang=sv')

  await expect(page.getByRole('heading', { name: 'Varför sidan finns' })).toBeVisible()
  await clickNavItem(page, 'Maila')
  await expect(page).toHaveURL(/\/\?section=targets$/)
  await expect(page.getByRole('heading', { name: 'Gör din röst hörd' })).toBeVisible()
})

test('back navigation restores the campaign scroll position', async ({ page }) => {
  await page.goto('http://localhost:3000/')

  await page.locator('#targets').scrollIntoViewIfNeeded()
  await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(500)
  const campaignScrollY = await page.evaluate(() => window.scrollY)

  await page.evaluate(() => {
    document.querySelector<HTMLAnchorElement>('a[href="/about"]')?.click()
  })
  await expect(page.getByRole('heading', { name: 'Why this page exists' })).toBeVisible()
  await page.getByRole('link', { name: 'Back' }).click()
  await expect(page.getByRole('heading', { name: 'Make your voice heard' })).toBeVisible()

  await expect
    .poll(() => page.evaluate(() => window.scrollY))
    .toBeGreaterThan(campaignScrollY - 200)
})

async function clickNavItem(page: import('@playwright/test').Page, name: string) {
  const viewport = page.viewportSize()
  if (viewport && viewport.width < 768) {
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: /Open menu|Öppna meny/ }).click()
    await expect(
      page.getByRole('button', { name: /Close menu|Stäng meny/ })
    ).toBeVisible()
  }

  await page
    .getByRole('button', { name, exact: true })
    .or(page.getByRole('link', { name, exact: true }))
    .click()
}

async function expectThemeToggle(page: import('@playwright/test').Page, name: string) {
  const viewport = page.viewportSize()
  if (viewport && viewport.width < 768) {
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
  }

  await expect(page.getByRole('button', { name })).toBeVisible()
}

async function clickThemeToggle(page: import('@playwright/test').Page, name: string) {
  const viewport = page.viewportSize()
  if (viewport && viewport.width < 768) {
    const themeToggle = page.getByRole('button', { name })
    if (!(await themeToggle.isVisible())) {
      await page.waitForTimeout(500)
      await page.getByRole('button', { name: 'Öppna meny' }).click()
      await expect(page.getByRole('button', { name: 'Stäng meny' })).toBeVisible()
    }
  }

  await page.getByRole('button', { name }).click()
}
