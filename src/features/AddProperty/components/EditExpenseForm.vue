<template>
  <form
    @submit.prevent="onEditExpense"
    class="flex justify-center align-center items-center"
  >
    <fieldset class="fieldset w-full">
      <InputSelect
        v-model="formValues.category"
        :items="expenseTypes"
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
import { computed, ref } from 'vue';

import { expenseCategoriesForSelect } from '@/features/AddProperty/constants/expense.category.ts';
import type { Expense, UpdatableExpense } from '@/features/AddProperty/types/expense.types.ts';
import InputDate from '@/shared/components/InputDate/InputDate.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import InputSelect from '@/shared/components/InputSelect/InputSelect.vue';
import InputTextarea from '@/shared/components/InputTextarea/InputTextarea.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const props = defineProps<{
  expense: Expense;
}>();

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
const expenseTypes = computed(() => expenseCategoriesForSelect())

const onEditExpense = () => emit('on-edit-confirm', {
  ...props.expense,
  ...formValues.value
})
</script>
