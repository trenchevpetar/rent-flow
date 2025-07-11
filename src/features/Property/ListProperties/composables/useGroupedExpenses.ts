import { computed, type Ref } from 'vue'

import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts'

interface GroupedExpense {
  totalAmount: number
  totalUnpaid: number
  expenses: Record<string, Expense>
}

export function useGroupedExpenses (expenses: Ref<Expense[]>) {
  const groupedByMonth = computed<Record<string, GroupedExpense>>(() => {
    const raw = expenses.value.reduce((result, expense) => {
      const month = new Date(expense.date).toISOString().slice(0, 7)

      if (!result[month]) {
        result[month] = {
          totalAmount: 0,
          totalUnpaid: 0,
          expenses: {}
        }
      }

      result[month].totalAmount += expense.amount

      if (!expense.isPaid) {
        result[month].totalUnpaid += expense.amount
      }

      if (expense.$id) {
        result[month].expenses[expense.$id] = expense
      }

      return result
    }, {} as Record<string, GroupedExpense>)

    return Object.keys(raw)
      .sort((a, b) => a.localeCompare(b))
      .reduce((acc, key) => {
        acc[key] = raw[key]
        return acc
      }, {} as Record<string, GroupedExpense>)
  })

  return { groupedByMonth }
}
