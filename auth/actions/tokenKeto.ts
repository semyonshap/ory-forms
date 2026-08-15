'use server'

import { NextRequest, NextResponse } from 'next/server'
import { Configuration, RelationshipApi } from '@ory/client-fetch'
import { oryConfig } from '@/ory.config'

async function getGroupsFromKeto(subjectId: string): Promise<string[]> {
  const ketoUrl = oryConfig.project.keto_url

  if (!ketoUrl)
    throw new Error('You need to set environment variables KETO_READ_URL')

  const api = new RelationshipApi(
    new Configuration({
      basePath: ketoUrl,
    }),
  )

  const namespace = oryConfig.project.keto_namespace
  const relation = oryConfig.project.keto_relation

  if (!namespace || !relation) return []

  const response = await api.getRelationships({
    namespace,
    relation,
    subjectId,
  })

  if (!response.relation_tuples) {
    return []
  }

  return response.relation_tuples.map((tuple) => tuple.object)
}

export async function TokenKeto(request: NextRequest) {
  try {
    const body = await request.json()

    const subjectId = body.session?.id_token?.subject

    if (!subjectId) {
      return new NextResponse(null, { status: 204 })
    }

    const groups = await getGroupsFromKeto(subjectId)

    if (groups.length === 0) {
      return new NextResponse(null, { status: 204 })
    }

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
    console.error('Token hook error:', error)
    return new NextResponse(null, { status: 204 })
  }
}
