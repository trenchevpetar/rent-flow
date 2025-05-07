<template>
  <div
    v-for="(expense, index) in groupedByMonth"
    :key="index"
    class="collapse collapse-arrow bg-base-100"
  >
    <input
      type="checkbox"
      :checked="activeIndex === index"
    >
    <div class="collapse-title font-semibold">
      {{ index }}
    </div>
    <div class="collapse-content text-sm">
      <slot :data="expense" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import { useGroupedExpenses } from '@/features/ListProperties/composables/useGroupedExpenses.ts';

const props = defineProps<{
  expenses: Expenses[];
  activeIndex: string;
}>();

const { groupedByMonth } = useGroupedExpenses(props.expenses)
</script>
