<template>
  <Transition name="fade">
    <a
      v-show="isScrolled"
      :href="linkToTop"
      class="c-to-top c-button c-button--primary"
      aria-label="back to top"
    >
      <ChevronUp
        :size="24"
        class="c-to-top__icon u-ignore-click"
      />
    </a>
  </Transition>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';
import { ChevronUp } from 'lucide-vue-next';

interface ToTopProps {
  topElement?: string;
  linkToTop?: string;
}

const props = withDefaults(defineProps<ToTopProps>(), {
  topElement: '#header',
  linkToTop: '#header',
});

const observer = ref<IntersectionObserver | null>(null);
const isScrolled = ref(false);

const handleIntersect = (entries: IntersectionObserverEntry[]) => {
  entries.forEach((entry) => {
    isScrolled.value = entry.isIntersecting ? false : true;
  });
};

onMounted(() => {
  observer.value = new IntersectionObserver(handleIntersect);
  observer.value.observe(document.querySelector(props.topElement));
});

onUnmounted(() => {
  observer.value?.disconnect();
});

</script>

<style lang="scss">
@use '@styles/components/_to-top.scss';
</style>
