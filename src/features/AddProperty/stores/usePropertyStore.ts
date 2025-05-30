import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import type { Property } from '@/features/AddProperty/types/property.ts';

export const usePropertyStore = defineStore('property', () => {
  const properties = ref<Property[]>([])
  const expenses = ref<Expenses[]>([])

  function saveProperties (newProperties: Property[]){
    properties.value = newProperties;
  }

  function addExpensesToProperty (newExpenses: Expenses[]) {
    expenses.value = newExpenses;
  }

  return {
    properties,
    expenses,
    saveProperties,
    addExpensesToProperty
  }
}, {
  persist: true
})
