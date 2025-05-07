<template>
  <h1 class="title text-2xl mb-4">
    Properties
  </h1>
  <TheSpinner :is-loading="isPending" />
  <TheGrid class="gap-4">
    <TheColumn
      v-for="property in properties"
      :key="property.$id"
      :size="12"
      :responsive="{ sm: 12, md: 6, lg: 4 }"
    >
      <div class="card bg-base-100 shadow-sm mb-4">
        <div class="card-body">
          <h2 class="card-title">
            {{ property.name }}
          </h2>
          <ul>
            <li>
              Location: {{ property.location }}
            </li>
          </ul>
          <div class="card-actions justify-end">
            <RouterLink
              :to="`/property-details/${property.$id}`"
              class="btn btn-primary"
            >
              Check expenses
            </RouterLink>
          </div>
        </div>
      </div>
    </TheColumn>
  </TheGrid>
</template>

<script lang="ts" setup>
import { useQuery } from '@tanstack/vue-query';

import { getPropertiesByOwnerId } from '@/features/AddProperty/services/property.service.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import TheSpinner from '@/shared/components/TheSpinner/TheSpinner.vue';

const { data: properties, isPending } = useQuery({
  queryKey: ['ownerId'],
  queryFn: getPropertiesByOwnerId,
  staleTime: 1000 * 60 * 5
})
</script>
