import i18n from "i18next"
import { initReactI18next } from "react-i18next"
import enCommon from "./resources/en.json"

const libraryI18n = i18n.createInstance()

libraryI18n.use(initReactI18next).init({
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      common: enCommon,
    },
  },
  defaultNS: "common",
  interpolation: {
    escapeValue: false,
  },
})

export default libraryI18n

export { uiTextToFormattedMessage } from "./utils"
export {
  resolveLabel,
  resolvePlaceholder,
  resolveOptionLabel,
} from "./resolver"
