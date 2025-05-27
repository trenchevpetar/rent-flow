<template>
  <div
    v-if="showInstallPrompt"
    class="install-banner"
  >
    <p>Install this app on your device!</p>
    <button @click="installApp">
      Install
    </button>
    <button @click="dismiss">
      Maybe later
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null)
const showInstallPrompt = ref(false)

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e: Event) => {
    e.preventDefault()
    deferredPrompt.value = e as BeforeInstallPromptEvent
    showInstallPrompt.value = true
  })
})

const installApp = async () => {
  if (!deferredPrompt.value) return

  deferredPrompt.value.prompt()
  const { outcome } = await deferredPrompt.value.userChoice

  if (outcome === 'accepted') {
    console.log('User accepted the install prompt')
  } else {
    console.log('User dismissed the install prompt')
  }

  deferredPrompt.value = null
  showInstallPrompt.value = false
}

const dismiss = () => {
  showInstallPrompt.value = false
}
</script>

<style scoped>
.install-banner {
  position: fixed;
  bottom: 1rem;
  left: 1rem;
  right: 1rem;
  background: #ffffff;
  border: 1px solid #ccc;
  padding: 1rem;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.install-banner button {
  margin-left: 0.5rem;
}
</style>
