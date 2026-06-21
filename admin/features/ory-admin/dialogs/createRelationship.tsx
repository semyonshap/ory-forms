"use client"

import { toast } from "sonner"
import { useForm } from "react-hook-form"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FormProvider } from "react-hook-form"
import { useCreateRelationship } from "@/features/ory-admin/hooks/useRelationshipsQuery"
import { useSubjectUsers } from "@/features/ory-admin/hooks/useSubjectSuggestions"
import { useDialogStore } from "@/store/dialogStore"
import { namespaces, namespaceRelations } from "../utils/relationsConfig"
import { FieldGroups } from "../../custom-form/components/fieldGroups"
import { CreateRelationshipBody } from "@ory/client-fetch"

type CreateRelationshipForm = Partial<CreateRelationshipBody> & {
  subjectType: "id" | "set";
}

export default function CreateRelationshipDialog() {
  const { open, closeDialog } = useDialogStore()
  const createRelationshipMutation = useCreateRelationship()

  const form = useForm<CreateRelationshipForm>({
    defaultValues: {
      namespace: "",
      object: "",
      relation: "",
      subjectType: "id",
      subject_id: "",
      subject_set: {
        namespace: "",
        object: "",
        relation: "",
      },
    },
  })

  const [subjectQuery, setSubjectQuery] = useState("")

  const subjectType = form.watch("subjectType")

  const userSuggestions = useSubjectUsers(subjectQuery)

  const selectedNamespace = form.watch("namespace")
  const relations = selectedNamespace ? namespaceRelations[selectedNamespace] || [] : []

  const subjectSetNamespace = form.watch("subject_set.namespace")
  const subjectSetRelations = subjectSetNamespace ? namespaceRelations[subjectSetNamespace] || [] : []

  const getFields = (subjectType: string) => [
    {
      name: "namespace" as const,
      label: "Namespace",
      type: "select" as const,
      placeholder: "Select a namespace",
      options: namespaces.map(ns => ({ value: ns, label: ns })),
    },
    {
      name: "object" as const,
      label: "Object",
      placeholder: "e.g., devs",
    },
    {
      name: "relation" as const,
      label: "Relation",
      type: "select" as const,
      placeholder: relations.length === 0 ? "No relations available for this namespace" : "Select a relation",
      options: relations.map((rel: string) => ({ value: rel, label: rel })),
      disabled: relations.length === 0,
    },
    {
      name: "subjectType" as const,
      label: "Subject Type",
      type: "radio" as const,
      options: [
        { value: "id", label: "ID" },
        { value: "set", label: "Set" },
      ],
    },
    ...(subjectType === "id" ? [{
      name: "subject_id" as const,
      label: "Subject ID",
      type: "combobox" as const,
      placeholder: "Search or enter subject ID",
      options: userSuggestions,
      onInputChange: setSubjectQuery,
    }] : []),
    ...(subjectType === "set" ? [
      {
        name: "subject_set.namespace" as const,
        label: "Subject Set Namespace",
        type: "select" as const,
        placeholder: "Select a namespace",
        options: namespaces.map(ns => ({ value: ns, label: ns })),
      },
      {
        name: "subject_set.object" as const,
        label: "Subject Set Object",
        placeholder: "e.g., alice",
      },
      {
        name: "subject_set.relation" as const,
        label: "Subject Set Relation",
        type: "select" as const,
        placeholder: subjectSetRelations.length === 0 ? "No relations available for this namespace" : "Select a relation",
        options: subjectSetRelations.map((rel: string) => ({ value: rel, label: rel })),
        disabled: subjectSetRelations.length === 0,
      },
    ] : []),
  ]

  const onSubmit = (data: CreateRelationshipForm) => {
    const body: CreateRelationshipBody = {
      namespace: data.namespace,
      object: data.object,
      relation: data.relation,
    }
    if (data.subjectType === "id") {
      body.subject_id = data.subject_id
    } else {
      body.subject_set = data.subject_set
    }
    createRelationshipMutation.mutate(
      { createRelationshipBody: body },
      {
        onSuccess: () => {
          closeDialog()
          toast.success("Relationship created successfully")
          form.reset()
        },
        onError: (error) => {
          toast.error("Failed to create relationship: " + error.message)
        },
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={closeDialog}>
      <DialogContent className="sm:max-w-100" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Create Relationship</DialogTitle>
          <DialogDescription>
            Add a new relationship to Keto.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" autoComplete="off">
            <FieldGroups
              control={form.control}
              configs={getFields(subjectType || "id")}
              onChange={(name) => {
                if (name === "namespace") {
                  form.setValue("relation", "")
                }
                if (name === "subject_set.namespace") {
                  form.setValue("subject_set.relation", "")
                }
              }}
              values={form.watch()}
            />

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={() => closeDialog()}>
                Cancel
              </Button>
              <Button type="submit" disabled={createRelationshipMutation.isPending}>
                {createRelationshipMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  )
}
