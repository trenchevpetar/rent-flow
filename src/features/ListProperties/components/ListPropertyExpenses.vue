<template>
  <ul class="list relative bg-base-100 rounded-box shadow-md">
    <li class="p-4 text-xs opacity-60 tracking-wide">
      <template v-if="expenses && expenses.length">
        Expenses for this property
      </template>
      <template v-else>
        No expenses for this property
      </template>
    </li>

    <GroupedPropertyExpenses
      v-model:active-index="activeIndex"
      :expenses="expenses"
    >
      <template #default="{ data }">
        <li
          v-for="(expense, _, index) in data.expenses"
          :key="`${loadingItemId}-${expense.$id}`"
          class="list-row"
        >
          <TheSkeletonCircleContent v-if="expense.$id === loadingItemId" />
          <template v-else>
            <div class="text-4xl font-thin opacity-30 tabular-nums">
              {{ index + 1 }}
            </div>
            <div>
              <div
                v-if="expenseCategories[expense.category as keyof typeof expenseCategories]?.imageUrl"
                class="size-12 rounded-box flex items-center justify-center"
              >
                <img
                  :src="expenseCategories[expense.category as keyof typeof expenseCategories].imageUrl"
                  :alt="expenseCategories[expense.category as keyof typeof expenseCategories].label"
                >
              </div>
              <div
                v-else
                class="size-12 rounded-box flex items-center justify-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-8"
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
                  @click="onUpdateExpense(expense)"
                >
                  <MarkAsReadIcon />
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
                  <DeleteIcon />
                </button>
              </div>
            </template>
          </template>
        </li>
        <li class="list-row">
          <div class="text-4xl font-thin opacity-30 tabular-nums">
            Total
          </div>
          <div class="list-col-grow flex items-center">
            {{ data.totalAmount }} MKD
          </div>
        </li>
      </template>
    </GroupedPropertyExpenses>
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import DeleteIcon from '@/assets/icons/DeleteIcon.vue';
import MarkAsReadIcon from '@/assets/icons/MarkAsReadIcon.vue';
import { expenseCategories } from '@/features/AddProperty/constants/expense.category.ts';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import GroupedPropertyExpenses from '@/features/ListProperties/components/GroupedPropertyExpenses.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';

const authStore = useAuthStore();
const activeIndex = ref('0')

defineProps<{
  expenses: Expenses[];
  loadingItemId: string | null;
}>()

const emit = defineEmits(['on-update-expense', 'on-delete-expense'])

const onUpdateExpense = (expense: Expenses) => emit('on-update-expense', expense)
const onDeleteExpense = (id: string) => emit('on-delete-expense', id)
</script>
