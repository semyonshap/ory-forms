import {
  FlowFormProvider,
  FlowMethod,
  FlowType,
  FlowValues,
} from "../../context/form-provider"
import { OryClientConfiguration } from "../../utils/oryConfiguration"
import { FlowCard } from "./flowContent"

export type Props<T extends FlowValues> = {
  config?: OryClientConfiguration
  flow?: FlowType
  only?: FlowMethod
  hideGlobalMessages?: boolean
}

export function Flow<T extends FlowValues>({ flow, only }: Props<T>) {
  return (
    <FlowFormProvider flow={flow} only={only}>
      <FlowCard />
    </FlowFormProvider>
  )
}
