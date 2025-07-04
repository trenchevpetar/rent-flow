<template>
  <BasicForm
    submit-label="Add property"
    cancel-label="Cancel"
    @on-submit="onAddProperty"
    @on-cancel="onCancel"
  >
    <InputField
      v-model="formValues.name"
      label="Name"
      placeholder="Name"
    />

    <InputField
      v-model="formValues.location"
      label="Street name"
      placeholder="Location"
    />

    <InputField
      v-model="formValues.units"
      type="number"
      label="Units (How many units this property have?)"
      placeholder="How many units this property have?"
    />
  </BasicForm>
  <TheSpinner :is-loading="isPending" />
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

import { addProperty } from '@/features/Property/AddProperty/services/property.service.ts';
import type { Property } from '@/features/Property/AddProperty/types/property.types.ts';
import BasicForm from '@/shared/components/BasicForm/BasicForm.vue';
import InputField from '@/shared/components/InputField/InputField.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const queryClient = useQueryClient();

const emit = defineEmits(['on-add-property', 'on-cancel'])
const formValues = ref<Property>({
  name: '',
  location: '',
  ownerId: '',
  units: 0
})

const { mutate: addPropertyMutated, isPending } = useMutation({
  mutationFn: addProperty,
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['ownerId' ] })
  }
})

const onAddProperty = () => {
  addPropertyMutated(formValues.value)
  emit('on-add-property')
}

const onCancel = () => emit('on-cancel')
</script>
