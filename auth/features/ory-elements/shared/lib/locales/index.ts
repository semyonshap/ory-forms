// Copyright © 2023 Ory Corp
// SPDX-License-Identifier: Apache-2.0

import { default as en } from "./en.json"
import { default as ru } from "./ru.json"

// export type TranslationFile = {
//   [K in keyof typeof en]: string
// }

// TODO: we can probably provide typesafety here, since we know all keys.
// However, tsup dts doesn't seem to generate proper dts files if we reference a JSON imported file in the type here.
// A potential workaround is to have some code generation tool, that runs after the message extraction and produces a dts file containing all known keys.
export type LocaleMap = Record<string, Record<string, string>>

export const OryLocales: LocaleMap = Object.freeze({
	en,
	ru,
})
