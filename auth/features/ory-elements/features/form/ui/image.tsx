// Copyright © 2024 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { OryNodeImageProps } from "@/features/ory-elements"
import { omitInputAttributes } from "../../../shared/util/omitAttributes"
import Image from "next/image"

export function DefaultImage({ node }: OryNodeImageProps) {
  return (
    <figure>
      <Image
        src={node.attributes.src as string}
        {...omitInputAttributes(node.attributes)}
        alt={node.meta.label?.text || ""}
      />
    </figure>
  )
}
