"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDeleteClient } from "@/features/ory-admin/hooks/useClientsQuery"
import { useDialogStore } from "@/store/dialogStore"
import { toast } from "sonner"

export default function DeleteClientDialog() {
  const { open, closeDialog, props } = useDialogStore()
  const deleteMutation = useDeleteClient()

  const clientId = props?.clientId as string | undefined

  if (!clientId) return null

  const handleDelete = () => {
    deleteMutation.mutate(clientId, {
      onSuccess: () => {
        closeDialog()
      },
      onError: () => toast.error("Failed to delete client"),
    })
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Client</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete this client? This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <div className="text-sm text-muted-foreground py-2">
          You are about to delete client: <strong>{clientId}</strong>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => closeDialog()}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={deleteMutation.isPending}>
            {deleteMutation.isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
