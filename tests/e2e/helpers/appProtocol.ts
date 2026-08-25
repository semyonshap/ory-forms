import { Page } from '@playwright/test'

export interface AppProtocolHandle {
  waitForRedirect: (timeoutMs?: number) => Promise<string>
}

/**
 * "Registers" the app protocol for the duration of the test: sets up listeners
 * that capture the redirect the browser performs to the custom scheme (e.g.
 * `myapp://oauth/callback?code=...&state=...`), exactly like a native app that
 * has registered the scheme would receive the deep link.
 *
 * Capture is done through three independent mechanisms for reliability:
 *   1. the `/custom-service/consent` JSON response body (deterministic),
 *   2. CDP `Page.frameRequestedNavigation` (renderer-initiated navigation,
 *      fires even though the custom scheme never commits),
 *   3. Playwright `framenavigated` (committed navigations, fallback).
 */
export async function registerAppProtocol(
  page: Page,
  scheme: string,
): Promise<AppProtocolHandle> {
  const captured = new Set<string>()
  const push = (url: string) => {
    if (url.startsWith(`${scheme}://`)) captured.add(url)
  }

  page.on('response', async (response) => {
    if (!response.url().includes('/custom-service/consent')) return
    try {
      const body = (await response.json()) as { redirect_to?: string }
      if (typeof body?.redirect_to === 'string') push(body.redirect_to)
    } catch {
      // response is not JSON or the body was already consumed
    }
  })

  page.on('framenavigated', (frame) => {
    if (frame === page.mainFrame()) push(frame.url())
  })

  try {
    const cdp = await page.context().newCDPSession(page)
    cdp.on('Page.frameRequestedNavigation', (event: { url: string }) => {
      push(event.url)
    })
  } catch {
    // CDP is only available in Chromium-based projects
  }

  return {
    waitForRedirect: async (timeoutMs = 15_000) => {
      const deadline = Date.now() + timeoutMs
      while (Date.now() < deadline) {
        const found = [...captured].find((u) =>
          u.startsWith(`${scheme}://`),
        )
        if (found) return found
        await new Promise((resolve) => setTimeout(resolve, 100))
      }
      throw new Error(
        `No app protocol redirect to "${scheme}://..." was captured. Seen: ${
          [...captured].join(', ') || 'nothing'
        }`,
      )
    },
  }
}
