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

    <ListPropertyExpensesHeader
      :total-amount-pending-payment="totalAmountPendingPayment"
      :total-amount-unpaid="totalAmountUnpaid"
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
            <TheSkeletonCircleContent v-if="expense.$id === loadingItemId || categoryLoading" />
            <TheStat
              v-else-if="categoryObjectByLabel(expense.category)"
              :title="categoryObjectByLabel(expense.category).label"
              :value="expense.amount"
              :class="paidStyles(expense.isPaid)"
            >
              <template #title>
                <div
                  class="badge"
                  :class="{ 'badge-warning' : !categoryObjectByLabel(expense.category).color }"
                  :style="{ 'color': categoryObjectByLabel(expense.category).color }"
                >
                  {{ categoryObjectByLabel(expense.category).label }}
                </div>
              </template>
              <template #description>
                <div class="flex items-center gap-1 text-sm">
                  <DollarIcon />
                  <span v-if="expense.isPaid">
                    {{ t('payment.paidOn', { date: useFormattedDate(expense.$updatedAt) }) }}
                  </span>
                  <span v-else>{{ t('payment.pending') }}</span>
                </div>
              </template>
              <template #image>
                <TheIcon
                  v-if="categoryObjectByLabel(expense.category)"
                  :icon-name="categoryObjectByLabel(expense.category).icon"
                  size="12"
                />
                <HomeIcon v-else />
              </template>
              <template #actions>
                <ListPropertyExpensesActions
                  v-if="authStore.isLoggedIn"
                  :expense="expense"
                  @on-mark-as-paid="onUpdateExpense({
                    ...expense,
                    isPaid: true
                  })"
                  @on-mark-as-unpaid="onUpdateExpense({
                    ...expense,
                    isPaid: false
                  })"
                  @on-edit="onEditExpense(expense.$id)"
                  @on-delete="onDeleteExpense(expense.$id)"
                />
              </template>
            </TheStat>
          </li>
        </ul>
        <li
          v-if="Object.keys(data.expenses).length > 1"
          class="mt-10 border border-white rounded-lg"
        >
          <ListPropertyExpensesFooter :expense="data" />
        </li>
      </template>
    </GroupedPropertyExpenses>
  </ul>

  <TheModal
    :title="t('ai.check')"
    v-model="shouldAIAnalyse"
  >
    <GroqAnalysis
      v-if="expenses && shouldAIAnalyse"
      :expenses="expenses"
    />
  </TheModal>

  <FloatingBar
    :actions="actions"
    @expense="onAddExpense"
    @ai="onAIAnalysis"
  >
    <template #expense>
      {{ t('expenses.add') }}
    </template>
    <template #ai>
      {{ t('ai.check') }}
    </template>
  </FloatingBar>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import DollarIcon from '@/assets/icons/DollarIcon.vue';
import HomeIcon from '@/assets/icons/HomeIcon.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts';
import {
  refetchCategories,
  resolveCategoriesByIds,
} from '@/features/Property/Categories/services/category.service.ts';
import type { Category } from '@/features/Property/Categories/types/category.type.ts';
import GroupedPropertyExpenses from '@/features/Property/ListProperties/components/GroupedPropertyExpenses.vue';
import ListPropertyExpensesActions from '@/features/Property/ListProperties/components/ListPropertyExpensesActions.vue';
import ListPropertyExpensesFooter from '@/features/Property/ListProperties/components/ListPropertyExpensesFooter.vue';
import ListPropertyExpensesHeader from '@/features/Property/ListProperties/components/ListPropertyExpensesHeader.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';
import FloatingBar from '@/shared/components/FloatingBar/FloatingBar.vue';
import GroqAnalysis from '@/shared/components/Groq/GroqAnalysis.vue';
import TheIcon from '@/shared/components/TheIcon/TheIcon.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';
import { useFormattedDate } from '@/shared/composables/useFormattedDate.ts';

const route = useRoute()
const authStore = useAuthStore();
const activeIndex = ref('0')
const { t } = useI18n<{ messages: MessagesSchema }>()
const shouldAIAnalyse = ref(false)
const allCategories = ref()
const resolvedCategories = ref()

const propertyId = computed(() => route.params.id as string)
const categoryLoading = ref(false)
const categoryObjectByLabel = (id: string) => {
  if (resolvedCategories.value) {
    const resolved = resolvedCategories.value.find((cat: Category) => cat.id === id)
    if (resolved) return resolved;
    return {
      id: 'default',
      label: 'Default',
      isCustom: false,
      icon: 'DocumentIcon'
    }
  }
  return null
}
const actions = computed(() =>
  [
    authStore.isLoggedIn && { name: 'expense' },
    { name: 'ai' }
  ].filter(Boolean) as { name: string }[]
);

const props = defineProps<{
  expenses: Expense[];
  loadingItemId: string | null;
}>()

const emit = defineEmits(['on-add-expense', 'on-update-expense', 'on-delete-expense', 'on-edit-expense'])

const totalAmountPendingPayment = computed(() =>
  props.expenses.reduce((sum, expense) => sum + expense.amount, 0)
)

const totalAmountUnpaid = computed(() =>
  props.expenses.reduce(
      (sum, expense) => !expense.isPaid ? sum + expense.amount : sum,
      0
  )
)

const onUpdateExpense = (expense: Expense) => emit('on-update-expense', expense)
const onDeleteExpense = (id: string) => emit('on-delete-expense', id)
const onEditExpense = (id: string) => emit('on-edit-expense', id)
const onAddExpense = () => emit('on-add-expense')
const onAIAnalysis = () => shouldAIAnalyse.value = true

onMounted(async () => {
  categoryLoading.value = true;
  allCategories.value = await refetchCategories(propertyId.value)
  resolvedCategories.value = await resolveCategoriesByIds(allCategories.value.categoryIds)
  categoryLoading.value = false;
})

const paidStyles = (isPaid: boolean) => {
  if (isPaid) return 'border-l-[10px] border-l-success mt-4'
  return 'border-l-[10px] border-l-warning mt-4'
}
</script>
