import { ref } from 'vue'
import { useI18n } from 'vue-i18n'

import type { UpdatableExpense } from '@/features/AddProperty/types/expenses.ts'

export function useGroqSummary () {
  const summary = ref('')
  const loading = ref(false)
  const error = ref('')
  const { locale } = useI18n()

  async function analyzeExpenses (expenses: UpdatableExpense[]) {
    loading.value = true
    error.value = ''
    summary.value = ''

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          expenses,
          locale: locale.value
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      summary.value = data.summary || 'No summary available.'
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
      console.error('Error analyzing expenses:', errorMessage)
      error.value = errorMessage
      summary.value = 'Failed to analyze expenses. Please try again.'
    } finally {
      loading.value = false
    }
  }

  return {
    summary,
    loading,
    error,
    analyzeExpenses
  }
}