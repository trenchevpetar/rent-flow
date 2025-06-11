<template>
  <TheGrid>
    <TheColumn
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 6 }"
    >
      <TheStat
        :title="t('totalPending')"
        :value="totalAmountPendingPayment"
      />
    </TheColumn>

    <TheColumn
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 6 }"
    >
      <TheStat
        :title="t('totalUnpaid')"
        :value="totalAmountUnpaid"
      />
    </TheColumn>
  </TheGrid>
</template>
<script setup lang="ts">
import { useI18n } from 'vue-i18n';

import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';

const { t } = useI18n<{ messages: MessagesSchema }>()

defineProps<{
  totalAmountPendingPayment: number,
  totalAmountUnpaid: number
}>();
</script>