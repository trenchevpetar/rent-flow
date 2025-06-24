<template>
  <ListProperties
    can-be-selected
    @on-card-select="onCardSelect"
  />

  <TheModal
    v-model="isModalActive"
    :title="`Add Categories for ${selectedProperty.name}`"
  >
    <AddCategoryToPropertyManager
      label="Categories"
      :property-id="selectedProperty.$id || ''"
      :already-saved-category-ids="selectedProperty.categoryIds || []"
    />
  </TheModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import type { UpdatableProperty } from '@/features/Property/AddProperty/types/property.types.ts';
import ListProperties from '@/features/Property/ListProperties/components/ListProperties.vue';
import AddCategoryToPropertyManager
  from '@/features/Settings/Category/AddCategory/components/AddCategoryToPropertyManager.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';

const selectedProperty = ref<UpdatableProperty>({})
const isModalActive = ref(false);

const onCardSelect = (property: UpdatableProperty) => {
  selectedProperty.value = property
  isModalActive.value = true
}
</script>
