<template>
  <div class="bg-base-100 p-4 rounded shadow">
    <h2 class="font-semibold mb-2 flex items-center gap-2">
      <AcademicCapIcon />
      AI Spending Summary
    </h2>
    <div
      v-if="loading"
      class="text-gray-500"
    >
      Analyzing your expenses…
    </div>
    <MarkdownViewer
      v-else
      :markdown="summary"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'

import AcademicCapIcon from '@/assets/icons/AcademicCapIcon.vue';
import type { Expenses } from '@/features/AddProperty/types/expenses.ts';
import { useGroqSummary } from '@/shared/components/Groq/composables/useGroqSummary.ts';
import MarkdownViewer from '@/shared/components/MarkdownViewer/MarkdownViewer.vue';

const props = defineProps<{
  expenses: Expenses[]
}>()

const { summary, loading, analyzeExpenses } = useGroqSummary()

watch(
  () => props.expenses,
  (newExpenses) => {
    if (newExpenses && newExpenses.length) {
      console.log('Analyzing:', newExpenses)
      analyzeExpenses(newExpenses)
    }
  },
  { immediate: true }
)

</script>
