<template>
  <TheGrid>
    <TheColumn
      :size="12"
      :responsive="{ lg: 6 }"
      class="content-center"
    >
      <h1 class="title text-2xl">
        {{ t('dashboard') }}
      </h1>
    </TheColumn>
    <TheColumn
      :size="12"
      :responsive="{ lg: 6 }"
      class="text-right"
    >
      <button
        @click="onAddProperty"
        class="btn btn-primary"
      >
        {{ t('properties.add') }}
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
import { useI18n } from 'vue-i18n';

import AddPropertyForm from '@/features/AddProperty/components/AddPropertyForm.vue';
import ListProperties from '@/features/ListProperties/components/ListProperties.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()

const isModalActive = ref(false)
const onAddProperty = () => isModalActive.value = true;
const onPropertyAdded = () => isModalActive.value = false;
</script>
