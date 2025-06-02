
import { ref } from 'vue'

import type { Expenses } from '@/features/AddProperty/types/expenses.ts';

export function useGroqSummary () {
  const summary = ref('')
  const loading = ref(false)

  async function analyzeExpenses (expenses: Expenses[]) {
    loading.value = true

    const prompt = `
You are an AI assistant helping analyze personal spending. 
This application is for renting and expenses for the rent. 
The current analysis should be displayed for the end user, not the landlord.
Consider that the expenses are for Macedonian market, in MKD currency.
EVN stands for electricity, VODOVOD is for water, URBAN is expense for the apartment,
RENT is rent, ESM is for heating through the winter but the expense is coming for every month.
Before giving an analysis make sure you investigate the market overall on expenses of bills and 
rent expenses.
Given this list of expenses, summarize total amount, unpaid items, flag anything unusual and give
directions or ideas on how to proceed with current spendings:

${JSON.stringify(expenses, null, 2)}
`

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ]
      }),
    })

    const data = await response.json()
    summary.value = data.choices?.[0]?.message?.content || 'No summary.'

    loading.value = false
  }

  return { summary, loading, analyzeExpenses }
}
