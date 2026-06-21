import { useState, useEffect } from "react"
import { getRelationships, getUsers } from "../actions"
import { Identity, Relationship } from "@ory/client-fetch"

export interface SubjectSuggestion {
  value: string
  label: string
}

export function useSubjectUsers(query: string) {
  const [suggestions, setSuggestions] = useState<SubjectSuggestion[]>([])

  useEffect(() => {
    if (!query) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        const usersResult = await getUsers({ pageSize: 5, credentialsIdentifier: query })
        const users = usersResult.data?.map((u: Identity) => ({
          value: u.id,
          label: u.traits?.email || u.id,
        })) || []
        setSuggestions(users.slice(0, 10))
      } catch (error) {
        console.error('Error fetching user suggestions:', error)
        setSuggestions([])
      }
    }

    const timeout = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeout)
  }, [query])

  return suggestions
}

export function useSubjectRelations(query: string) {
  const [suggestions, setSuggestions] = useState<SubjectSuggestion[]>([])

  useEffect(() => {
    if (!query) {
      setSuggestions([])
      return
    }

    const fetchSuggestions = async () => {
      try {
        const tuplesResult = await getRelationships({
          pageSize: 5,
        })
        const tuples = tuplesResult.data?.map((t: Relationship) => ({
          value: t.subject_id!,
          label: t.subject_id!,
        })) || []
        setSuggestions(tuples.slice(0, 10))
      } catch (error) {
        console.error('Error fetching relation suggestions:', error)
        setSuggestions([])
      }
    }

    const timeout = setTimeout(fetchSuggestions, 300)
    return () => clearTimeout(timeout)
  }, [query])

  return suggestions
}