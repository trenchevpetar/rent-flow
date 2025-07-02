<template>
  <form
    @submit.prevent="onAddExpenseToProperty"
    class="flex justify-center align-center items-center"
  >
    <TheSpinner :is-loading="isPending" />
    <fieldset class="fieldset w-full">
      <pre>
        {{ categories }}
      </pre>

      <InputSelect
        v-model="formValues.category"
        :items="formattedCategories"
        default-value="Expense type"
        label="Expense categories"
      />

      <InputField
        v-model="formValues.amount"
        label="Amount"
        placeholder="Amount"
        type="number"
      />

      <InputTextarea
        v-model="formValues.description"
        label="Description"
      />

      <InputDate
        v-model="formValues.date"
        label="Date opened"
        type="month"
      />

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Add expense
        </button>
        <button
          type="button"
          class="btn btn-soft"
        >
          Cancel
        </button>
      </div>
    </fieldset>
  </form>
  <TheSpinner :is-loading="isLoading" />
</template>

<script lang="ts" setup>
import { useMutation, useQuery, useQueryClient } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { expenseCategoriesForSelect } from '@/features/Property/AddProperty/constants/expense.category.ts';
import { addExpenseToProperty } from '@/features/Property/AddProperty/services/expenses.service.ts';
import type { UpdatableExpense } from '@/features/Property/AddProperty/types/expense.types.ts';
import { refetchCategories, resolveCategoryLabels } from '@/features/Property/Categories/services/category.service.ts';
import type { Category } from '@/features/Property/Categories/types/category.type.ts';
import InputDate from '@/shared/components/InputDate/InputDate.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import InputSelect from '@/shared/components/InputSelect/InputSelect.vue';
import InputTextarea from '@/shared/components/InputTextarea/InputTextarea.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const emit = defineEmits(['on-add-expense'])
const authStore = useAuthStore()
const route = useRoute()
const queryClient = useQueryClient();
const formValues = ref<UpdatableExpense>({
  propertyId: '',
  category: 'Expense type',
  amount: 0,
  description: '',
  date: new Date(),
  isPaid: false
})
const isLoading = ref(false);
const expenses = computed(() => expenseCategoriesForSelect())
const propertyId = computed(() => route.params.id as string)
const userId = computed(() => authStore.currentUser?.$id || '')
const categories = ref()
const formattedCategories = ref()

const { mutate: addExpense, isPending } = useMutation({
  mutationFn: addExpenseToProperty,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses' ] })
    emit('on-add-expense')
  }
})

const propertyCategoriesQuery = useQuery({
  queryKey: ['property-categories', propertyId.value],
  queryFn: () => refetchCategories(propertyId.value),
  enabled: computed(() => !!propertyId.value),
  staleTime: 60 * 1000, // 1 min stale
  retry: 3
})

watch(
  () => propertyCategoriesQuery.data.value?.categoryIds,
  async (newCategoryIds) => {
    if (newCategoryIds) {
      categories.value = await resolveCategoryLabels(userId.value, newCategoryIds)
      formattedCategories.value = categories.value.map((category: Category) => ({
        value: category.id,
        label: category.label
      }))
    }
  }
)

const onAddExpenseToProperty = async () => {
  addExpense({
    ...formValues.value,
    propertyId: propertyId.value
  })
}
</script>
