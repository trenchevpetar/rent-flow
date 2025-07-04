import { createApp, h } from 'vue'

import ConfirmDialog from '@/shared/components/ConfirmDialog/ConfirmDialog.vue';

export function useConfirmDialog ({
     title,
     message,
     onConfirm
   }: {
  title: string
  message: string
  onConfirm: () => Promise<void>
}): Promise<boolean> {
  return new Promise((resolve) => {
    const container = document.createElement('div')
    document.body.appendChild(container)

    const app = createApp({
      render () {
        return h(ConfirmDialog, {
          title,
          message,
          onConfirm: async (done: (success: boolean) => void) => {
            try {
              await onConfirm()
              done(true)
              resolve(true)
            } catch (err) {
              console.error('Confirm action failed:', err)
              done(false)
              resolve(false)
            }
          },
          onCancel: () => {
            resolve(false)
            app.unmount()
            document.body.removeChild(container)
          }
        })
      }
    })

    app.mount(container)

    // Ensure dialog is shown
    setTimeout(() => {
      const dialogEl = container.querySelector('dialog') as HTMLDialogElement
      dialogEl?.showModal()
    })
  })
}
