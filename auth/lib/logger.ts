import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  isLogLevel,
  LogLevel,
} from '@logtape/logtape'
import { redactByField } from '@logtape/redaction'
import env from '@/lib/env'

const originalConsole: Console = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
  trace: console.trace.bind(console),
} as unknown as Console

const consoleSink = getConsoleSink({
  console: originalConsole,
  formatter: getJsonLinesFormatter({
    properties: 'flatten',
  }),
})

function maskString(value: unknown): unknown {
  if (typeof value !== 'string') return value
  if (value.length <= 4) return '*'.repeat(value.length)
  const visible = value.slice(0, 4)
  const hidden = '*'.repeat(value.length - 4)
  return visible + hidden
}

const redactedSink = redactByField(consoleSink, {
  fieldPatterns: [/secret/i, 'password'],
  action: maskString,
})

const level = env.log_level?.toLowerCase() || ''
const lowestLevel: LogLevel = isLogLevel(level)
  ? level
  : process.env.NODE_ENV === 'production'
    ? 'info'
    : 'debug'

await configure({
  sinks: {
    console: redactedSink,
  },
  loggers: [
    {
      category: 'app',
      lowestLevel,
      sinks: ['console'],
    },
    {
      category: ['logtape', 'meta'],
      lowestLevel: 'warning',
      sinks: ['console'],
    },
  ],
})

export const logger = getLogger(['app'])
