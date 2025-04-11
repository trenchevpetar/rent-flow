<template>
  <h1 class="title text-2xl">
    Properties
  </h1>

  <div
    v-for="property in propertyStore.properties"
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

  <pre>{{ propertyStore.properties }}</pre>
</template>

<script lang="ts" setup>
import { usePropertyStore } from '../stores/usePropertyStore.ts';

const propertyStore = usePropertyStore()
</script>
