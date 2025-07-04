<template>
  <BasicForm
    submit-label="Add Income"
    cancel-label="Cancel"
    @on-submit="onAddIncome"
    @on-cancel="onCancel"
  >
    <InputField
      v-model="formValues.type"
      label="Type"
      placeholder="Type of income"
    />

    <InputField
      v-model="formValues.amount"
      label="Amount"
      placeholder="Amount"
      type="number"
    />

    <InputDate
      label="Date paid"
      v-model="formValues.datePaid"
      type="month"
    />
  </BasicForm>
  <TheSpinner :is-loading="isPending" />
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

import { addIncome } from '@/features/Income/ListIncomes/services/incomes.service.ts';
import type { UpdatableIncome } from '@/features/Income/ListIncomes/types/income.type.ts';
import BasicForm from '@/shared/components/BasicForm/BasicForm.vue';
import InputDate from '@/shared/components/InputDate/InputDate.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const queryClient = useQueryClient();

const emit = defineEmits(['on-add-income', 'on-cancel'])
const formValues = ref<UpdatableIncome>({
  propertyId: '',
  type: '',
  amount: 0,
  datePaid: ''
})

const { mutate: addIncomeMutation, isPending } = useMutation({
  mutationFn: addIncome,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['incomes' ] })
  }
})

const onAddIncome = () => {
  addIncomeMutation(formValues.value)
  emit('on-add-income')
}
const onCancel = () => emit('on-cancel')
</script>
