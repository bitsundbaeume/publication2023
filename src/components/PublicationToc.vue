<template>
  <nav :id="tocId" class="c-pub-toc">
    <div class="c-pub-toc__controls">
      <button
        class="c-button c-button--primary c-pub-toc__controls-button"
        title="Close all chapters"
        @click="toggleAllChapters(false)"
      >
        <ChevronUpSquare :size="20" />
      </button>
      <button
        class="c-button c-button--primary c-pub-toc__controls-button"
        title="Open all chapters"
        @click="toggleAllChapters(true)"
      >
        <ChevronDownSquare :size="20" />
      </button>
    </div>
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
          <button
            type="button"
            class="c-pub-toc__chapter-button c-button c-button--transparent"
            @click="toggleChapter(chapter[0].chapter)"
          >
            <div class="c-pub-toc__chapter-title-wrap">
              <p
                class="c-pub-toc__chapter-title"
                :class="{
                  'is-current':
                    chapter.find((item) => item.isCurrent === true)?.chapter ===
                    chapter[0].chapter,
                }"
              >
                {{ chapterTitles[chapter[0].chapter] }}
              </p>
            </div>
            <ChevronRight
              class="c-pub-toc__chapter-icon"
              :class="{ 'is-open': visibleStatesChapters[chapter[0].chapter] }"
            />
          </button>
          <Transition name="fade">
            <ul
              v-show="visibleStatesChapters[chapter[0].chapter]"
              class="c-pub-toc__chapter-list"
            >
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
          </Transition>
        </li>
      </template>
    </ul>
  </nav>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, onBeforeMount, ref, reactive } from "vue";
import {
  ChevronRight,
  ChevronUpSquare,
  ChevronDownSquare,
} from "lucide-vue-next";

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

const props = defineProps<TableOfContentsProps>();

const tocId = "tableOfContents";

const activeHeadline = ref("");

const visibleStatesChapters = reactive<{ [key: number]: boolean }>({});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio <= 0) return;
      const tocContainer = document.querySelector(".c-pub-toc") as HTMLElement;
      const headline = entry.target as HTMLElement;
      activeHeadline.value = headline.id;

      // Make sure the current headline scrolls when the user scrolls
      if (
        entry.target.classList.contains("is-current") &&
        entry.isIntersecting
      ) {
        tocContainer.scroll({
          behavior: "smooth",
          left: 0,
          top: (entry.target as HTMLElement).offsetTop - tocContainer.offsetTop,
        });
      }
    });
  },
  {
    threshold: 0,
    rootMargin: "0px 0px -60% 0px",
  },
);

/**
 * Open or close a chapter
 *
 * @param   {number}  chapterNumber
 *
 * @return  {void}
 */
const toggleChapter = (chapterNumber: number): void => {
  visibleStatesChapters[chapterNumber] = !visibleStatesChapters[chapterNumber];
};

/**
 * Open or close all chapters
 *
 * @param   {boolean}  state
 *
 * @return  {void}
 */
const toggleAllChapters = (state: boolean): void => {
  Object.keys(visibleStatesChapters).forEach((chapter) => {
    visibleStatesChapters[+chapter] = state;
  });
};

onBeforeMount(() => {
  // for each chapter, set a boolean to false to hide the chapter, and true when one of the articles of the chapter is "isCurrent: true"
  Object.keys(props.chapters).forEach((chapter) => {
    // if one of the articles of the chapter is "isCurrent: true", set the chapter to true
    if (
      props.chapters[+chapter].find((item) => item.isCurrent === true)
        ?.chapter === props.chapters[+chapter][0].chapter
    ) {
      visibleStatesChapters[+chapter] = true;
      return;
    }

    visibleStatesChapters[+chapter] = false;
  });
});

onMounted(() => {
  if (observer)
    document
      .querySelectorAll("h1[id], h2[id], h3[id]")
      .forEach((section) => observer.observe(section));

  const currentChapter = document.querySelector(
    ".c-pub-toc__chapter.is-current",
  ) as HTMLElement;
  const tocContainer = document.querySelector(".c-pub-toc") as HTMLElement;

  if (currentChapter && tocContainer) {
    const rect = currentChapter.getBoundingClientRect();
    const tocRect = tocContainer.getBoundingClientRect();

    if (rect.top < tocRect.top || rect.bottom > tocRect.bottom) {
      tocContainer.scroll({
        behavior: "smooth",
        left: 0,
        top: currentChapter.offsetTop - tocContainer.offsetTop,
      });
    }
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/pub-toc.scss";
</style>
