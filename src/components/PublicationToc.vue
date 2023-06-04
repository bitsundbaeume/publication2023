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
          v-if="!collectionEntry.isCurrent"
          class="c-pub-toc__page"
        >
          <a
            class="c-pub-toc__link"
            :href="`/${collectionEntry.slug}`"
            rel="prefetch"
            v-text="collectionEntry.title"
          />
        </li>
        <li
          v-else
          class="c-pub-toc__page is-current"
        >
          <p
            class="c-pub-toc__page-title"
            v-text="collectionEntry.title"
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
  headings: [
    {
      depth: number;
      slug: string;
    },
  ]
}

defineProps<TableOfContentsProps>()

const tocId = 'tableOfContents';

const activeHeadline = ref('');

const observer = new IntersectionObserver((entries) => {

  entries.forEach((entry) => {

    if (!(entry.intersectionRatio > 0)) return;

    const headline = entry.target as HTMLElement;
    activeHeadline.value = headline.id;
  });
}, {
  threshold: 0,
  rootMargin: '0px 0px -60% 0px',
});

onMounted(() => {
  if (observer) document.querySelectorAll('h1[id], h2[id], h3[id]').forEach(section => observer.observe(section));
})

onUnmounted(() => {
  if (observer) observer.disconnect();
})
</script>

<style lang="scss">
@use '@styles/components/pub-toc.scss';
</style>
