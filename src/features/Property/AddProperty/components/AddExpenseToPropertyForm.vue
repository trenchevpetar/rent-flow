<template>
  <form
    @submit.prevent="onAddExpenseToProperty"
    class="flex justify-center align-center items-center"
  >
    <TheSpinner :is-loading="isPending" />
    <fieldset class="fieldset w-full">
      <InputSelect
        v-model="formValues.category"
        :items="expenses"
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
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';

import { expenseCategoriesForSelect } from '@/features/Property/AddProperty/constants/expense.category.ts';
import { addExpenseToProperty } from '@/features/Property/AddProperty/services/expenses.service.ts';
import type { UpdatableExpense } from '@/features/Property/AddProperty/types/expense.types.ts';
import InputDate from '@/shared/components/InputDate/InputDate.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import InputSelect from '@/shared/components/InputSelect/InputSelect.vue';
import InputTextarea from '@/shared/components/InputTextarea/InputTextarea.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const emit = defineEmits(['on-add-expense'])
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

const { mutate: addExpense, isPending } = useMutation({
  mutationFn: addExpenseToProperty,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['expenses' ] })
    emit('on-add-expense')
  }
})

const onAddExpenseToProperty = async () => {
  addExpense({
    ...formValues.value,
    propertyId: route.params.id.toString()
  })
}
</script>
