<template>
  <TheSpinner :is-loading="isPending" />
  <ul class="list bg-base-100 rounded-box shadow-md">
    <li class="p-4 text-xs opacity-60 tracking-wide">
      Expenses for this property
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
        <img
          class="size-10 rounded-box"
          :src="expenseCategories[expense.category].imageUrl"
        >
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
</script>
