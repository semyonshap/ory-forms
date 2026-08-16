'use server'

import { NextRequest, NextResponse } from 'next/server'
import { Configuration, RelationshipApi } from '@ory/client-fetch'
import env from '@/lib/env'
import { logger } from '@/lib/logger'

async function getGroupsFromKeto(subjectId: string): Promise<string[]> {
  const ketoUrl = env.ketoUrl

  if (!ketoUrl) {
    logger.debug('KETO_URL not set, returning empty groups')
    throw new Error('You need to set environment variables KETO_READ_URL')
  }

  const api = new RelationshipApi(
    new Configuration({
      basePath: ketoUrl,
    }),
  )

  const namespace = env.ketoNamespace
  const relation = env.ketoRelation

  if (!namespace || !relation) {
    logger.debug(
      'KETO_NAMESPACE or KETO_RELATION not set, returning empty groups',
      { namespace, relation },
    )
    return []
  }

  logger.debug('Fetching groups from Keto', {
    subjectId,
    namespace,
    relation,
  })
  const response = await api.getRelationships({
    namespace,
    relation,
    subjectId,
  })

  if (!response.relation_tuples) {
    logger.debug('No relation tuples returned from Keto', { subjectId })
    return []
  }

  const groups = response.relation_tuples.map((tuple) => tuple.object)
  logger.debug('Fetched groups from Keto', {
    subjectId,
    groupsCount: groups.length,
  })
  return groups
}

export async function TokenKeto(request: NextRequest) {
  logger.debug('TokenKeto hook invoked')
  try {
    const body = await request.json()
    const subjectId = body.session?.id_token?.subject

    if (!subjectId) {
      logger.debug('No subjectId in session, returning 204')
      return new NextResponse(null, { status: 204 })
    }

    const groups = await getGroupsFromKeto(subjectId)

    if (groups.length === 0) {
      logger.debug('No groups found for subject, returning 204', {
        subjectId,
      })
      return new NextResponse(null, { status: 204 })
    }

    logger.debug('Returning groups in token', {
      subjectId,
      groupsCount: groups.length,
    })
    return NextResponse.json(
      {
        session: {
          access_token: {
            groups,
          },
          id_token: {
            groups,
          },
        },
      },
      { status: 200 },
    )
  } catch (error) {
    logger.error('Token hook error:', {
      error: error instanceof Error ? error.message : String(error),
    })
    return new NextResponse(null, { status: 204 })
  }
}
