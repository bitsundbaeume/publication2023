<template>
  <nav
    :id="tocId"
    class="c-pub-toc"
  >
    <ul class="c-pub-toc__pages u-list-reset">
      <template
        v-for="(collectionEntry, collectionIndex) in collection"
        :key="collectionIndex"
      >
        <li
          v-if="collectionEntry.id !== currentEntry"
          class="c-pub-toc__page"
        >
          <a
            class="c-pub-toc__link"
            :href="`/${collectionEntry.slug}`"
            v-text="collectionEntry.data.title"
          />
        </li>
        <li
          v-else
          class="c-pub-toc__page is-current"
        >
          <p
            class="c-pub-toc__page-title"
            v-text="collectionEntry.data.title"
          />
          <ul class="c-pub-toc__current-toc u-list-reset">
            <template
              v-for="(headline, headingsIndex) in headings"

              :key="headingsIndex"
            >
              <li
                :class="[
                  `c-pub-toc__headline is-depth-${headline.depth}`,
                  {
                    'is-active': activeHeadline === headline.slug
                  }
                ]"
              >
                <a
                  class="c-pub-toc__link"
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
  threshold: 0,
  rootMargin: '-50% 0px',
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

<style lang="scss">
@use '@styles/components/pub-toc.scss';
</style>
