import {
  Identity,
  GetIdentityRequest,
  ListIdentitiesRequest,
} from "@ory/client-fetch";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { getIdentity, getUser, getUsers } from "../actions";
import { DEFAULT_QUERY_OPTIONS } from "./queryOptions";

export function useIdentity(id: string) {
  return useQuery<Identity | null>({
    queryKey: ["identity", id],
    queryFn: () => getIdentity(id),
    enabled: !!id,
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useUser(req: GetIdentityRequest) {
  return useQuery<Identity | null>({
    queryKey: ["user", req.id],
    queryFn: () => getUser(req),
    ...DEFAULT_QUERY_OPTIONS,
  });
}

export function useUsers(req?: Omit<ListIdentitiesRequest, "pageToken">) {
  return useInfiniteQuery<{ data: Identity[]; nextToken: string | undefined }>({
    queryKey: ["users", req],
    queryFn: ({ pageParam }) =>
      getUsers({ ...req, pageToken: pageParam as string | undefined }),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextToken,
    ...DEFAULT_QUERY_OPTIONS,
  });
}
