<template>
  <ul class="list relative bg-base-100 rounded-box shadow-md">
    <li class="p-4 text-xs opacity-60 tracking-wide">
      <template v-if="expenses && expenses.length">
        {{ t('expenses.property') }}
      </template>
      <template v-else>
        {{ t('expenses.none') }}
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
                <DefaultExpenseIcon />
              </div>
            </div>
            <div class="list-col-grow">
              <div>{{ expense.category }}</div>
              <div>{{ expense.amount }} MKD</div>
              <div class="text-xs uppercase font-semibold opacity-60">
                <template v-if="expense.isPaid">
                  <div class="status status-success animate-bounce" /> {{ t('payment.paid') }}
                </template>
                <template v-else>
                  <div class="status status-error animate-bounce" /> {{ t('payment.pending') }}
                </template>
              </div>
            </div>

            <template v-if="authStore.isLoggedIn">
              <div
                v-if="!expense.isPaid"
                class="tooltip tooltip-success"
                :data-tip="t('actions.markAsPaid')"
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
                :data-tip="t('actions.delete')"
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
            {{ t('payment.total') }}
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
import { useI18n } from 'vue-i18n';

import DefaultExpenseIcon from '@/assets/icons/DefaultExpenseIcon.vue';
import DeleteIcon from '@/assets/icons/DeleteIcon.vue';
import MarkAsReadIcon from '@/assets/icons/MarkAsReadIcon.vue';
import { expenseCategories } from '@/features/AddProperty/constants/expense.category.ts';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import GroupedPropertyExpenses from '@/features/ListProperties/components/GroupedPropertyExpenses.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';

const authStore = useAuthStore();
const activeIndex = ref('0')
const { t } = useI18n<{ messages: MessagesSchema }>()

defineProps<{
  expenses: Expenses[];
  loadingItemId: string | null;
}>()

const emit = defineEmits(['on-update-expense', 'on-delete-expense'])

const onUpdateExpense = (expense: Expenses) => emit('on-update-expense', expense)
const onDeleteExpense = (id: string) => emit('on-delete-expense', id)
</script>
