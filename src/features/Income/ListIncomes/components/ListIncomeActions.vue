<template>
  <div class="join">
    <button
      class="btn btn-info btn-xs join-item"
      @click="onEdit"
    >
      {{ t('actions.edit') }}
    </button>
    <button
      class="btn btn-error btn-xs join-item"
      @click="onDelete"
    >
      {{ t('actions.delete') }}
    </button>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n';

import type { MessagesSchema } from '@/i18n/messages.ts';

const emit = defineEmits(['on-edit', 'on-delete'])
const { t } = useI18n<{ messages: MessagesSchema }>()
const onEdit = () => emit('on-edit')
const onDelete = () => emit('on-delete')
</script>
