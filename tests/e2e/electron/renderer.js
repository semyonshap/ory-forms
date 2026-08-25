window.__oauthCode = null

window.electronAPI.onOAuthCallback(({ code, state }) => {
  window.__oauthCode = code
  const statusEl = document.getElementById('status')
  if (statusEl) {
    statusEl.textContent = `✅ Код: ${code}`
  }
  console.log('[renderer] Получен код:', code, 'state:', state)
})

document.getElementById('start-auth').addEventListener('click', (e) => {
  e.preventDefault()
  const params = window.__authParams
  if (!params) {
    console.error('Auth params not set')
    return
  }
  const url = window.electronAPI.startAuth(params)
  window.electronAPI.openExternal(url)
})
