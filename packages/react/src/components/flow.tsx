'use client'

import { useContext, type ReactNode } from 'react'
import { FormProvider } from 'react-hook-form'
import { I18nextProvider, I18nContext } from 'react-i18next'

import libraryI18n from '../i18n'
import { FormWrapper } from './wrappers'
import { FlowInputProps, type OryClientConfiguration } from '../types'
import { OryFlowProvider } from '../context'
import { useI18n, useOryForm } from '../hooks'

export function Flow(props: FlowInputProps) {
  return (
    <FormTranslation config={props.config}>
      <OryFlowProvider {...props}>
        <FormRHF />
      </OryFlowProvider>
    </FormTranslation>
  )
}

function FormTranslation({
  config,
  children,
}: {
  config: OryClientConfiguration
  children: ReactNode
}) {
  useI18n(config.project)

  const externalI18n = useContext(I18nContext)?.i18n
  const hasExternal = !!externalI18n && externalI18n !== libraryI18n

  return hasExternal ? (
    children
  ) : (
    <I18nextProvider i18n={libraryI18n}>{children}</I18nextProvider>
  )
}

function FormRHF() {
  const { methods } = useOryForm()

  return (
    <FormProvider {...methods}>
      <FormWrapper />
    </FormProvider>
  )
}
