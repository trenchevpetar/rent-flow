<template>
  <h1 class="title text-2xl mb-4">
    {{ t('dashboard') }}
  </h1>

  <ListProperties />
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
    :title="t('properties.add')"
    v-model="isPropertyModalActive"
  >
    <AddPropertyForm
      @on-cancel="onCancelProperty"
      @on-add-property="onPropertyAdded"
    />
  </TheModal>

  <TheModal
    :title="t('income.add')"
    v-model="isIncomeModalActive"
  >
    <AddIncomeForm
      @on-cancel="onCancelIncome"
      @on-add-income="onIncomeAdded"
    />
  </TheModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import AddIncomeForm from '@/features/Income/ListIncomes/components/AddIncomeForm.vue';
import ListIncomes from '@/features/Income/ListIncomes/components/ListIncomes.vue';
import AddPropertyForm from '@/features/Property/AddProperty/components/AddPropertyForm.vue';
import ListProperties from '@/features/Property/ListProperties/components/ListProperties.vue';
import type { MessagesSchema } from '@/i18n/messages.ts';
import FloatingBar from '@/shared/components/FloatingBar/FloatingBar.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()

const isPropertyModalActive = ref(false)
const isIncomeModalActive = ref(false)

const onAddProperty = () => isPropertyModalActive.value = true;
const onPropertyAdded = () => isPropertyModalActive.value = false;
const onCancelProperty = () => isPropertyModalActive.value = false;

const onAddIncome = () => isIncomeModalActive.value = true;
const onIncomeAdded = () => isIncomeModalActive.value = false;
const onCancelIncome = () => isIncomeModalActive.value = false;
</script>
