import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  type Logger,
} from '@logtape/logtape'

const originalConsole: Console = {
  log: console.log.bind(console),
  error: console.error.bind(console),
  warn: console.warn.bind(console),
  info: console.info.bind(console),
  debug: console.debug.bind(console),
  trace: console.trace.bind(console),
} as unknown as Console

await configure({
  sinks: {
    console: getConsoleSink({
      console: originalConsole,
      formatter: getJsonLinesFormatter({
        properties: 'flatten',
      }),
    }),
  },
  loggers: [
    {
      category: 'app',
      lowestLevel:
        process.env.NODE_ENV === 'production' ? 'info' : 'debug',
      sinks: ['console'],
    },
    {
      category: ['logtape', 'meta'],
      lowestLevel: 'warning',
      sinks: ['console'],
    },
  ],
})

export const logger: Logger = getLogger(['app'])
