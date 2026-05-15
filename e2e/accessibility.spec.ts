import { createRequire } from 'node:module'

import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

const require = createRequire(import.meta.url)
const axePath = require.resolve('axe-core/axe.min.js')

test.describe('campaign accessibility', () => {
  test('home page has no axe violations in English and Swedish', async ({ page }) => {
    await page.addInitScript(() => {
      window.localStorage.clear()
    })
    await page.goto('/')

    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(
      page.getByRole('heading', { name: 'The internet should not require ID.' })
    ).toBeVisible()
    await expectNoAxeViolations(page, 'home en light')

    await page.goto('/?lang=sv')
    await expect(page.locator('html')).toHaveAttribute('lang', 'sv')
    await expect(
      page.getByRole('heading', { name: 'Internet ska inte kräva ID.' })
    ).toBeVisible()
    await expectNoAxeViolations(page, 'home sv light')
  })

  test('footer pages have no axe violations', async ({ page }) => {
    for (const path of ['/about', '/privacy', '/contact']) {
      await page.goto(path)
      await expect(page.locator('main h1')).toBeVisible()
      await expectNoAxeViolations(page, path)
    }
  })

  test('keyboard navigation and controls avoid URL churn', async ({
    page,
  }, testInfo) => {
    test.skip(
      testInfo.project.name.includes('safari'),
      'Playwright WebKit does not reliably emulate Safari full keyboard access.'
    )

    await page.addInitScript(() => {
      window.localStorage.clear()
    })
    await page.goto('/')

    await page.keyboard.press('Tab')
    await expect(page.getByRole('link', { name: 'Skip to content' })).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page).toHaveURL(/#main-content/)

    await page.goto('/')
    await page.locator('#targets').scrollIntoViewIfNeeded()
    const urlBeforeTheme = page.url()
    await toggleTheme(page)
    await expect(page).toHaveURL(urlBeforeTheme)
  })
})

async function toggleTheme(page: Page): Promise<void> {
  const viewport = page.viewportSize()
  if (viewport && viewport.width < 768) {
    await page.waitForTimeout(500)
    await page.getByRole('button', { name: 'Open menu' }).click()
    await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
  }

  await page.getByRole('button', { name: 'Use dark mode' }).evaluate((button) => {
    ;(button as HTMLButtonElement).click()
  })
}

async function expectNoAxeViolations(
  page: Page,
  context: string
): Promise<void> {
  await page.addScriptTag({ path: axePath })
  const result = await page.evaluate(async () => {
    return await window.axe.run(document, {
      runOnly: {
        type: 'tag',
        values: ['wcag2a', 'wcag2aa', 'wcag2aaa', 'wcag21a', 'wcag21aa', 'wcag22aa'],
      },
    })
  })

  expect(result.violations, `${context} axe violations`).toEqual([])
}

declare global {
  interface Window {
    axe: {
      run: (
        context: Document,
        options: unknown
      ) => Promise<{ violations: unknown[] }>
    }
  }
}
