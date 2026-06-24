"use client";

import { useEffect } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { Spinner } from "@/components/ui/spinner";
import { useDialogStore } from "@/store/dialogStore";
import { useIdentity, useClient } from "@/features/ory-admin/hooks";
import CopyToClipboard from "@/components/custom/copyToClipboard";

export default function ShowClientInfoDialog() {
  const { open, props, closeDialog, openDialog } = useDialogStore();
  const clientId = (props?.clientId as string) || "";

  const { data: client, isLoading, error } = useClient(clientId);
  const { data: ownerIdentity } = useIdentity(client?.owner || "");

  useEffect(() => {
    if (error || (!client && !isLoading)) {
      toast.error("Error loading client information");
      closeDialog();
    }
  }, [error, client, isLoading, closeDialog]);

  // Собираем поля для отображения и для копирования
  const fields = client
    ? [
        { label: "ID", value: client.client_id },
        { label: "Name", value: client.client_name },
        { label: "Grant Types", value: client.grant_types?.join(", ") },
        {
          label: "Token Endpoint Auth Method",
          value: client.token_endpoint_auth_method,
        },
        {
          label: "Scopes",
          value: client.scope?.split(" ").filter((s: string) => s),
        },
        { label: "Audience", value: client.audience?.join(", ") },
        { label: "Redirect URIs", value: client.redirect_uris?.join(", ") },
        {
          label: "Post Logout URIs",
          value: client.post_logout_redirect_uris?.join(", "),
        },
        {
          label: "Owner",
          value:
            ownerIdentity?.traits?.username ||
            ownerIdentity?.traits?.email ||
            client.owner ||
            "N/A",
          onClick: () => {
            if (client.owner) {
              openDialog("showUserInfo", { userId: client.owner });
            }
          },
        },
        {
          label: "Created At",
          value: client.created_at
            ? new Date(client.created_at).toLocaleString()
            : undefined,
        },
        {
          label: "Updated At",
          value: client.updated_at
            ? new Date(client.updated_at).toLocaleString()
            : undefined,
        },
      ]
    : [];

  const infoText = fields
    .map(
      (field) =>
        `${field.label}: ${Array.isArray(field.value) ? field.value.join(", ") : field.value || "N/A"}`
    )
    .join("\n");

  return (
    <Dialog key={clientId} open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader className="flex flex-row justify-between items-start">
          <div>
            <DialogTitle>Client Information</DialogTitle>
            <DialogDescription>Details for OAuth2 client</DialogDescription>
          </div>
          <CopyToClipboard text={infoText} label="Client information" />
        </DialogHeader>

        {isLoading ? (
          <div className="flex justify-center">
            <Spinner />
          </div>
        ) : client ? (
          <div className="flex flex-col gap-2">
            {fields.map((field, index) => (
              <div
                key={index}
                className={`flex items-start justify-between text-sm ${
                  field.onClick ? "cursor-pointer hover:underline" : ""
                }`}
                onClick={field.onClick}
              >
                <span className="font-medium text-muted-foreground">
                  {field.label}:
                </span>
                <span className="text-right break-all max-w-[70%]">
                  {Array.isArray(field.value)
                    ? field.value.join(", ") || "N/A"
                    : field.value || "N/A"}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center">No client data available</div>
        )}
      </DialogContent>
    </Dialog>
  );
}