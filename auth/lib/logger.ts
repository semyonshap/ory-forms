import {
  configure,
  getConsoleSink,
  getJsonLinesFormatter,
  getLogger,
  type Logger,
} from '@logtape/logtape'

await configure({
  sinks: {
    console: getConsoleSink({
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
