<template>
  <TheModal
    title="Enter or paste the pin code to access page"
    open
    :closable="false"
  >
    <InputOtp v-model="code" />

    <template #footer>
      <button
        class="btn btn-primary"
        :disabled="disableContinue"
        @click="onContinue"
      >
        Continue
      </button>
    </template>
  </TheModal>  
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRoute } from 'vue-router';
import { useRouter } from 'vue-router';

import { useCachedProperties } from '@/features/AddProperty/composables/useCachedProperties.ts';
import InputOtp from '@/shared/components/InputOtp/InputOtp.vue';
import TheModal from '@/shared/components/TheModal/TheModal.vue';
import { usePinStore } from '@/shared/stores/usePinStore.ts';
import { useToastStore } from '@/shared/stores/useToastStore.ts';

const pinStore = usePinStore();
const code = ref<string[]>(['','','','','',''])
const router = useRouter()
const route = useRoute()
const toastStore = useToastStore()
const redirectTo = route.query.redirect as string || '/';
const matchId = redirectTo.match(/\/property-details\/([^/?#]+)/)
const propertyId = matchId ? matchId[1] : null;
const { data } = useCachedProperties('$id', propertyId || '')
const disableContinue = ref(false)

const onContinue = async () => {
  const pin = data?.value?.[0]?.pin ?? '';
  const enteredPin = Object.values(code.value).join('')
  if (!enteredPin) {
    toastStore.show('Please enter pin', 'info')
    return;
  }

  if (enteredPin === pin) {
    disableContinue.value = true
    await toastStore.show('Correct pin! Redirecting..', 'success')
    pinStore.setVerified()
    await router.replace(redirectTo)
  } else {
    toastStore.show('Invalid PIN, try again', 'error')
  }
}
</script>