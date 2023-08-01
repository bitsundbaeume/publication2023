<template>
  <nav :id="tocId" ref="pubToc" class="c-pub-toc">
    <div class="c-pub-toc__header-wrap">
      <h2 class="c-pub-toc__start-heading">Table of Contents</h2>
      <button
        class="c-button c-button--primary c-pub-toc__controls-button"
        :title="allChaptersOpen ? 'Fold all chapters' : 'Unfold all chapters'"
        @click="toggleChapterOrAll()"
      >
        <Transition name="fade" mode="out-in">
          <ChevronUp v-if="allChaptersOpen" :size="20" />
          <ChevronDown v-else :size="20" />
        </Transition>
      </button>
    </div>

    <ul class="c-pub-toc__pages u-list-reset" role="menu">
      <template v-for="chapter of chapters" :key="chapter.slug">
        <li
          class="c-pub-toc__chapter"
          :class="{
            'is-current': isCurrentChapter(chapter),
          }"
          role="presentation"
        >
          <button
            type="button"
            class="c-pub-toc__chapter-button c-button c-button--transparent"
            :aria-expanded="isVisibleChapter(chapter)"
            :aria-controls="`chapter-${chapter[0].chapter}`"
            role="menuitem"
            @click="toggleChapterOrAll(chapter[0].chapter)"
          >
            <div class="c-pub-toc__chapter-title-wrap">
              <p
                class="c-pub-toc__chapter-title"
                :class="{
                  'is-current': isCurrentChapter(chapter),
                }"
              >
                {{ chapterTitles[chapter[0].chapter] }}
              </p>
            </div>
            <ChevronRight
              class="c-pub-toc__chapter-icon"
              :class="{ 'is-open': isVisibleChapter(chapter) }"
            />
          </button>

          <ul
            v-show="isVisibleChapter(chapter)"
            :id="`chapter-${chapter[0].chapter}`"
            class="c-pub-toc__chapter-list"
            role="menu"
          >
            <template v-for="article in chapter" :key="article.order">
              <li v-if="!article.isCurrent" role="presentation">
                <a
                  class="c-pub-toc__link"
                  :href="`/${article.slug}`"
                  rel="prefetch"
                  role="menuitem"
                  v-text="article.title"
                />
              </li>
              <li v-else class="c-pub-toc__page is-current" role="presentation">
                <ul class="c-pub-toc__current-toc u-list-reset" role="menu">
                  <template v-for="headline in headings" :key="headline.slug">
                    <li
                      :class="[
                        `c-pub-toc__headline is-depth-${headline.depth}`,
                        {
                          'is-active': activeHeadline === headline.slug,
                        },
                      ]"
                      role="presentation"
                    >
                      <a
                        class="c-pub-toc__link"
                        :href="`#${headline.slug}`"
                        role="menuitem"
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
import {
  onMounted,
  onUnmounted,
  onBeforeMount,
  ref,
  reactive,
  computed,
} from "vue";
import { ChevronRight, ChevronDown, ChevronUp } from "lucide-vue-next";
import { isMobileViewport } from "@lib/helper";

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
const pubToc = ref<HTMLElement | null>(null);

const visibleStatesChapters = reactive({} as { [key: number]: boolean });

// if visibleStatesChapters all true, then all chapters are open
const allChaptersOpen = computed(() =>
  Object.values(visibleStatesChapters).every((state) => state),
);

/**
 * Get the current chapter and scroll to it.
 *
 * @return  {[type]}
 */
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.intersectionRatio <= 0) return;
      const headline = entry.target as HTMLElement;
      activeHeadline.value = headline.id;

      // Make sure the current headline scrolls when the user scrolls
      if (
        entry.target.classList.contains("is-current") &&
        entry.isIntersecting &&
        !isMobileViewport()
      ) {
        pubToc.value?.scroll({
          behavior: "smooth",
          left: 0,
          top: (entry.target as HTMLElement).offsetTop - pubToc.value.offsetTop,
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
 * Toggle the visibility of a chapter or all chapters.
 * If no chapterNumber is provided, toggle all chapters.
 *
 * @param   {number}  chapterNumber
 *
 * @return  {void}
 */
const toggleChapterOrAll = (chapterNumber?: number): void => {
  if (chapterNumber === undefined) {
    const allChaptersVisible = Object.values(visibleStatesChapters).every(
      (state) => state,
    );
    Object.keys(visibleStatesChapters).forEach((chapter) => {
      visibleStatesChapters[+chapter] = !allChaptersVisible;
    });
  } else {
    visibleStatesChapters[chapterNumber] =
      !visibleStatesChapters[chapterNumber];
  }
};

/**
 * Check if the current chapter is the current one.
 *
 * @param   {Item[]}   chapter
 *
 * @return  {boolean}
 */
const isCurrentChapter = (chapter: Item[]): boolean => {
  return chapter.some(
    (item) => item.isCurrent && item.chapter === chapter[0].chapter,
  );
};

/**
 * Check if the current chapter is visible.
 *
 * @param   {Item[]}   currentChapter
 *
 * @return  {boolean}
 */
const isVisibleChapter = (currentChapter: Item[]): boolean => {
  return visibleStatesChapters[currentChapter[0].chapter];
};

/**
 * Create a list of all chapters with their visibility state.
 * For each chapter, set a boolean to false to hide the chapter, and true when one of the articles of the chapter is "isCurrent: true".
 *
 * If the viewport is mobile, set all chapters to false.
 *
 * @return  {void}
 */
const initVisibleStatesChapters = (): void => {
  Object.keys(props.chapters).forEach((chapter) => {
    visibleStatesChapters[+chapter] = isMobileViewport()
      ? false
      : props.chapters[+chapter].some((item) => item.isCurrent);
  });
};

/**
 * Scroll the current chapter into view.
 *
 * @return  {void}
 */
const scrollCurrentChapterIntoView = (): void => {
  const currentChapter = document.querySelector(
    ".c-pub-toc__chapter.is-current",
  ) as HTMLElement;
  const tocContainer = document.querySelector(".c-pub-toc") as HTMLElement;

  // If the current chapter or the toc container is not found, do nothing
  if (!(currentChapter && tocContainer)) {
    return;
  }

  const rect = currentChapter.getBoundingClientRect();
  const tocRect = tocContainer.getBoundingClientRect();

  // If the current chapter is not visible, scroll to it
  if (rect.top < tocRect.top || rect.bottom > tocRect.bottom) {
    tocContainer.scroll({
      behavior: "smooth",
      left: 0,
      top: currentChapter.offsetTop - tocContainer.offsetTop,
    });
  }
};

onBeforeMount(() => {
  initVisibleStatesChapters();
});

onMounted(() => {
  if (observer)
    document
      .querySelectorAll("h1[id], h2[id], h3[id]")
      .forEach((section) => observer.observe(section));

  if (!isMobileViewport()) scrollCurrentChapterIntoView();
  if (isMobileViewport()) {
    // Scroll main content in to view (skip toc)
    document.getElementById("contentStart")?.scrollIntoView({
      block: "start",
      behavior: "smooth",
      inline: "start",
    });
  }
});

onUnmounted(() => {
  if (observer) observer.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/pub-toc.scss";
</style>
