import { exec } from 'child_process'
import type { TestInfo } from '@playwright/test'

export function openExternalBrowser(url: string) {
  const command =
    process.platform === 'win32'
      ? `start "" "${url}"`
      : process.platform === 'darwin'
        ? `open "${url}"`
        : `xdg-open "${url}"`
  exec(command, (error) => {
    if (error) console.error('Failed to open external browser:', error)
  })
}
