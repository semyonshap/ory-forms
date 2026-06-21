"use client";

import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { RelationshipRow } from "./relationshipRow";
import { useDialogStore } from "@/store/dialogStore";
import { PageError, PageLoader } from "@/components/custom";
import { VirtualList } from "@/components/custom/virtualList";
import { useInfiniteVirtualizer } from "@/hooks/useInfiniteVirtualizer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRelationships } from "@/features/ory-admin/hooks/useRelationshipsQuery";

export default function RelationshipsPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    error,
  } = useRelationships({ pageSize: 100 });

  const allRelationships = data?.pages.flatMap((page) => page.data ?? []) ?? [];
  const { openDialog } = useDialogStore();

  const { parentRef, rowVirtualizer } = useInfiniteVirtualizer({
    items: allRelationships,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  });

  if (isLoading) return PageLoader();
  if (error) return PageError(error);
	
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Relationships Management</CardTitle>
          <Button
            variant="outline"
            onClick={() => openDialog("createRelationship")}
          >
            <PlusCircle className="h-4 w-4" />
            Relationship
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-2">
        <div className="flex items-center p-2 border-b font-semibold gap-4">
          <div className="flex-1">Namespace</div>
          <div className="flex-1">Object</div>
          <div className="flex-1">Relation</div>
          <div className="flex-1">Subject</div>
          <div className="w-10" />
        </div>
        <VirtualList
          parentRef={parentRef}
          rowVirtualizer={rowVirtualizer}
          items={allRelationships}
          renderRow={(rel) => <RelationshipRow rel={rel} />}
          height="calc(100vh - 300px)"
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
