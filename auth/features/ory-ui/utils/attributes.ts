import { UiNodeInputAttributes } from "@ory/client-fetch"
import omit from "lodash/omit"
import { omittedInputKeys } from "../types"

export function omitInputAttributes(
  attrs: Partial<Record<keyof UiNodeInputAttributes, unknown>>,
) {
  return omit(attrs, omittedInputKeys)
}
