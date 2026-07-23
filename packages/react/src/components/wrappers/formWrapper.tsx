import { useTranslation } from "react-i18next"
import { useForm, useFormContext } from "react-hook-form"

import { Builder } from "../../lib"
import { renderNodes } from "../render"
import { useFormSubmit } from "../../hooks"
import { useFlowStoreShallow } from "../../context"
import { useMemo } from "react"
import React from "react"

export function FormWrapper() {
  const {
    config,
    flowContainer,
    formState,
    Card,
    dispatchFormState,
    nodeSorter,
    groupSorter,
  } = useFlowStoreShallow((state) => ({
    config: state.config,
    flowContainer: state.flowContainer,
    formState: state.formState,
    Card: state.components.Card,
    dispatchFormState: state.dispatchFormState,
    nodeSorter: state.components.nodeSorter,
    groupSorter: state.components.groupSorter,
  }))

  const { setValue, getValues } = useForm()

  const { t } = useTranslation()
  const { flow } = flowContainer

  const nodes = useMemo(() => {
    return Builder({
      config,
      flowContainer,
      formState,
      t,
      getValues,
      setValue,
      dispatchFormState,
      nodeSorter,
      groupSorter,
    })
  }, [formState, flowContainer, dispatchFormState])

  const methods = useFormContext()
  const onSubmit = useFormSubmit(methods)

  const result = renderNodes(nodes)

  const Component = Card.Form ?? React.Fragment

  return (
    <Component>
      {result.map((card) => (
        <form
          key={card.node.group}
          action={flow.ui.action}
          method={flow.ui.method}
          onSubmit={methods.handleSubmit(onSubmit, console.error)}
        >
          {card.element}
        </form>
      ))}
    </Component>
  )
}
