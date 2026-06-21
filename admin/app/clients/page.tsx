"use client";

import { toast } from "sonner";
import { ClientRow } from "./clientRow";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useDialogStore } from "@/store/dialogStore";
import { PageError, PageLoader } from "@/components/custom";
import { VirtualList } from "@/components/custom/virtualList";
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer";
import { useClients } from "@/features/ory-admin/hooks/useClientsQuery";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ClientsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useClients({ pageSize: 100 });
  const { openDialog } = useDialogStore();

  const allClients = data?.pages.flatMap((page) => page.data ?? []) ?? [];

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allClients,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  const onClientClick = (clientId: string) => {
    if (!clientId) {
      toast.error("Client not found");
      return;
    }
    openDialog("showClientInfo", { clientId });
  };

  const onDeleteClick = (clientId: string) => {
    if (!clientId) {
      toast.error("Client not found");
      return;
    }
    openDialog("deleteClient", { clientId });
  };

  if (isLoading) return PageLoader();
  if (error) return PageError(error);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>
            Clients Management ({allClients.length} clients)
          </CardTitle>
          <Button variant="outline" onClick={() => openDialog("createClient")}>
            <PlusCircle className="h-4 w-4" />
            Client
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <VirtualList
          parentRef={parentRef}
          rowVirtualizer={rowVirtualizer}
          items={allClients}
          renderRow={(client) => (
            <ClientRow
              client={client}
              onClientClick={onClientClick}
              onDeleteClick={onDeleteClick}
            />
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
