const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electronAPI', {
  startAuth: (params) => {
    const url = new URL('/oauth2/auth', 'http://localhost:4444')
    url.searchParams.set('client_id', params.clientId)
    url.searchParams.set('response_type', 'code')
    url.searchParams.set('redirect_uri', params.redirectUri)
    url.searchParams.set('scope', params.scope)
    url.searchParams.set('state', params.state)
    url.searchParams.set('nonce', params.nonce)
    url.searchParams.set('code_challenge', params.codeChallenge)
    url.searchParams.set('code_challenge_method', 'S256')
    return url.toString()
  },
  onOAuthCallback: (callback) => {
    ipcRenderer.on('oauth-callback', (event, data) => callback(data))
  },
  openExternal: (url) => {
    ipcRenderer.send('open-external', url)
  },
})
