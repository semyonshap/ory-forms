import { parseStateFromFlow } from './parseFormState'

import { FormState, FormStateAction, OryFlowContainer } from '../../types'

export function initFormState(flow: OryFlowContainer): FormState {
  return {
    ...parseStateFromFlow(flow),
    isReady: true,
    isSubmitting: false,
    isRedirecting: false,
    selectedMethod: undefined,
    loadingInputs: new Set(),
  }
}

export function updateFormState(state: FormState, action: FormStateAction): FormState {
  switch (action.type) {
    case 'action_flow_update': {
      if (state.selectedMethod) {
        return {
          ...state,
          current: 'method_active',
          method: state.selectedMethod,
          loadingInputs: new Set(),
        }
      }
      return { ...state, ...parseStateFromFlow(action.flow) }
    }
    case 'action_select_method':
      return {
        ...state,
        current: 'method_active',
        method: action.method,
        selectedMethod: action.method,
      }
    case 'action_clear_active_method':
      return { ...state, current: 'select_method', selectedMethod: undefined }
    case 'form_input_loading': {
      const loadingInputs = new Set(state.loadingInputs)
      loadingInputs.add(action.group)
      return { ...state, loadingInputs, isReady: false }
    }
    case 'form_input_ready': {
      const loadingInputs = new Set(state.loadingInputs)
      loadingInputs.delete(action.input)
      return { ...state, loadingInputs, isReady: loadingInputs.size === 0 }
    }
    case 'form_submit_start':
      return { ...state, isSubmitting: true }
    case 'form_submit_end':
      return { ...state, isSubmitting: state.isRedirecting }
    case 'page_redirect':
      return { ...state, isSubmitting: true, isRedirecting: true }
    default:
      return state
  }
}
