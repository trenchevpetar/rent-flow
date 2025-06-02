<template>
  <form
    @submit.prevent="onAddIncome"
    class="flex justify-center align-center items-center"
  >
    <fieldset class="fieldset w-full">
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

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Add income
        </button>
      </div>
    </fieldset>
  </form>
  <TheSpinner :is-loading="isPending" />
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

import { addIncome } from '@/features/ListIncomes/services/incomes.service.ts';
import type { Incomes } from '@/features/ListIncomes/types/incomes.types.ts';
import InputDate from '@/shared/components/InputDate/InputDate.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const queryClient = useQueryClient();

const emit = defineEmits(['on-add-income'])
const formValues = ref<Incomes>({
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
</script>
