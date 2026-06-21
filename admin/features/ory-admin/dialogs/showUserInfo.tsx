"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useDialogStore } from "@/store/dialogStore"
import { FieldViewData } from "../../custom-form/components/fieldViewData"
import { useEffect } from "react"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

import { useUser } from "@/features/ory-admin/hooks"

export default function ShowUserInfoDialog() {
  const { open, props, closeDialog } = useDialogStore()
  const userId = (props?.userId as string) || ''

  const { data: user, isLoading, error } = useUser({ id: userId })

  useEffect(() => {
    if (error || (!user && !isLoading)) {
      toast.error("Error loading user information")
      closeDialog()
    }
  }, [error, user, isLoading, closeDialog])

  const fields = user ? [
    { label: "ID", value: user.id },
    { label: "Username", value: user.traits?.username },
    { label: "First Name", value: user.traits?.name?.first },
    { label: "Last Name", value: user.traits?.name?.last },
    { label: "Email", value: user.traits?.email },
    { label: "Public Metadata", value: user.metadata_public ? JSON.stringify(user.metadata_public, null, 2) : undefined },
    { label: "Created At", value: user.created_at ? new Date(user.created_at).toLocaleString() : undefined },
    { label: "State", value: user.state },
  ] : []

  return (
    <Dialog key={userId} open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md">
				<DialogHeader>
        	<DialogTitle>User Information</DialogTitle>
					<DialogDescription>
						Details for user
					</DialogDescription>
				</DialogHeader>
        {isLoading ? (
          <div className="flex justify-center"><Spinner /></div>
        ) : user ? (
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <FieldViewData
                key={index}
                value={field.value}
                config={{ label: field.label }}
              />
            ))}
          </div>
        ) : (
          <div className="text-center">No user data available</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
