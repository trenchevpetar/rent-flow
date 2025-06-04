import { ref } from 'vue'
import { useI18n } from 'vue-i18n';

import type { UpdatableExpense } from '@/features/AddProperty/types/expenses.ts';

const chooseLocalePrompt = (expenses: UpdatableExpense) => {
  const { locale } = useI18n()

  if (locale.value === 'mk-MK') {
    return `
      Вие сте вештачка интелигенција што помага при анализа на лични трошоци.
      Оваа апликација е наменета за изнајмување и трошоци поврзани со киријата.
      Тековната анализа треба да биде прикажана за крајниот корисник, а не за сопственикот на имотот.
      Имајте предвид дека трошоците се однесуваат на македонскиот пазар и се изразени во валутата МКД.
      EVN се однесува на струја, VODOVOD е за вода, URBAN е трошок за станот,
      RENT е кирија, а ESM е за греење преку зима, но трошокот се појавува секој месец.
      Пред да дадете анализа, проверете ги општите пазарни цени за сметки и кирија.
      Врз основа на дадената листа на трошоци, сумирајте ја вкупната сума,
      истакнете кои ставки не се платени, означете сè што изгледа невообичаено
      и дадете насоки или идеи за тоа како да се продолжи со тековното трошење.
      
      ${JSON.stringify(expenses, null, 2)}
    `
  }

  return  `
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
}

export function useGroqSummary () {
  const summary = ref('')
  const loading = ref(false)

  async function analyzeExpenses (expenses: UpdatableExpense[]) {
    loading.value = true

    const prompt = chooseLocalePrompt(expenses)

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
