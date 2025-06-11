<template>
  <h1 class="title text-2xl mb-4">
    {{ t('incomes.list') }}
  </h1>
    
  <TheSkeletonCircleContent v-if="isPending" />
  <TheGrid
    v-else
    class="gap-4"
  >
    <TheColumn
      v-for="income in incomes"
      :key="income.datePaid"
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 6 }"
    >
      <TheCard>
        <TheStat
          :title="t(`incomes.categories.${income.type.toLowerCase()}`)"
          :value="income.amount"
        >
          <template #image>
            <CreditCardIcon />
          </template>
        </TheStat>
      </TheCard>
    </TheColumn>
  </TheGrid>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import CreditCardIcon from '@/assets/icons/CreditCardIcon.vue';
import { useIncomes } from '@/features/ListIncomes/composables/useIncomes.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheCard from '@/shared/components/TheCard/TheCard.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';

const authStore = useAuthStore();
const propertyId = computed(() => authStore.currentUser?.$id || '');
const { data: incomes, isPending } = useIncomes(propertyId.value);

const { t } = useI18n<{ messages: MessagesSchema }>()
</script>