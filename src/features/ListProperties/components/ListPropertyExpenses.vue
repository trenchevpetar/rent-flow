<template>
  <ul class="list relative bg-base-100 rounded-box shadow-md">
    <li class="p-4 text-xs tracking-wide text-warning">
      <template v-if="expenses && expenses.length">
        {{ t('expenses.property') }}
      </template>
      <template v-else>
        {{ t('expenses.none') }}
      </template>
    </li>

    <TheGrid>
      <TheColumn
        :size="12"
        :responsive="{ sm: 12, md: 6, lg: 6 }"
      >
        <TheStat
          v-if="totalAmountPendingPayment"
          :title="t('totalPending')"
          :value="totalAmountPendingPayment"
        />
      </TheColumn>
      
      <TheColumn
        :size="12"
        :responsive="{ sm: 12, md: 6, lg: 6 }"
      >
        <TheStat
          v-if="totalAmountUnpaid"
          :title="t('totalUnpaid')"
          :value="totalAmountUnpaid"
        />
      </TheColumn>
    </TheGrid>

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
              :class="paidStyles(expense.isPaid)"
            >
              <template #description>
                <div class="flex items-center gap-1 text-sm">
                  <DollarIcon />
                  <span v-if="expense.isPaid">{{ t('payment.paid') }}</span>
                  <span v-else>{{ t('payment.pending') }}</span>
                </div>
              </template>
              <template #image>
                <img
                  v-if="expenseCategories[expense.category as keyof typeof expenseCategories]?.imageUrl"
                  :src="expenseCategories[expense.category as keyof typeof expenseCategories].imageUrl"
                  :alt="expenseCategories[expense.category as keyof typeof expenseCategories].label"
                >
                <HomeIcon v-else />
              </template>
              <template #actions>
                <div
                  v-if="authStore.isLoggedIn"
                  class="join"
                >
                  <button
                    v-if="!expense.isPaid"
                    class="btn btn-success btn-xs join-item"
                    @click="onUpdateExpense({
                      ...expense,
                      isPaid: true
                    })"
                  >
                    {{ t('actions.markAsPaid') }}
                  </button>
                  <button
                    v-else
                    class="btn btn-warning btn-xs join-item"
                    @click="onUpdateExpense({
                      ...expense,
                      isPaid: false
                    })"
                  >
                    {{ t('actions.markAsUnpaid') }}
                  </button>
                  <button
                    class="btn btn-info btn-xs join-item"
                    @click="onEditExpense(expense.$id)"
                  >
                    {{ t('actions.edit') }}
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
        <li
          v-if="Object.keys(data.expenses).length > 1"
          class="mt-10 border border-white rounded-lg"
        >
          <TheGrid>
            <TheColumn
              :size="12"
              :responsive="{ sm: 12, md: 6, lg: 6 }"
            >
              <TheStat
                :title="t('payment.total')"
                :value="data.totalAmount"
              />
            </TheColumn>

            <TheColumn
              :size="12"
              :responsive="{ sm: 12, md: 6, lg: 6 }"
            >
              <TheStat
                :title="t('payment.unpaid')"
                :value="data.totalUnpaid"
              />
            </TheColumn>
          </TheGrid>
        </li>
      </template>
    </GroupedPropertyExpenses>
  </ul>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useI18n } from 'vue-i18n';

import DollarIcon from '@/assets/icons/DollarIcon.vue';
import HomeIcon from '@/assets/icons/HomeIcon.vue';
import { expenseCategories } from '@/features/AddProperty/constants/expense.category.ts';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import GroupedPropertyExpenses from '@/features/ListProperties/components/GroupedPropertyExpenses.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';

const authStore = useAuthStore();
const activeIndex = ref('0')
const { t } = useI18n<{ messages: MessagesSchema }>()

const props = defineProps<{
  expenses: Expenses[];
  loadingItemId: string | null;
}>()

const emit = defineEmits(['on-update-expense', 'on-delete-expense', 'on-edit-expense'])

const totalAmountPendingPayment = computed(() =>
    props.expenses.reduce((sum, expense) => sum + expense.amount, 0)
)

const totalAmountUnpaid = computed(() =>
    props.expenses.reduce(
        (sum, expense) => !expense.isPaid ? sum + expense.amount : sum,
        0
    )
)

const onUpdateExpense = (expense: Expenses) => emit('on-update-expense', {
  ...expense,
})
const onDeleteExpense = (id: string) => emit('on-delete-expense', id)
const onEditExpense = (id: string) => emit('on-edit-expense', id)

const paidStyles = (isPaid: boolean) => {
  if (isPaid) return 'border-l-[10px] border-l-success mt-4'
  return 'border-l-[10px] border-l-warning mt-4'
}
</script>
