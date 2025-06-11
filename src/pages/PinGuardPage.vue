<template>
  <TheModal
    :title="t('toast.pin.info')"
    open
    :closable="false"
    @keydown.enter="onContinue"
  >
    <InputOtp v-model="code" />

    <template #footer>
      <button
        class="btn btn-primary"
        :disabled="disableContinue"
        @click="onContinue"
      >
        {{ t('continue') }}
      </button>
      <LanguageSwitcher />
    </template>
  </TheModal>  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { useCachedProperties } from '@/features/Property/AddProperty/composables/useCachedProperties.ts';
import type { MessagesSchema } from '@/i18n/messages.ts';
import InputOtp from '@/shared/components/InputOtp/InputOtp.vue';
import LanguageSwitcher from '@/shared/components/LanguageSwitcher/LanguageSwitcher.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';
import { usePinStore } from '@/shared/stores/usePinStore.ts';
import { useToastStore } from '@/shared/stores/useToastStore.ts';

const pinStore = usePinStore();
const code = ref<string[]>(['','','','','',''])
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const queryId = route.query.id as string;
const { data } = useCachedProperties('$id', queryId || '')
const disableContinue = ref(false)
const { t } = useI18n<{ messages: MessagesSchema }>()

const onContinue = async () => {
  const pin = data?.value?.[0]?.pin ?? '';
  const enteredPin = Object.values(code.value).join('')
  if (!enteredPin) {
    toastStore.show(t('toast.pin.enter'), 'info')
    return;
  }

  if (enteredPin === pin) {
    disableContinue.value = true
    await toastStore.show(t('toast.pin.correct'), 'success')
    pinStore.markVerified(queryId)
    await router.replace(`/property-details/${queryId}`)
  } else {
    toastStore.show(t('toast.pin.invalid'), 'error')
  }
}
</script>