<template>
  <TheSpinner :is-loading="isPending" />
  <ul class="list bg-base-100 rounded-box shadow-md">
    <li class="p-4 text-xs opacity-60 tracking-wide">
      <template v-if="expenses && expenses.length">
        Expenses for this property
      </template>
      <template v-else>
        No expenses for this property
      </template>
    </li>

    <li
      v-for="(expense, index) in expenses"
      :key="expense.$id"
      class="list-row"
    >
      <TheSpinner :is-loading="isDeletePending || isUpdatePending" />
      <div class="text-4xl font-thin opacity-30 tabular-nums">
        {{ index + 1 }}
      </div>
      <div>
        <div
          v-if="expenseCategories[expense.category as keyof typeof expenseCategories]?.imageUrl"
          class="size-10 rounded-box flex items-center justify-center"
        >
          <img
            :src="expenseCategories[expense.category as keyof typeof expenseCategories].imageUrl"
          >
        </div>
        <div
          v-else
          class="size-10 rounded-box flex items-center justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="1.5"
            stroke="currentColor"
            class="size-6"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z"
            />
          </svg>
        </div>
      </div>
      <div class="list-col-grow">
        <div>{{ expense.category }}</div>
        <div>{{ expense.amount }} MKD</div>
        <div class="text-xs uppercase font-semibold opacity-60">
          <template v-if="expense.isPaid">
            <div class="status status-success animate-bounce" /> Paid
          </template>
          <template v-else>
            <div class="status status-error animate-bounce" /> Pending payment
          </template>
        </div>
      </div>

      <template v-if="authStore.isLoggedIn">
        <div
          v-if="!expense.isPaid"
          class="tooltip tooltip-success"
          data-tip="Mark as paid"
        >
          <button
            class="btn btn-ghost btn-square"
            @click="onUpdateExpense(expense as Expenses)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z"
              />
            </svg>
          </button>
        </div>
        <div
          class="tooltip tooltip-warning"
          data-tip="Delete"
        >
          <button
            class="btn btn-ghost btn-square"
            @click="onDeleteExpense(expense.$id)"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="currentColor"
              class="size-6"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5m6 4.125 2.25 2.25m0 0 2.25 2.25M12 13.875l2.25-2.25M12 13.875l-2.25 2.25M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z"
              />
            </svg>
          </button>
        </div>
      </template>
    </li>
    <li class="list-row">
      <div class="text-4xl font-thin opacity-30 tabular-nums">
        Total
      </div>
      <div class="list-col-grow flex items-center">
        {{ totalExpenses }} MKD
      </div>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import {
  getExpensesForProperty,
  deleteExpense,
  updateExpenseByExpenseId
} from '../../AddProperty/services/expenses.service.ts';
import TheSpinner from '../../../shared/components/TheSpinner/TheSpinner.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from '../../Login/stores/useAuthStore.ts';

import { expenseCategories } from '../../AddProperty/constants/expense.category.ts';
import type { Expenses } from '../../AddProperty/types/expenses.ts';

const route = useRoute();
const authStore = useAuthStore();

const propertyId = computed(() => route.params.id as string)
const queryClient = useQueryClient();
const { data: expenses, isPending } = useQuery({
  queryKey: ['expenses', propertyId.value],
  queryFn: () => getExpensesForProperty(propertyId.value),
  enabled: computed(() => !!propertyId.value),
  staleTime: 1000 * 60 * 5
})

const { mutate: onDeleteExpense, isPending: isDeletePending } = useMutation({
  mutationFn: deleteExpense,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
  }
})

const { mutate: onUpdateExpense, isPending: isUpdatePending } = useMutation({
  mutationFn: (expense: Expenses) => {
    return updateExpenseByExpenseId(expense.$id as string, {
      ...expense,
      isPaid: true
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
  }
})

const totalExpenses = computed(() => {
  return expenses.value?.reduce((sum, expense) => {
    return sum + (expense.amount || 0)
  }, 0) ?? 0;
})
</script>
