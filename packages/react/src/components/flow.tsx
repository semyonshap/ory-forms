'use client'

import { I18nextProvider } from 'react-i18next'
import { FormProvider } from 'react-hook-form'

import libraryI18n from '../i18n'
import { useOryForm } from '../hooks'
import { FlowInputProps } from '../types'
import { OryFlowProvider } from '../context'

import { FormWrapper } from './wrappers'

export function Flow({
  flow,
  config,
  components,
  transientPayload,
}: FlowInputProps) {
  const { methods } = useOryForm(flow)

  return (
    <I18nextProvider i18n={libraryI18n}>
      <OryFlowProvider
        config={config}
        flow={flow}
        components={components}
        transientPayload={transientPayload}
      >
        <FormProvider {...methods}>
          <FormWrapper />
        </FormProvider>
      </OryFlowProvider>
    </I18nextProvider>
  )
}
