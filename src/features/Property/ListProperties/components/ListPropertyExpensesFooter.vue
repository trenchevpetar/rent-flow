<template>
  <TheGrid>
    <TheColumn
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 6 }"
    >
      <TheStat
        :title="t('payment.total')"
        :value="expense.totalAmount"
      />
    </TheColumn>

    <TheColumn
      v-if="expense.totalUnpaid"
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 6 }"
    >
      <TheStat
        :title="t('payment.unpaid')"
        :value="expense.totalUnpaid"
      />
    </TheColumn>
  </TheGrid>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { UpdatableExpense } from '@/features/Property/AddProperty/types/expense.types.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()

defineProps<{
  expense: UpdatableExpense;
}>();
</script>