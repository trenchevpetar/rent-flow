<template>
  <TheGrid>
    <TheColumn :size="6">
      <h1>Dashboard</h1>
    </TheColumn>
    <TheColumn :size="6">
      <button
        @click="onAddProperty"
        class="btn btn-primary"
      >
        Add property
      </button>
    </TheColumn>
  </TheGrid>

  <PropertyCards />

  <TheModal
    title="Add Property"
    v-model="isModalActive"
  >
    <AddPropertyForm />
  </TheModal>
</template>

<script lang="ts" setup>
import TheGrid from '../layouts/Grid/TheGrid.vue';
import TheColumn from '../layouts/Grid/TheColumn.vue';
import PropertyCards from '../features/AddProperty/components/PropertyCards.vue';

import AddPropertyForm from '../features/AddProperty/components/AddPropertyForm.vue';

import TheModal from '../shared/components/TheModal/TheModal.vue';
import { ref } from 'vue';

const isModalActive = ref(false)
const onAddProperty = () => isModalActive.value = true;
</script>
