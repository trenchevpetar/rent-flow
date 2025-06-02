<script setup lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import { computed } from 'vue'

interface Props {
  markdown: string
}

const props = defineProps<Props>()

// Convert markdown to sanitized HTML
const renderedHtml = computed<string>(() => {
  const rawHtml: string = marked.parse(props.markdown || '') as string
  return DOMPurify.sanitize(rawHtml)
})
</script>

<template>
  <div class="p-4 bg-base-100 rounded-box shadow-md">
    <article class="prose dark:prose-invert max-w-none prose-h1:text-primary prose-ul:list-disc prose-li:marker:text-secondary">
      <div v-html="renderedHtml" />
    </article>
  </div>
</template>
