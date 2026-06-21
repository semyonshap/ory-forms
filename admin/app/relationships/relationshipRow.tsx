import { Button } from "@/components/ui/button";
import { useDialogStore } from "@/store/dialogStore";
import { Relationship } from "@ory/client-fetch";
import { Trash2 } from "lucide-react";

export const RelationshipRow = ({ rel }: { rel: Relationship }) => {
  const { openDialog } = useDialogStore();

  return (
    <div className="flex items-center p-2 border-b gap-4">
      <div className="flex-1 truncate">{rel.namespace}</div>
      <div className="flex-1 truncate">{rel.object}</div>
      <div className="flex-1 truncate">{rel.relation}</div>
      <div className="flex-1 truncate">
        {rel.subject_id
          ? rel.subject_id
          : rel.subject_set
            ? `${rel.subject_set.namespace}:${rel.subject_set.object}#${rel.subject_set.relation}`
            : "N/A"}
      </div>
      <Button
        variant="outline"
        size="sm"
        onClick={() => openDialog("deleteRelationship", { relationship: rel })}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  );
};
