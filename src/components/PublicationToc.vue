<template>
  <nav :id="tocId" class="c-pub-toc">
    <div class="c-pub-toc__header-wrap">
      <h2 class="c-pub-toc__start-heading">Table of Contents</h2>
      <button
        class="c-button c-button--primary c-pub-toc__controls-button"
        :title="allChaptersOpen ? 'Fold all chapters' : 'Unfold all chapters'"
        @click="toggleChapterOrAll()"
      >
        <Transition name="fade" mode="out-in">
          <ChevronUpSquare v-if="allChaptersOpen" :size="20" />
          <ChevronDownSquare v-else :size="20" />
        </Transition>
      </button>
    </div>

    <ul class="c-pub-toc__pages u-list-reset">
      <template v-for="chapter of chapters" :key="chapter">
        <li
          class="c-pub-toc__chapter"
          :class="{
            'is-current': chapter.some(
              (item) => item.isCurrent && item.chapter === chapter[0].chapter,
            ),
          }"
        >
          <button
            type="button"
            class="c-pub-toc__chapter-button c-button c-button--transparent"
            @click="toggleChapterOrAll(chapter[0].chapter)"
          >
            <div class="c-pub-toc__chapter-title-wrap">
              <p
                class="c-pub-toc__chapter-title"
                :class="{
                  'is-current': chapter.some(
                    (item) =>
                      item.isCurrent && item.chapter === chapter[0].chapter,
                  ),
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
              v-if="visibleStatesChapters[chapter[0].chapter]"
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
import {
  onMounted,
  onUnmounted,
  onBeforeMount,
  ref,
  reactive,
  computed,
} from "vue";
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

const visibleStatesChapters = reactive<boolean[]>(
  Object.keys(props.chapters).map(() => false),
);

// if visibleStatesChapters all true, then all chapters are open
const allChaptersOpen = computed(() =>
  Object.values(visibleStatesChapters).every((state) => state),
);

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
 * Toggle the visibility of a chapter or all chapters.
 * If no chapterNumber is provided, toggle all chapters.
 *
 * @param   {number}  chapterNumber  [chapterNumber description]
 *
 * @return  {void}                   [return description]
 */
const toggleChapterOrAll = (chapterNumber?: number): void => {
  if (chapterNumber !== undefined) {
    visibleStatesChapters[chapterNumber] =
      !visibleStatesChapters[chapterNumber];
  } else {
    const allChaptersVisible = Object.values(visibleStatesChapters).every(
      (state) => state,
    );
    visibleStatesChapters.forEach((state, index) => {
      visibleStatesChapters[index] = !allChaptersVisible;
    });
  }
};

onBeforeMount(() => {
  // for each chapter, set a boolean to false to hide the chapter, and true when one of the articles of the chapter is "isCurrent: true"
  Object.keys(props.chapters).forEach((chapter) => {
    visibleStatesChapters[+chapter] = props.chapters[+chapter].some(
      (item) => item.isCurrent,
    );
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
