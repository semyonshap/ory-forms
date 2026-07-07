import { useTranslation } from "react-i18next"
import { useFormContext } from "react-hook-form"

import { Builder } from "../../lib"
import { renderNodes } from "../render"
import { useFormSubmit } from "../../hooks"
import { useFlowStoreShallow } from "../../context"

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

  const { t } = useTranslation()
  const { flow } = flowContainer

  const nodes = Builder({
    config,
    flowContainer,
    formState,
    t,
    dispatchFormState,
    nodeSorter,
    groupSorter,
  })

  const methods = useFormContext()
  const onSubmit = useFormSubmit(methods)

  const result = renderNodes(nodes)

  return (
    <form
      action={flow.ui.action}
      method={flow.ui.method}
      onSubmit={methods.handleSubmit(onSubmit, console.error)}
    >
      {Card.Form ? <Card.Form>{result}</Card.Form> : result}
    </form>
  )
}
