<template>
  <section
    class="list-incomes"
    v-if="incomes && incomes.length"
  >
    <h1 class="title text-2xl mb-4">
      {{ t('incomes.list') }}
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
        <TheCard>
          <TheStat :value="income.amount">
            <template #title>
              <div class="flex gap-2">
                <div class="badge badge-info badge-dash">
                  TYPE: {{ income.type }}
                </div>
                <div class="badge badge-success badge-dash">
                  RECEIVED: {{ useFormattedDate(income.datePaid) }}
                </div>
              </div>
            </template>
            <template #image>
              <CreditCardIcon />
            </template>
            <template #actions>
              <ListIncomeActions
                @on-delete="onDeleteIncome(income)"
                @on-edit="onEditIncome(income)"
              />
            </template>
          </TheStat>
        </TheCard>
      </TheColumn>
    </TheGrid>
    <div class="divider" />
  </section>
</template>

<script lang="ts" setup>
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';

import CreditCardIcon from '@/assets/icons/CreditCardIcon.vue';
import ListIncomeActions from '@/features/Income/ListIncomes/components/ListIncomeActions.vue';
import { useIncomes } from '@/features/Income/ListIncomes/composables/useIncomes.ts';
import { deleteIncome } from '@/features/Income/ListIncomes/services/incomes.service.ts';
import type { Income } from '@/features/Income/ListIncomes/types/income.type.ts';
import { useAuthStore } from '@/features/Login/stores/useAuthStore.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import TheColumn from '@/layouts/Grid/TheColumn.vue';
import TheGrid from '@/layouts/Grid/TheGrid.vue';
import { useConfirmDialog } from '@/shared/components/ConfirmDialog/composables/useConfirmDialog.ts';
import TheCard from '@/shared/components/TheCard/TheCard.vue';
import TheSkeletonCircleContent from '@/shared/components/TheSkeleton/TheSkeletonCircleContent.vue';
import TheStat from '@/shared/components/TheStat/TheStat.vue';
import { useFormattedDate } from '@/shared/composables/useFormattedDate.ts';
import { useToastStore } from '@/shared/stores/useToastStore.ts';

const toastStore = useToastStore()
const emit = defineEmits(['on-edit-income'])
const authStore = useAuthStore();
const propertyId = computed(() => authStore.currentUser?.$id || '');
const { data: incomes, isPending, refetch } = useIncomes(propertyId.value);

const { t } = useI18n<{ messages: MessagesSchema }>()
const onEditIncome = (income: Income) => emit('on-edit-income', income)

const onDeleteIncome = async (income: Income) => {
  const isDeleted = await useConfirmDialog({
    title: 'Confirm deletion',
    message: 'Are you sure you want to delete this income?',
    onConfirm: async () => {
      await deleteIncome(income.$id)
      refetch()
    }
  })

  if (isDeleted) {
    await toastStore.show('Deleted successfully', 'success')
  } else {
    await toastStore.show('Deletion failed, try again later', 'warning')
  }
}
</script>
