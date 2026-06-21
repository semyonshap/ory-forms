"use client";

import { UserRow } from "./userRow";
import { Spinner } from "@/components/ui/spinner";
import { useDialogStore } from "@/store/dialogStore";
import { PageError, PageLoader } from "@/components/custom";
import { VirtualList } from "@/components/custom/virtualList";
import { useUsers } from "@/features/ory-admin/hooks/useUsersQuery";
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function UsersPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useUsers({ pageSize: 100 });

  const allUsers = data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const { openDialog } = useDialogStore();

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const onUserClick = (id: string) =>
    openDialog("showUserInfo", { userId: id });

  if (isLoading) return PageLoader();
  if (error) return PageError(error);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Users Management ({allUsers.length} users)</CardTitle>
      </CardHeader>
      <CardContent className="px-2">
        <VirtualList
          parentRef={parentRef}
          rowVirtualizer={rowVirtualizer}
          items={allUsers}
          renderRow={(user) => (
            <UserRow user={user} onUserClick={onUserClick} />
          )}
          height="calc(100vh - 260px)"
        />
        {isFetchingNextPage && (
          <div className="text-center py-2 flex justify-center">
            <Spinner />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
