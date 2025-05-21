import { useQueryClient } from '@tanstack/vue-query'

type FeatureFlag = {
  key: string
  enabled: boolean
}

export function useFeatureFlags () {
  const queryClient = useQueryClient()

  const getAllFlags = (): FeatureFlag[] => {
    return queryClient.getQueryData(['featureFlags']) as FeatureFlag[] || []
  }

  const isFeatureEnabled = (flagKey: string): boolean => {
    const flags = getAllFlags()
    return flags.some(flag => flag.key === flagKey && flag.enabled)
  }

  return {
    getAllFlags,
    isFeatureEnabled,
  }
}
