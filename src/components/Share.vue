<template>
  <button
    v-if="isSupported"
    type="button"
    class="c-share c-button c-button--primary"
    @click.prevent="startShare(title, text, data.currentUrl)"
  >
    <Share2
      focusable="false"
      aria-label="Share"
      class="c-share__icon"
      :size="26"
    />
    Share publication
  </button>
</template>

<script setup lang="ts">
import { Share2 } from 'lucide-vue-next';
import { onMounted, reactive } from 'vue';
import { useShare } from '@vueuse/core'


export interface ShareProps {
  title?: string;
  text?: string;
  url?: string | undefined;
}

const { share, isSupported } = useShare()

const props = defineProps<ShareProps>()

interface Data {
  currentUrl: string | undefined;
}

const data: Data = reactive({
  currentUrl: props.url,
})

const startShare = (title:string | undefined, text:string | undefined, url:string | undefined) => {
  share({title, text, url})
}

onMounted(() => {
  if (!props.url) {
    data.currentUrl = window.location.href
  }
})
</script>

