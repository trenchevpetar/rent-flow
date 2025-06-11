<template>
  <div class="bg-base-100 p-4 rounded shadow">
    <h2 class="font-semibold mb-2 flex items-center gap-2">
      <AcademicCapIcon />
      {{ t('ai.summary') }}
    </h2>
    <div
      v-if="loading"
      class="text-gray-500"
    >
      {{ t('ai.analysing') }}
    </div>
    <MarkdownViewer
      v-else
      :markdown="summary"
    />
  </div>
</template>

<script setup lang="ts">
import { watch } from 'vue'
import { useI18n } from 'vue-i18n';

import AcademicCapIcon from '@/assets/icons/AcademicCapIcon.vue';
import type { Expense } from '@/features/AddProperty/types/expense.types.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import { useGroqSummary } from '@/shared/components/Groq/composables/useGroqSummary.ts';
import MarkdownViewer from '@/shared/components/MarkdownViewer/MarkdownViewer.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()

const props = defineProps<{
  expenses: Expense[]
}>()

const { summary, loading, analyzeExpenses } = useGroqSummary()

watch(
  () => props.expenses,
  (newExpenses) => {
    if (newExpenses && newExpenses.length) {
      analyzeExpenses(newExpenses)
    }
  },
  { immediate: true }
)

</script>
