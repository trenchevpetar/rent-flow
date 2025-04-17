import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Property } from '../types/property.ts';
import type { Expenses } from '../types/expenses.ts';

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
