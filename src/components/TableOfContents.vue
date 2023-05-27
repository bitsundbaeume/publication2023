<template>
  <nav
    :id="tocId"
    class="c-toc"
  >
    <ul class="c-toc__pages">
      <template
        v-for="(collectionEntry, collectionIndex) in collection"
        :key="collectionIndex"
      >
        <li
          v-if="collectionEntry.id !== currentEntry"
          class="c-toc__page"
        >
          <a

            :href="`/${collectionEntry.slug}`"
            v-text="collectionEntry.data.title"
          />
        </li>
        <li
          v-else
          class="c-toc__page is-current"
        >
          <a
            :href="`/${collectionEntry.slug}`"
            v-text="collectionEntry.data.title"
          />
          <ul class="c-toc__current-toc">
            <template
              v-for="(headline, headingsIndex) in headings"

              :key="headingsIndex"
            >
              <li
                :class="[
                  `c-toc__headline c-toc__headline--depth-${headline.depth}`,
                  {
                    'is-active': activeHeadline === headline.slug
                  }
                ]"
              >
                <a
                  class="c-toc__link"
                  :href="`#${headline.slug}`"
                  v-text="headline.text"
                />
              </li>
            </template>
          </ul>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue';

export interface TableOfContentsProps {
  collection: Array;
  currentEntry: string;
  headings: [
    {
      depth: number;
      slug: string;
      test: string;
    },
  ]
}

const props = defineProps<TableOfContentsProps>()

const tocId = 'tableOfContents';

const activeHeadline = ref('');

const observer = ref<IntersectionObserver>();

observer.value = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const headline = entry.target as HTMLElement;
      activeHeadline.value = headline.id;
    }
  });
}, {
  threshold: 0.75,
  rootMargin: '-10% 0px',
});

const activeCollection = () => {
  return props.collection.filter((entry) => entry.slug === props.currentEntry);
}

onMounted(() => {
  if (observer.value) document.querySelectorAll('h1[id], h2[id], h3[id]').forEach(section => observer?.value?.observe(section));
})

onUnmounted(() => {
  if (observer.value) observer.value.disconnect();
})
</script>
<!--
<style lang="scss">
@use '@styles/components/table-of-contents.scss';
</style> -->
