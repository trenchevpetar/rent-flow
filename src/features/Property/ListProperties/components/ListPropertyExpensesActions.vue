<template>
  <div class="join">
    <button
      v-if="!expense.isPaid"
      class="btn btn-success btn-xs join-item"
      @click="onMarkAsPaid"
    >
      {{ t('actions.markAsPaid') }}
    </button>
    <button
      v-else
      class="btn btn-warning btn-xs join-item"
      @click="onMarkAsUnpaid"
    >
      {{ t('actions.markAsUnpaid') }}
    </button>
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

import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';

const { t } = useI18n<{ messages: MessagesSchema }>()

const emit = defineEmits(['on-mark-as-paid', 'on-mark-as-unpaid', 'on-edit', 'on-delete'])
const onMarkAsPaid = () => emit('on-mark-as-paid')
const onMarkAsUnpaid = () => emit('on-mark-as-unpaid')
const onEdit = () => emit('on-edit')
const onDelete = () => emit('on-delete')

defineProps<{
  expense: Expense
}>()
</script>