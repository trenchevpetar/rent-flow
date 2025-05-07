<template>
  <TheGrid>
    <TheColumn :size="6">
      <h1 class="title text-2xl">
        Dashboard
      </h1>
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

  <div class="divider divider-warning" />

  <ListProperties />

  <TheModal
    title="Add Property"
    v-model="isModalActive"
  >
    <AddPropertyForm @on-add-property="onPropertyAdded" />
  </TheModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AddPropertyForm from '@/features/AddProperty/components/AddPropertyForm.vue';
import ListProperties from '@/features/ListProperties/components/ListProperties.vue';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';


const isModalActive = ref(false)
const onAddProperty = () => isModalActive.value = true;
const onPropertyAdded = () => isModalActive.value = false;
</script>
