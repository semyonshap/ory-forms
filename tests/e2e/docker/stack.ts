import { spawn } from 'node:child_process'
import * as fs from 'node:fs'
import * as path from 'node:path'
import {
  GenericContainer,
  Network,
  StartedNetwork,
  StartedTestContainer,
  Wait,
} from 'testcontainers'

const REPO_ROOT = path.resolve(__dirname, '..', '..', '..')
const CONFIG_DIR = path.join(REPO_ROOT, 'tests', 'config')
const AUTH_ENV_FILE = path.join(REPO_ROOT, 'tests', 'config', 'auth.env')
const AUTH_IMAGE = 'ory-forms-e2e-auth'

const EXTRA_HOSTS = [
  { host: 'host.docker.internal', ipAddress: 'host-gateway' },
]

function parseEnvFile(file: string): Record<string, string> {
  const content = fs.readFileSync(file, 'utf8')
  const env: Record<string, string> = {}
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

function imageExists(image: string): Promise<boolean> {
  return new Promise((resolve) => {
    const child = spawn('docker', ['image', 'inspect', image])
    child.on('error', () => resolve(false))
    child.on('close', (code) => resolve(code === 0))
  })
}

async function ensureAuthImage(): Promise<void> {
  const rebuild = process.env.E2E_REBUILD_AUTH === '1'
  if (!rebuild && (await imageExists(AUTH_IMAGE))) {
    console.log(
      '[testcontainers] Auth image already exists, skipping build.',
    )
    return
  }
  console.log('[testcontainers] Building auth image...')
  await GenericContainer.fromDockerfile(REPO_ROOT, 'Dockerfile')
    .withBuildArgs({ ENV_FILE: '/app/tests/config/auth.env' })
    .build(AUTH_IMAGE, { deleteOnExit: false })
}

export interface Stack {
  network: StartedNetwork | null
  containers: StartedTestContainer[]
}

export async function startStack(): Promise<Stack> {
  if (process.env.E2E_SKIP_DOCKER === '1') {
    console.log(
      '[testcontainers] E2E_SKIP_DOCKER=1, using an external stack.',
    )
    return { network: null, containers: [] }
  }

  await ensureAuthImage()

  const network = await new Network().start()
  const containers: StartedTestContainer[] = []

  const kratos = await new GenericContainer('oryd/kratos:latest')
    .withNetwork(network)
    .withNetworkAliases('kratos')
    .withExposedPorts(
      { container: 4433, host: 4433 },
      { container: 4434, host: 4434 },
    )
    .withExtraHosts(EXTRA_HOSTS)
    .withCopyDirectoriesToContainer([
      { source: CONFIG_DIR, target: '/etc/config' },
    ])
    .withCommand(['serve', '-c', '/etc/config/kratos.yaml', '--dev'])
    .withWaitStrategy(
      Wait.forHttp('/health/ready', 4434).withStartupTimeout(120_000),
    )
    .start()
  containers.push(kratos)

  const keto = await new GenericContainer('oryd/keto:latest')
    .withNetwork(network)
    .withNetworkAliases('keto')
    .withExposedPorts(
      { container: 4466, host: 4466 },
      { container: 4467, host: 4467 },
    )
    .withExtraHosts(EXTRA_HOSTS)
    .withCopyDirectoriesToContainer([
      { source: CONFIG_DIR, target: '/etc/config' },
    ])
    .withCommand(['serve', 'all', '-c', '/etc/config/keto.yaml'])
    .withWaitStrategy(
      Wait.forHttp('/health/ready', 4467).withStartupTimeout(120_000),
    )
    .start()
  containers.push(keto)

  const hydra = await new GenericContainer('oryd/hydra:latest')
    .withNetwork(network)
    .withNetworkAliases('hydra')
    .withExposedPorts(
      { container: 4444, host: 4444 },
      { container: 4445, host: 4445 },
    )
    .withExtraHosts(EXTRA_HOSTS)
    .withCopyDirectoriesToContainer([
      { source: CONFIG_DIR, target: '/etc/config' },
    ])
    .withCommand(['serve', 'all', '-c', '/etc/config/hydra.yaml', '--dev'])
    .withWaitStrategy(
      Wait.forHttp('/health/ready', 4445).withStartupTimeout(120_000),
    )
    .start()
  containers.push(hydra)

  const auth = await new GenericContainer(AUTH_IMAGE)
    .withNetwork(network)
    .withNetworkAliases('auth')
    .withExposedPorts({ container: 8080, host: 8080 })
    .withExtraHosts(EXTRA_HOSTS)
    .withEnvironment(parseEnvFile(AUTH_ENV_FILE))
    .withWaitStrategy(
      Wait.forHttp('/api/health', 8080).withStartupTimeout(180_000),
    )
    .start()
  containers.push(auth)

  console.log('[testcontainers] e2e stack started.')
  return { network, containers }
}

export async function stopStack(stack: Stack): Promise<void> {
  if (!stack.network) return
  for (const container of stack.containers) {
    try {
      await container.stop()
    } catch {
      // already stopped
    }
  }
  try {
    await stack.network.stop()
  } catch {
    // already removed
  }
  console.log('[testcontainers] e2e stack stopped.')
}
