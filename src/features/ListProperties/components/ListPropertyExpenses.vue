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

    <TheStat
      :title="t('totalPending')"
      :value="totalAmountPendingPayment"
    />
    
    <GroupedPropertyExpenses
      v-model:active-index="activeIndex"
      :expenses="expenses"
    >
      <template #default="{ data }">
        <ul>
          <li
            v-for="(expense) in data.expenses"
            :key="`${loadingItemId}-${expense.$id}`"
          >
            <TheSkeletonCircleContent v-if="expense.$id === loadingItemId" />
            <TheStat
              v-else
              :title="expense.category"
              :value="expense.amount"
            >
              <template #image>
                <img
                  v-if="expenseCategories[expense.category as keyof typeof expenseCategories]?.imageUrl"
                  :src="expenseCategories[expense.category as keyof typeof expenseCategories].imageUrl"
                  :alt="expenseCategories[expense.category as keyof typeof expenseCategories].label"
                >
                <DefaultExpenseIcon v-else />
              </template>
              <template #actions>
                <div
                  v-if="authStore.isLoggedIn"
                  class="join"
                >
                  <button
                    v-if="!expense.isPaid"
                    class="btn btn-success btn-xs join-item"
                    @click="onUpdateExpense(expense)"
                  >
                    {{ t('actions.markAsPaid') }}
                  </button>
                  <button
                    class="btn btn-error btn-xs join-item"
                    @click="onDeleteExpense(expense.$id)"
                  >
                    {{ t('actions.delete') }}
                  </button>
                </div>
              </template>
            </TheStat>
          </li>
        </ul>
        <li class="mt-10 border border-base-300">
          <TheStat
            :title="t('payment.total')"
            :value="data.totalAmount"
          />
        </li>
      </template>
    </GroupedPropertyExpenses>
  </ul>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import DefaultExpenseIcon from '@/assets/icons/DefaultExpenseIcon.vue';
import { expenseCategories } from '@/features/AddProperty/constants/expense.category.ts';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import GroupedPropertyExpenses from '@/features/ListProperties/components/GroupedPropertyExpenses.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';

const authStore = useAuthStore();
const activeIndex = ref('0')
const { t } = useI18n<{ messages: MessagesSchema }>()

const props = defineProps<{
  expenses: Expenses[];
  loadingItemId: string | null;
}>()

const emit = defineEmits(['on-update-expense', 'on-delete-expense'])

const totalAmountPendingPayment = props.expenses.reduce((sum, expense) => {
  return sum + expense.amount
}, 0)

const onUpdateExpense = (expense: Expenses) => emit('on-update-expense', expense)
const onDeleteExpense = (id: string) => emit('on-delete-expense', id)
</script>
