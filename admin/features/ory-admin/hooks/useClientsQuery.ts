import { ListOAuth2ClientsRequest, OAuth2Client } from '@ory/client-fetch'
import { useInfiniteQuery, useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { createClient, getClients, getClient, deleteClient } from '../actions/oauth2_clients'
import { DEFAULT_QUERY_OPTIONS } from './queryOptions'

export function useClients(req?: Omit<ListOAuth2ClientsRequest, 'pageToken'>) {
  return useInfiniteQuery<{ data: OAuth2Client[], nextToken: string | undefined }>({
    queryKey: ['clients', req],
    queryFn: ({ pageParam }) => getClients({ ...req, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useClient(id: string) {
  return useQuery<OAuth2Client | null>({
    queryKey: ['client', id],
    enabled: !!id,
    queryFn: () => getClient(id),
    ...DEFAULT_QUERY_OPTIONS,
  })
}

export function useCreateClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: createClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  })
}

export function useDeleteClient() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: deleteClient,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['clients'] }),
  })
}