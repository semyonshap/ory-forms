"use client"

import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormProvider } from "react-hook-form"
import { useCreateClient } from "@/features/ory-admin/hooks/useClientsQuery"
import { useDialogStore } from "@/store/dialogStore"
import { useSession } from "@/features/ory-api"
import { toast } from "sonner"
import { FieldGroups } from "../../custom-form/components/fieldGroups"
import { CreateOAuth2ClientRequest } from "@ory/client-fetch"

type CreateClientForm = Omit<Partial<CreateOAuth2ClientRequest['oAuth2Client']>, 'scope'> & {
  scope?: string[];
}

export default function CreateClientDialog() {
  const { open, closeDialog, openDialog } = useDialogStore()
  const createClientMutation = useCreateClient()
  const { session } = useSession()

  const form = useForm<CreateClientForm>({
    defaultValues: {
      client_name: "",
      redirect_uris: [],
      post_logout_redirect_uris: [],
      grant_types: ["authorization_code", "refresh_token"],
      scope: ["openid", "profile", "email"],
      audience: [],
      token_endpoint_auth_method: "client_secret_basic",
    },
  })

  const onSubmit = (data: CreateClientForm) => {
    if (!session?.identity?.id) {
      toast.error("Session not found or user not authenticated")
      return
    }
    createClientMutation.mutate(
      {
				oAuth2Client: {
					...data,
					scope: data.scope?.join(' ') || '',
					owner: session.identity.id,
				},
      },
      {
        onSuccess: (response) => {
          if (response) {
            closeDialog()
            openDialog('showClient', { clientId: response.client_id, clientSecret: response.client_secret })
            form.reset()
          } else {
            toast.error("Failed to create client")
          }
        },
        onError: (error) => {
          toast.error("Failed to create client: " + error.message)
        },
      }
    )
  }

  const fields = [
    {
      name: "client_name" as const,
      label: "Client Name",
      placeholder: "My OAuth2 Client",
    },
    {
      name: "redirect_uris" as const,
      label: "Redirect URIs",
      placeholder: "https://example.com/callback, https://another.com/callback",
    },
    {
      name: "post_logout_redirect_uris" as const,
      label: "Post Logout Redirect URIs",
      placeholder: "https://example.com/logout, https://another.com/logout",
    },
    {
      name: "grant_types" as const,
      label: "Grant Types",
      type: "multi-select" as const,
      options: [
        { value: "authorization_code", label: "Authorization Code" },
        { value: "refresh_token", label: "Refresh Token" },
        { value: "client_credentials", label: "Client Credentials" },
        { value: "implicit", label: "Implicit" },
        { value: "device_authorization", label: "Device Authorization" },
      ],
    },
    {
      name: "scope" as const,
      label: "Scopes",
      type: "creatable-multi-select" as const,
      options: [
        { value: "openid"},
        { value: "profile"},
        { value: "email"},
        { value: "offline_access"},
				{ value: "introspect"},
      ],
      placeholder: "Select or enter custom scopes",
    },
    {
      name: "audience" as const,
      label: "Audience (optional)",
      placeholder: "application, service_a",
    },
    {
      name: "token_endpoint_auth_method" as const,
      label: "Token Endpoint Auth Method",
      type: "select" as const,
      options: [
        { value: "client_secret_basic", label: "Client Secret Basic" },
        { value: "client_secret_post", label: "Client Secret Post" },
        { value: "private_key_jwt", label: "Private Key JWT" },
        { value: "none", label: "None" },
      ],
    },
  ]

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-[425px]"  showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create OAuth2 Client</DialogTitle>
          <DialogDescription>
            Add a new OAuth2 client to your application.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <FieldGroups
              control={form.control}
              configs={fields}
              values={form.watch()}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => closeDialog()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createClientMutation.isPending}>
                {createClientMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}