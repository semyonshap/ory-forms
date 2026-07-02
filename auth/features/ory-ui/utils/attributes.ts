import omit from "lodash/omit"
import { omittedInputKeys } from "../types"

export function omitInputAttributes<T extends object>(
  attrs: T,
): Omit<T, (typeof omittedInputKeys)[number]> {
  return omit(attrs, omittedInputKeys) as Omit<
    T,
    (typeof omittedInputKeys)[number]
  >
}
