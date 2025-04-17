<template>
  <h1 class="title text-2xl">
    Properties
  </h1>
  <TheSpinner :is-loading="isPending" />
  <div
    v-for="property in properties"
    :key="property.$id"
    class="card bg-base-100 w-96 shadow-sm"
  >
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
</template>

<script lang="ts" setup>
import TheSpinner from '../../../shared/components/TheSpinner/TheSpinner.vue';
import { getPropertiesByOwnerId } from '../../AddProperty/services/property.service.ts';
import { useQuery } from '@tanstack/vue-query';

const { data: properties, isPending } = useQuery({
  queryKey: ['ownerId'],
  queryFn: getPropertiesByOwnerId,
  staleTime: 1000 * 60 * 5
})
</script>
