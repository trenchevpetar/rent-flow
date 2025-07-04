<template>
  <section
    class="list-properties"
    v-if="properties && properties.length"
  >
    <h1 class="title text-2xl mb-4">
      {{ t('properties.added') }}
    </h1>
    <TheGrid class="gap-4">
      <TheColumn
        v-for="property in properties"
        :key="property.$id"
        :size="12"
        :responsive="columns"
      >
        <TheSkeletonCircleContent v-if="isLoading" />
        <TheCard>
          <template #title>
            {{ property.name }}
          </template>
          <ul>
            <li>
              {{ t('location') }}: {{ property.location }}
            </li>
          </ul>
          <template #actions>
            <slot name="property-actions">
              <div class="join mt-2">
                <RouterLink
                  :to="`/property-categories/${property.$id}`"
                  class="btn btn-outline btn-sm join-item"
                >
                  Configure categories
                </RouterLink>
                <RouterLink
                  :to="`/property-details/${property.$id}`"
                  class="btn btn-outline btn-sm join-item"
                >
                  {{ t('expenses.check') }}
                </RouterLink>
              </div>
            </slot>
          </template>
        </TheCard>
      </TheColumn>
    </TheGrid>
    <div class="divider" />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import { useCachedProperties } from '@/features/Property/AddProperty/composables/useCachedProperties.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheCard from '@/shared/components/TheCard/TheCard.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';

const authStore = useAuthStore();

const { data: properties, isPending: isLoading } = useCachedProperties('ownerId', authStore.currentUser?.$id ?? '')
const { t } = useI18n<{ messages: MessagesSchema }>()

const props = withDefaults(
  defineProps<{
    isPresentational?: boolean
  }>(),
  {
    isPresentational: false
  }
)

const columns = computed(() => {
  if (props.isPresentational) return { sm: 12, md: 12, lg: 12 }
  return { sm: 12, md: 6, lg: 4 }
})
</script>
