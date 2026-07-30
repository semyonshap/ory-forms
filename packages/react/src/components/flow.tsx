'use client'

import { FormProvider } from 'react-hook-form'
import { I18nextProvider } from 'react-i18next'

import libraryI18n from '../i18n'
import { useOryForm } from '../hooks'
import { FormWrapper } from './wrappers'
import { FlowInputProps } from '../types'
import { OryFlowProvider } from '../context'

export function Flow({
  flow,
  config,
  components,
  transientPayload,
  extraNodes,
  onSuccess,
  onValidationError,
  onError,
  onRedirect,
}: FlowInputProps) {
  const { methods } = useOryForm(flow)

  return (
    <I18nextProvider i18n={libraryI18n}>
      <OryFlowProvider
        config={config}
        flow={flow}
        components={components}
        transientPayload={transientPayload}
        extraNodes={extraNodes}
        onSuccess={onSuccess}
        onValidationError={onValidationError}
        onError={onError}
        onRedirect={onRedirect}
      >
        <FormProvider {...methods}>
          <FormWrapper />
        </FormProvider>
      </OryFlowProvider>
    </I18nextProvider>
  )
}
