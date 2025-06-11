<template>
  <form
    @submit.prevent="onAddProperty"
    class="flex justify-center align-center items-center"
  >
    <fieldset class="fieldset w-full">
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

      <div class="flex w-full justify-end gap-2 mt-2">
        <button
          type="submit"
          class="btn btn-primary"
        >
          Add property
        </button>
        <button
          class="btn btn-soft"
        >
          Cancel
        </button>
      </div>
    </fieldset>
  </form>
  <TheSpinner :is-loading="isPending" />
</template>

<script lang="ts" setup>
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import { ref } from 'vue';

import { addProperty } from '@/features/Property/AddProperty/services/property.service.ts';
import type { Property } from '@/features/Property/AddProperty/types/property.types.ts';
import InputField from '@/shared/components/InputField/InputField.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const queryClient = useQueryClient();

const emit = defineEmits(['on-add-property'])
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
</script>
