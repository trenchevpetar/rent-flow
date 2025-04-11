import { defineStore } from 'pinia';
import { ref } from 'vue';

import type { Property } from '../types/property.ts';

export const usePropertyStore = defineStore('property', () => {
  const properties = ref<Property[]>([])

  function saveProperties (newProperties: Property[]){
    properties.value = newProperties;
  }

  return {
    properties,
    saveProperties
  }
}, {
  persist: true
})
