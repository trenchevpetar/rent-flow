<template>
  <h1 class="title text-2xl mb-4">
    {{ t('properties.added') }}
  </h1>
  <TheGrid class="gap-4">
    <TheColumn
      v-for="property in properties"
      :key="property.$id"
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 4 }"
    >
      <TheSkeletonCircleContent v-if="isLoading" />
      <div class="card bg-base-100 shadow-sm mb-4">
        <div class="card-body">
          <h2 class="card-title">
            {{ property.name }}
          </h2>
          <ul>
            <li>
              {{ t('location') }}: {{ property.location }}
            </li>
          </ul>
          <div class="card-actions justify-end">
            <RouterLink
              :to="`/property-details/${property.$id}`"
              class="btn btn-primary"
            >
              {{ t('expenses.check') }}
            </RouterLink>
          </div>
        </div>
      </div>
    </TheColumn>
  </TheGrid>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

import { useCachedProperties } from '@/features/AddProperty/composables/useCachedProperties.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';

const authStore = useAuthStore();

const isModalActive = ref(false)
const { data: properties, isPending: isLoading } = useCachedProperties('ownerId', authStore.currentUser?.$id ?? '')
const { t } = useI18n<{ messages: MessagesSchema }>()

const onAddProperty = () => isModalActive.value = true;
</script>
