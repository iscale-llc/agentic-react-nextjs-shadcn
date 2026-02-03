import { execSync } from "child_process"

const TIMEOUT = 15_000

function exec(cmd: string): string {
  return execSync(`agent-browser ${cmd}`, {
    timeout: TIMEOUT,
    encoding: "utf-8",
  }).trim()
}

export const agentBrowser = {
  open: (url: string) => exec(`open ${url}`),
  snapshot: () => exec("snapshot"),
  click: (ref: string) => exec(`click ${ref}`),
  fill: (ref: string, text: string) => exec(`fill ${ref} "${text}"`),
  close: () => {
    try {
      exec("close")
    } catch {
      // browser may already be closed
    }
  },
  screenshot: (path: string) => exec(`screenshot ${path}`),

  waitForHydration: () => {
    exec("wait \"document.documentElement.dataset.hydrated === 'true'\"")
  },

  waitForContent: (maxRetries = 10): string => {
    for (let i = 0; i < maxRetries; i++) {
      const snap = exec("snapshot")
      if (!snap.includes('status "Loading')) return snap
      execSync("sleep 0.5")
    }
    throw new Error("Content never loaded — still showing loading state")
  },

  waitForIdle: () => {
    exec("wait \"!document.querySelector('[aria-busy=true]')\"")
  },

  authenticate: (baseUrl: string) => {
    execSync(
      `curl -s -X POST ${baseUrl}/api/auth/test-login -c /tmp/test-cookies.txt`,
      { timeout: TIMEOUT, encoding: "utf-8" }
    )
  },

  /**
   * Returns hydration errors captured by HydrationSignal, or null if none.
   * Reads from `document.documentElement.dataset.hydrationErrors`.
   */
  getHydrationErrors: (): string[] | null => {
    const raw = exec(
      "evaluate \"document.documentElement.dataset.hydrationErrors || ''\""
    )
    if (!raw) return null
    try {
      return JSON.parse(raw)
    } catch {
      return null
    }
  },

  /**
   * Asserts zero hydration errors. Call after waitForHydration + waitForContent.
   * Throws with the error messages if any were captured.
   */
  assertNoHydrationErrors: () => {
    const errors = agentBrowser.getHydrationErrors()
    if (errors && errors.length > 0) {
      throw new Error(
        `Hydration errors detected (${errors.length}):\n${errors.join("\n")}`
      )
    }
  },
}
