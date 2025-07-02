<template>
  <form
    @submit.prevent="onEditExpense"
    class="flex justify-center align-center items-center"
  >
    <fieldset class="fieldset w-full">
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
          Edit
        </button>
      </div>
    </fieldset>
  </form>
  <TheSpinner :is-loading="isLoading" />
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';
import { computed, ref, watch } from 'vue';
import { useRoute } from 'vue-router';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { Expense, UpdatableExpense } from '@/features/Property/AddProperty/types/expense.types.ts';
import { refetchCategories, resolveCategoryLabels } from '@/features/Property/Categories/services/category.service.ts';
import type { Category } from '@/features/Property/Categories/types/category.type.ts';
import InputDate from '@/shared/components/InputDate/InputDate.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import InputSelect from '@/shared/components/InputSelect/InputSelect.vue';
import InputTextarea from '@/shared/components/InputTextarea/InputTextarea.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const props = defineProps<{
  expense: Expense;
}>();
const authStore = useAuthStore()
const route = useRoute()
const propertyId = computed(() => route.params.id as string)
const userId = computed(() => authStore.currentUser?.$id || '')
const categories = ref()
const formattedCategories = ref()
const emit = defineEmits(['on-edit-confirm'])
const formValues = ref<UpdatableExpense>({
  propertyId: props.expense.propertyId || '',
  category: props.expense.category || '',
  amount: props.expense.amount || 0,
  description: props.expense.description || '',
  date: props.expense.date || '',
  isPaid: props.expense.isPaid || false
})
const isLoading = ref(false);

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
  },
  {
    immediate: true
  }
)

const onEditExpense = () => emit('on-edit-confirm', {
  ...props.expense,
  ...formValues.value
})
</script>
