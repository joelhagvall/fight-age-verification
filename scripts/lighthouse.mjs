import { spawn } from 'node:child_process'
import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { launch } from 'chrome-launcher'
import lighthouse from 'lighthouse'

const root = dirname(fileURLToPath(import.meta.url)).replace(/\/scripts$/, '')
const port = 4173
const url = `http://127.0.0.1:${port}`
const reportDir = join(root, 'lighthouse-report')
const thresholds = {
  accessibility: 1,
  'best-practices': 1,
  performance: process.env.CI ? 0.8 : 1,
  seo: 1,
}

await mkdir(reportDir, { recursive: true })

const server = spawn(
  'bun',
  ['run', 'preview', '--', '--host', '127.0.0.1', '--port', String(port)],
  {
    cwd: root,
    stdio: ['ignore', 'pipe', 'pipe'],
  }
)

let chrome

try {
  await waitForServer(url)
  chrome = await launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-dev-shm-usage'],
  })

  const result = await lighthouse(url, {
    port: chrome.port,
    preset: 'desktop',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
    output: ['json', 'html'],
    logLevel: 'error',
  })

  if (!result) {
    throw new Error('Lighthouse did not return a result')
  }

  const [jsonReport, htmlReport] = Array.isArray(result.report)
    ? result.report
    : [result.report, result.report]

  await writeFile(join(reportDir, 'report.json'), jsonReport)
  await writeFile(join(reportDir, 'report.html'), htmlReport)

  const scores = Object.fromEntries(
    Object.entries(result.lhr.categories).map(([key, value]) => [
      key,
      value.score,
    ])
  )

  for (const [category, minimum] of Object.entries(thresholds)) {
    const score = scores[category]
    if (typeof score !== 'number' || score < minimum) {
      throw new Error(
        `Lighthouse ${category} score ${score ?? 'missing'} is below ${minimum}`
      )
    }
  }

  console.log('Fight Age Verification Lighthouse scores:', scores)
} finally {
  await chrome?.kill()
  server.kill('SIGTERM')
}

async function waitForServer(targetUrl) {
  const started = Date.now()
  while (Date.now() - started < 30_000) {
    try {
      const response = await fetch(targetUrl)
      if (response.ok) {
        return
      }
    } catch {
      await new Promise((resolve) => setTimeout(resolve, 250))
    }
  }

  throw new Error(`Timed out waiting for ${targetUrl}`)
}
