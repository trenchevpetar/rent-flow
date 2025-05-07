<template>
  <TheGrid>
    <TheColumn :size="6">
      <h1 class="title text-2xl">
        Property details
      </h1>
    </TheColumn>
    <TheColumn :size="6">
      <button
        v-if="authStore.isLoggedIn"
        class="btn btn-primary"
        @click="onAddExpense"
      >
        Add Expense for this property
      </button>
    </TheColumn>
  </TheGrid>

  <div class="divider divider-warning" />

  <ListPropertyExpenses />

  <TheModal
    title="Add expense to property"
    v-model="isModalActive"
  >
    <AddExpenseToPropertyForm @on-add-expense="onExpenseAdded" />
  </TheModal>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

import AddExpenseToPropertyForm from '@/features/AddProperty/components/AddExpenseToPropertyForm.vue';
import ListPropertyExpenses from '@/features/ListProperties/components/ListPropertyExpenses.vue';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';


const authStore = useAuthStore();

const isModalActive = ref(false);
const onAddExpense = () => isModalActive.value = true
const onExpenseAdded = () => isModalActive.value = false
</script>
