<template>
  <h1 class="title text-2xl">
    {{ cachedPropertyByRouteId?.name }}
  </h1>

  <div class="divider divider-warning" />

  <TheSpinner :is-loading="isGetPending" />

  <ListPropertyExpenses
    v-if="expenses"
    @on-add-expense="onAddExpense"
    @on-update-expense="onUpdateExpense"
    @on-delete-expense="onDeleteExpense"
    @on-edit-expense="onEditExpense"
    :loading-item-id="loadingItemId"
    :expenses="expenses"
  />

  <TheModal
    title="Edit expense"
    v-model="isEditModalActive"
  >
    <EditExpenseForm
      v-if="isEditModalActive"
      :expense="editableExpense"
      @on-edit-confirm="onEditConfirm"
    />
  </TheModal>
  
  <TheModal
    :title="t('expenses.add')"
    v-model="isModalActive"
  >
    <AddExpenseToPropertyForm @on-add-expense="onExpenseAdded" />
  </TheModal>
</template>

<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

import AddExpenseToPropertyForm from '@/features/Property/AddProperty/components/AddExpenseToPropertyForm.vue';
import EditExpenseForm from '@/features/Property/AddProperty/components/EditExpenseForm.vue';
import { useCachedProperties } from '@/features/Property/AddProperty/composables/useCachedProperties.ts';
import {
  deleteExpense,
  getExpensesForProperty,
  updateExpenseByExpenseId
} from '@/features/Property/AddProperty/services/expenses.service.ts';
import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts';
import ListPropertyExpenses from '@/features/Property/ListProperties/components/ListPropertyExpenses.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheModal from '@/shared/components/TheModal/TheModal.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const route = useRoute()

const { t } = useI18n<{ messages: MessagesSchema }>()
const isModalActive = ref(false);
const isEditModalActive = ref(false);

const propertyId = computed(() => route.params.id as string)
const queryClient = useQueryClient();
const loadingItemId = ref<string | null>(null)
const { data: cachedProperties } = useCachedProperties('$id', propertyId.value)
const cachedPropertyByRouteId = computed(() => cachedProperties?.value?.filter((property) => property.$id === propertyId.value)[0])
const editableExpense = ref()

const { data: expenses, isPending: isGetPending } = useQuery({
  queryKey: ['expenses', propertyId.value],
  queryFn: () => getExpensesForProperty(propertyId.value),
  enabled: computed(() => !!propertyId.value),
  staleTime: 1000 * 60 * 5
})

const deleteMutation = useMutation({
  mutationFn: async (id: string) => {
    loadingItemId.value = id;
    return await deleteExpense(id)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
  },
  onSettled: () => {
    loadingItemId.value = null;
  }
})

const updateMutation = useMutation({
  mutationFn: async (expense: Expense) => {
    loadingItemId.value = expense.$id;
    return await updateExpenseByExpenseId(expense.$id, expense)
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
  },
  onSettled: () => {
    loadingItemId.value = null;
    isEditModalActive.value = false;
  }
})

const onAddExpense = () => isModalActive.value = true
const onExpenseAdded = () => isModalActive.value = false

const onUpdateExpense = (expense: Expense) => updateMutation.mutate(expense)
const onDeleteExpense = (id: string) => deleteMutation.mutate(id)
const onEditExpense = (id: string) => {
  editableExpense.value = expenses.value?.find((expense: Expense) => expense.$id === id)
  isEditModalActive.value = true;
}

const onEditConfirm = (expense: Expense) => updateMutation.mutate(expense)
</script>
