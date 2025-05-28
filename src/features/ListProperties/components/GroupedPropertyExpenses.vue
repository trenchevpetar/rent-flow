<template>
  <div
    v-for="(expense, property, index) in groupedByMonth"
    :key="index"
    class="collapse collapse-arrow bg-base-100"
    :class="{ 'collapse-open': index.toString() === activeIndex }"
  >
    <input
      type="checkbox"
      class="peer"
      :checked="index.toString() === activeIndex"
      @change="onChange(index.toString())"
    >
    <div class="collapse-title font-semibold border-b border-base-300 flex gap-1 items-center">
      <CircleStackIcon /> 
      {{ property }}
    </div>
    <div class="collapse-content text-sm">
      <slot :data="expense" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toRef } from 'vue';

import CircleStackIcon from '@/assets/icons/CircleStackIcon.vue';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import { useGroupedExpenses } from '@/features/ListProperties/composables/useGroupedExpenses.ts';

const activeIndex = defineModel<string>('activeIndex')
const props = defineProps<{
  expenses: Expenses[];
}>();

const onChange = (index: string) => {
  activeIndex.value = activeIndex.value === index ? '' : index
}

const { groupedByMonth } = useGroupedExpenses(toRef(props, 'expenses'))
</script>
