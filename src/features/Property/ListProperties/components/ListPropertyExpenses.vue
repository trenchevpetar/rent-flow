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
            v-for="expense in data.expenses"
            :key="expense.$id"
          >
            <TheSkeletonCircleContent
              v-if="expense.$id === loadingItemId || categoryLoading"
            />
            <ListPropertyExpensesItem
              v-else
              :expense="expense"
              :category="getCategoryObject(expense.category)"
              @mark="onUpdateExpense"
              @edit="onEditExpense"
              @delete="onDeleteExpense"
            />
          </li>
        </ul>
        <li
          v-if="data.expenses"
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

  <ExpensesChart
    v-if="expenses && expenses.length && !categoryLoading"
    :expenses="expenses"
    :resolved-categories="resolvedCategories"
  />
</template>

<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts';
import { useResolvedCategories } from '@/features/Property/Categories/composables/useResolvedCategories.ts';
import ExpensesChart from '@/features/Property/ListProperties/components/ExpensesChart.vue';
import GroupedPropertyExpenses from '@/features/Property/ListProperties/components/GroupedPropertyExpenses.vue';
import ListPropertyExpensesFooter from '@/features/Property/ListProperties/components/ListPropertyExpensesFooter.vue';
import ListPropertyExpensesHeader from '@/features/Property/ListProperties/components/ListPropertyExpensesHeader.vue';
import ListPropertyExpensesItem from '@/features/Property/ListProperties/components/ListPropertyExpensesItem.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';
import FloatingBar from '@/shared/components/FloatingBar/FloatingBar.vue';
import GroqAnalysis from '@/shared/components/Groq/GroqAnalysis.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';

const route = useRoute();
const { t } = useI18n<{ messages: MessagesSchema }>();
const authStore = useAuthStore();

const shouldAIAnalyse = ref(false);
const activeIndex = ref('0');

const props = defineProps<{
  expenses: Expense[];
  loadingItemId: string | null;
}>();

const emit = defineEmits([
  'on-add-expense',
  'on-update-expense',
  'on-delete-expense',
  'on-edit-expense',
]);

const propertyId = computed(() => route.params.id as string);
const {
  resolvedCategories,
  loading: categoryLoading,
  getCategoryObject,
  resolve,
} = useResolvedCategories(propertyId.value);

const totalAmountPendingPayment = computed(() =>
    props.expenses.reduce((sum, e) => sum + e.amount, 0)
);

const totalAmountUnpaid = computed(() =>
    props.expenses.reduce((sum, e) => (!e.isPaid ? sum + e.amount : sum), 0)
);

const actions = computed(() => [
  authStore.isLoggedIn && { name: 'expense' },
  { name: 'ai' },
].filter(Boolean) as { name: string }[]);

const onUpdateExpense = (expense: Expense) => emit('on-update-expense', expense);
const onDeleteExpense = (id: string) => emit('on-delete-expense', id);
const onEditExpense = (id: string) => emit('on-edit-expense', id);
const onAddExpense = () => emit('on-add-expense');
const onAIAnalysis = () => (shouldAIAnalyse.value = true);

onMounted(() => {
  resolve();
});
</script>
