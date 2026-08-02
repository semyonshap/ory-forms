'use client'

import { FormProvider } from 'react-hook-form'
import { I18nextProvider } from 'react-i18next'

import libraryI18n from '../i18n'
import { useOryForm } from '../hooks'
import { FormWrapper } from './wrappers'
import { FlowInputProps } from '../types'
import { OryFlowProvider } from '../context'

export function Flow(props: FlowInputProps) {
  return (
    <I18nextProvider i18n={libraryI18n}>
      <OryFlowProvider {...props}>
        <FormRHF />
      </OryFlowProvider>
    </I18nextProvider>
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
