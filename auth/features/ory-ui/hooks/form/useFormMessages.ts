import { useMemo } from "react"
import { defaultHiddenMessageIds } from "../../types"
import { useFlowStoreShallow } from "../../context"

export function useMessages(
  hiddenMessageIds: number[] = defaultHiddenMessageIds,
) {
  const {
    flow: { flow },
  } = useFlowStoreShallow((state) => ({
    flow: state.flow,
  }))

  return useMemo(() => {
    return (
      flow.ui.messages?.filter((m) => !hiddenMessageIds.includes(m.id)) ?? []
    )
  }, [flow.ui.messages, hiddenMessageIds])
}
