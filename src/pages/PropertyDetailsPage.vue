<template>
  <TheGrid class="gap-4">
    <TheColumn
      :size="12"
      :responsive="{ lg: 6 }"
      class="content-center"
    >
      <h1 class="title text-2xl">
        {{ cachedPropertyByRouteId?.name }}
      </h1>
    </TheColumn>
    <TheColumn
      :size="12"
      :responsive="{ lg: 6 }"
      class="text-right"
    >
      <button
        v-if="authStore.isLoggedIn"
        class="btn btn-primary"
        @click="onAddExpense"
      >
        {{ t('expenses.add') }}
      </button>
    </TheColumn>
  </TheGrid>

  <div class="divider divider-warning" />

  <TheSpinner :is-loading="isGetPending" />

  <ListPropertyExpenses
    v-if="expenses"
    @on-update-expense="onUpdateExpense"
    @on-delete-expense="onDeleteExpense"
    :loading-item-id="loadingItemId"
    :expenses="expenses"
  />

  <TheModal
    title="Add expense to property"
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

import AddExpenseToPropertyForm from '@/features/AddProperty/components/AddExpenseToPropertyForm.vue';
import { useCachedProperties } from '@/features/AddProperty/composables/useCachedProperties.ts';
import {
  deleteExpense,
  getExpensesForProperty,
  updateExpenseByExpenseId
} from '@/features/AddProperty/services/expenses.service.ts';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import ListPropertyExpenses from '@/features/ListProperties/components/ListPropertyExpenses.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const authStore = useAuthStore();
const route = useRoute()

const { t } = useI18n<{ messages: MessagesSchema }>()
const isModalActive = ref(false);

const propertyId = computed(() => route.params.id as string)
const queryClient = useQueryClient();
const loadingItemId = ref<string | null>(null)
const { data: cachedProperties } = useCachedProperties('$id', propertyId.value)
const cachedPropertyByRouteId = computed(() => cachedProperties?.value?.filter((property) => property.$id === propertyId.value)[0])

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
  mutationFn: async (expense: Expenses) => {
    loadingItemId.value = expense.$id;
    return await updateExpenseByExpenseId(expense.$id, {
      ...expense,
      isPaid: true
    })
  },
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses'] })
  },
  onSettled: () => {
    loadingItemId.value = null;
  }
})

const onAddExpense = () => isModalActive.value = true
const onExpenseAdded = () => isModalActive.value = false

const onUpdateExpense = (expense: Expenses) => updateMutation.mutate(expense)
const onDeleteExpense = (id: string) => deleteMutation.mutate(id)
</script>
