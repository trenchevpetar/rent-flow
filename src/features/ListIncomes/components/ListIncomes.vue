<template>
  <h1 class="title text-2xl mb-4">
    List Incomes
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
      <div class="card bg-base-100 shadow-sm mb-4">
        <div class="card-body">
          <TheStat
            :title="income.type"
            :value="income.amount"
          >
            <template #image>
              <CreditCardIcon />
            </template>
          </TheStat>
        </div>
      </div>
    </TheColumn>
  </TheGrid>
</template>

<script lang="ts" setup>
import { computed } from 'vue';

import CreditCardIcon from '@/assets/icons/CreditCardIcon.vue';
import { useIncomes } from '@/features/ListIncomes/composables/useIncomes.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';

const authStore = useAuthStore();
const propertyId = computed(() => authStore.currentUser?.$id || '');
const { data: incomes, isPending } = useIncomes(propertyId.value);
</script>