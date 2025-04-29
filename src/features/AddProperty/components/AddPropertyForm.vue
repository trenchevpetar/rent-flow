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

      <!-- should list landlords here -->
      <!--      <InputField-->
      <!--        v-model="formValues.name"-->
      <!--        label="Name"-->
      <!--        placeholder="Name"-->
      <!--      />-->

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
  <TheSpinner :is-loading="isLoading" />
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import InputField from '../../../shared/components/InputField/InputField.vue';
import TheSpinner from '../../../shared/components/TheSpinner/TheSpinner.vue';

import type { Property } from '../types/property.ts';

import { useAuthStore } from '../../Login/stores/useAuthStore.ts';

import { addProperty, getPropertiesByOwnerId } from '../services/property.service.ts';
import { usePropertyStore } from '../stores/usePropertyStore.ts';

const authStore = useAuthStore()
const propertyStore = usePropertyStore()
const formValues = ref<Property>({
  name: '',
  location: '',
  ownerId: '',
  units: 0
})
const isLoading = ref(false);

const onAddProperty = async () => {
  await addProperty({
    ...formValues.value,
    ...(authStore.currentUser?.$id ? { ownerId: authStore.currentUser.$id } : {})
  });

  const properties = await getPropertiesByOwnerId()
  propertyStore.saveProperties(properties);
}
</script>
