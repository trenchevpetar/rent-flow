<template>
  <TheStat
    :title="category.label"
    :value="expense.amount"
    :class="paidStyles(expense.isPaid)"
  >
    <template #title>
      <div
        class="badge"
        :class="{ 'badge-warning': !category.color }"
        :style="{ color: category.color }"
      >
        {{ category.label }}
      </div>
    </template>
    <template #description>
      <div class="flex items-center gap-1 text-sm">
        <DollarIcon />
        <span v-if="expense.isPaid">
          {{ t('payment.paidOn', { date: useFormattedDate(expense.$updatedAt) }) }}
        </span>
        <span v-else>{{ t('payment.pending') }}</span>
      </div>
    </template>
    <template #image>
      <TheIcon
        v-if="category.icon"
        :icon-name="category.icon"
        size="12"
      />
      <HomeIcon v-else />
    </template>
    <template #actions>
      <ListPropertyExpensesActions
        :expense="expense"
        @on-mark-as-paid="onMark(true)"
        @on-mark-as-unpaid="onMark(false)"
        @on-edit="emit('edit', expense.$id)"
        @on-delete="emit('delete', expense.$id)"
      />
    </template>
  </TheStat>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import DollarIcon from '@/assets/icons/DollarIcon.vue'
import HomeIcon from '@/assets/icons/HomeIcon.vue'
import type { Expense } from '@/features/Property/AddProperty/types/expense.types.ts';
import type { Category } from '@/features/Property/Categories/types/category.type.ts';
import ListPropertyExpensesActions from '@/features/Property/ListProperties/components/ListPropertyExpensesActions.vue'
import TheIcon from '@/shared/components/TheIcon/TheIcon.vue'
import TheStat from '@/shared/components/TheStat/TheStat.vue'
import { useFormattedDate } from '@/shared/composables/useFormattedDate'

const { t } = useI18n()

const props = defineProps<{
  expense: Expense
  category: Category
}>()

const emit = defineEmits(['mark', 'edit', 'delete'])

const onMark = (value: boolean) => emit('mark', { ...props.expense, isPaid: value })

const paidStyles = (isPaid: boolean) =>
    isPaid ? 'border-l-[10px] border-l-success mt-4' : 'border-l-[10px] border-l-warning mt-4'
</script>
