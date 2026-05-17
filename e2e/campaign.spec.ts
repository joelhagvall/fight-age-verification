import { expect, test } from '@playwright/test'
import en from '../src/i18n/en.json' with { type: 'json' }
import sv from '../src/i18n/sv.json' with { type: 'json' }

const learningScenario = en.scenarios.items.find((item) => item.id === 'engineer')

if (!learningScenario) {
  throw new Error('Expected English learning scenario fixture to exist.')
}

test('renders campaign page and toggles language and theme', async ({ page }) => {
  await page.context().grantPermissions(['clipboard-write'], {
    origin: 'http://localhost:3000',
  })
  await page.addInitScript(() => {
    window.localStorage.clear()
    window.localStorage.setItem('fight-age-verification:locale:v1', 'en')
  })
  await page.goto('http://localhost:3000/')
  await waitForHydration(page)

  await expect(
    page.getByRole('heading', {
      name: en.hero.title,
    })
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: en.issue.title })).toBeVisible()
  await expect(page.getByText(en.issue.lead)).toBeVisible()
  await expect(
    page.getByRole('heading', {
      name: en.questions.title,
    })
  ).toBeVisible()
  await expect(page.getByText(en.questions.lead)).toBeVisible()
  await expect(page.getByRole('heading', { name: en.scenarios.title })).toBeVisible()
  await expect(page.getByText(learningScenario.title)).toBeVisible()
  await expect(page.getByRole('heading', { name: en.targets.title })).toBeVisible()
  await expect(page.getByLabel(en.targets.countryLabel)).toBeVisible()
  await expect(page.getByRole('button', { name: en.targets.templateShort })).toBeVisible()
  await expect(page.getByRole('button', { name: en.targets.templateLong })).toBeVisible()
  await page.waitForTimeout(500)
  const reviewButton = page.getByRole('button', { name: en.targets.continue })
  await reviewButton.evaluate((button) => {
    button.scrollIntoView({ block: 'center' })
  })
  await expect(reviewButton).toBeInViewport()
  await reviewButton.click()
  await expect(page.getByRole('button', { name: en.targets.copyBody })).toBeVisible()
  await expect(page.getByText('I am writing to ask you to oppose mandatory')).toBeVisible()
  await expect(page.getByRole('button', { name: en.targets.copyRecipients })).toBeVisible()
  await expect(page.getByRole('link', { name: en.targets.button })).toHaveAttribute(
    'href',
    /mailto:/
  )
  await page.getByRole('button', { name: en.targets.copyBody }).click()
  await expect(page.getByText(en.targets.copied)).toBeVisible()
  await page.getByRole('button', { name: en.targets.back }).click()
  await expect(page.getByRole('button', { name: en.targets.continue })).toBeVisible()
  await expect(page.getByText(en.targets.copied)).not.toBeVisible()
  await expect(page.locator('html')).not.toHaveClass(/dark/)
  await expectThemeToggle(page, en.nav.themeDark)

  await page.waitForTimeout(500)
  await page.getByRole('button', { name: en.nav.language, exact: true }).click()
  await expect(page).toHaveURL(/\/$/)
  await expect(
    page.getByRole('heading', {
      name: sv.hero.title,
    })
  ).toBeVisible()
  await expect(page.getByRole('heading', { name: sv.targets.title })).toBeVisible()

  await clickThemeToggle(page, sv.nav.themeDark)
  await expect(page.locator('html')).toHaveClass(/dark/)

  await expect(
    page.getByText('I am writing to ask you to oppose mandatory')
  ).toBeVisible()
})

test('navbar does not mutate the URL', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.goto('http://localhost:3000/')
  await waitForHydration(page)

  await expect(page).toHaveURL(/\/$/)
  await clickNavItem(page, 'Email')
  await expect(page.getByRole('heading', { name: 'Make your voice heard' })).toBeVisible()
  await expect(page).toHaveURL(/\/$/)
})

test('recipient checkboxes and cards toggle selection', async ({ page }) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.goto('http://localhost:3000/')
  await waitForHydration(page)

  const checkbox = page.getByRole('checkbox', { name: 'Ursula von der Leyen' })
  await expect(checkbox).toBeChecked()

  await checkbox.click()
  await expect(checkbox).not.toBeChecked()

  await page.getByText('Ursula von der Leyen', { exact: true }).click()
  await expect(checkbox).toBeChecked()
})

test('uses English email copy for EU recipients when the page is Swedish', async ({
  page,
}) => {
  await page.addInitScript(() => {
    window.localStorage.clear()
  })
  await page.goto('http://localhost:3000/')
  await waitForHydration(page)

  await page.getByRole('button', { name: 'SV', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Gör din röst hörd' })
  ).toBeVisible()

  await page.getByRole('button', { name: 'Granska mailet' }).click()
  await expect(
    page.getByText('I am writing to ask you to oppose mandatory')
  ).toBeVisible()
  await expect(page.getByText('Jag skriver till dig')).not.toBeVisible()
})

test('footer pages can navigate back into the campaign flow', async ({ page }) => {
  await page.goto('/about?lang=sv')
  await waitForHydration(page)

  await expect(page.getByRole('heading', { name: 'Varför sidan finns' })).toBeVisible()
  await clickNavItem(page, 'Maila')
  await expect(page).toHaveURL(/\/\?section=targets$/)
  await expect(page.getByRole('heading', { name: 'Gör din röst hörd' })).toBeVisible()
})

async function waitForHydration(page: import('@playwright/test').Page) {
  await expect(page.locator('html')).toHaveAttribute('data-hydrated', 'true', {
    timeout: 10_000,
  })
}

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
