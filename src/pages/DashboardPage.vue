<template>
  <h1 class="title text-2xl">
    {{ t('dashboard') }}
  </h1>

  <div class="divider" />

  <ListProperties />

  <div class="divider" />

  <ListIncomes />

  <FloatingBar
    :actions="[
      { name: 'property' },
      { name: 'income' }
    ]"
    @property="onAddProperty"
    @income="onAddIncome"
  >
    <template #property>
      {{ t('properties.add') }}
    </template>
    <template #income>
      {{ t('income.add') }}
    </template>
  </FloatingBar>

  <TheModal
    title="Add Property"
    v-model="isModalActive"
  >
    <AddPropertyForm @on-add-property="onPropertyAdded" />
  </TheModal>
  
  <TheModal
    title="Add Income"
    v-model="isIncomeModalActive"
  >
    <AddIncomeForm @on-add-income="onIncomeAdded" />
  </TheModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AddPropertyForm from '@/features/AddProperty/components/AddPropertyForm.vue';
import AddIncomeForm from '@/features/ListIncomes/components/AddIncomeForm.vue';
import ListIncomes from '@/features/ListIncomes/components/ListIncomes.vue';
import ListProperties from '@/features/ListProperties/components/ListProperties.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';
import FloatingBar from '@/shared/components/FloatingBar/FloatingBar.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()

const isModalActive = ref(false)
const isIncomeModalActive = ref(false)

const onAddProperty = () => isModalActive.value = true;
const onPropertyAdded = () => isModalActive.value = false;

const onAddIncome = () => isIncomeModalActive.value = true;
const onIncomeAdded = () => isIncomeModalActive.value = false;
</script>
