<template>
  <div class="card bg-base-100 shadow-sm mb-4 border-2 border-white/20">
    <div class="card-body">
      <h2 class="card-title">
        <slot name="title" />
      </h2>
      <slot />
      <div class="card-actions justify-end">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
