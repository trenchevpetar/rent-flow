import { computed, type Ref } from 'vue';

import type { Expenses } from '@/features/AddProperty/types/expenses.ts';

interface GroupedExpense {
  totalAmount: number;
  expenses: Record<string, Expenses>
}

export function useGroupedExpenses (expenses: Ref<Expenses[]>) {
  const groupedByMonth = computed<Record<string, GroupedExpense>>(() => {
    return expenses.value.reduce((result, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7)

      if (!result[month]) {
        result[month] = { totalAmount: 0, expenses: {} }
      }

      result[month].totalAmount += expense.amount
      if (expense.$id) {
        result[month].expenses[expense.$id] = expense
      }

      return result
    }, {} as Record<string, GroupedExpense>)
  })

  return { groupedByMonth }
}
