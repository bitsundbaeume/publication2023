<template>
  <nav :id="tocId" class="c-pub-toc">
    <h2 class="c-pub-toc__start-heading">Table of Contents</h2>
    <ul class="c-pub-toc__pages u-list-reset">
      <template v-for="chapter of chapters" :key="chapter">
        <li
          class="c-pub-toc__chapter"
          :class="{
            'is-current':
              chapter.find((item) => item.isCurrent === true)?.chapter ===
              chapter[0].chapter,
          }"
        >
          <p class="c-pub-toc__chapter-title">
            {{ chapterTitles[chapter[0].chapter] }}
          </p>
          <ul>
            <template v-for="article in chapter" :key="article.order">
              <li v-if="!article.isCurrent">
                <a
                  class="c-pub-toc__link"
                  :href="`/${article.slug}`"
                  rel="prefetch"
                  v-text="article.title"
                />
              </li>
              <li v-else class="c-pub-toc__page is-current">
                <ul class="c-pub-toc__current-toc u-list-reset">
                  <template v-for="headline in headings" :key="headline.slug">
                    <li
                      :class="[
                        `c-pub-toc__headline is-depth-${headline.depth}`,
                        {
                          'is-active': activeHeadline === headline.slug,
                        },
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
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, ref } from "vue";

interface Item {
  title: string;
  slug: string;
  isCurrent: boolean;
  chapter: number;
  order: number;
}

interface Data {
  [key: number]: Item[];
}

export interface TableOfContentsProps {
  headings: {
    depth: number;
    slug: string;
    text: string;
  }[];
  chapters: Data;
  chapterTitles: string[];
}

defineProps<TableOfContentsProps>();

const tocId = "tableOfContents";

const activeHeadline = ref("");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio <= 0) return;

      const headline = entry.target as HTMLElement;
      activeHeadline.value = headline.id;
    });
  },
  {
    threshold: 0,
    rootMargin: "0px 0px -60% 0px",
  },
);

const scrollIfNeeded = (element: HTMLElement, container: HTMLElement): void => {
  if (element.offsetTop < container.scrollTop) {
    container.scrollTop = element.offsetTop;
    return;
  }
  const offsetBottom: number = element.offsetTop + element.offsetHeight;
  const scrollBottom: number = container.scrollTop + container.offsetHeight;
  if (offsetBottom > scrollBottom) {
    container.scrollTop = offsetBottom - container.offsetHeight;
  }
};

onMounted(() => {
  if (observer)
    document
      .querySelectorAll("h1[id], h2[id], h3[id]")
      .forEach((section) => observer.observe(section));

  const toc = document.querySelector(".c-pub-toc") as HTMLElement;
  const currentChapter = document.querySelector(
    ".c-pub-toc__chapter.is-current",
  ) as HTMLElement;

  if (toc && currentChapter) {
    scrollIfNeeded(currentChapter, toc);
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/pub-toc.scss";
</style>
