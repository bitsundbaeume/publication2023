<template>
  <Flipbook
    id="flipbook"
    ref="flipbook"
    v-slot="flipbook"
    class="c-flipbook"
    :pages="pages"
    :pages-hi-res="pagesHiRes"
    :start-page="pageNum"
    @flip-left-start="onFlipLeftStart"
    @flip-left-end="onFlipLeftEnd"
    @flip-right-start="onFlipRightStart"
    @flip-right-end="onFlipRightEnd"
    @zoom-start="onZoomStart"
    @zoom-end="onZoomEnd"
  >
    <div class="c-flipbook__action-bar">
      <div class="c-flipbook__action-bar-inner">
        <a
          href="#1"
          aria-label="First page"
          class="c-flipbook__action-bar-button c-button c-button--primary is-first"
          :class="{ 'is-disabled': flipbook.page === 1 }"
        >
          <ChevronFirst />
        </a>
        <button
          :disabled="!flipbook.canFlipLeft"
          aria-label="Previous page"
          class="c-flipbook__action-bar-button c-button c-button--primary is-prev"
          :class="{ 'is-disabled': !flipbook.canFlipLeft }"
          @click="flipbook.flipLeft"
        >
          <ChevronLeft />
        </button>
        <button
          :disabled="!flipbook.canZoomIn"
          :class="{ 'is-disabled': !flipbook.canZoomIn }"
          aria-label="Zoom in"
          class="c-flipbook__action-bar-button c-button c-button--primary is-zoom-in"
          @click="flipbook.zoomIn"
        >
          <ZoomIn />
        </button>
        <span class="c-flipbook__page-num">
          Page {{ flipbook.page }} of {{ flipbook.numPages }}
        </span>
        <button
          :disabled="!flipbook.canZoomOut"
          :class="{ 'is-disabled': !flipbook.canZoomOut }"
          aria-label="Zoom out"
          class="c-flipbook__action-bar-button c-button c-button--primary is-zoom-out"
          @click="flipbook.zoomOut"
        >
          <ZoomOut />
        </button>
        <button
          :disabled="!flipbook.canFlipRight"
          aria-label="Next page"
          class="c-flipbook__action-bar-button c-button c-button--primary is-next"
          :class="{ 'is-disabled': !flipbook.canFlipRight }"
          @click="flipbook.flipRight"
        >
          <ChevronRight />
        </button>
        <a
          :href="`#${pages.length}`"
          aria-label="Last page"
          class="c-flipbook__action-bar-button c-button c-button--primary is-last"
          :class="{ 'is-disabled': flipbook.page === pages.length }"
        >
          <ChevronLast />
        </a>
      </div>
    </div>
  </Flipbook>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Flipbook from 'flipbook-vue'
import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-vue-next'

export interface FlipbookProps {
  pages: (string|null)[];
  pagesHiRes?: (string|null)[];
}

interface FlipbookInstance {
  canFlipLeft: boolean;
  canFlipRight: boolean;
  flipLeft(): void;
  flipRight(): void;
}

const prop = defineProps<FlipbookProps>()

const flipbook = ref<FlipbookInstance | null>(null)
const pageNum = ref(1)

/**
 * When the user starts to flip to the left
 *
 * @param   {number}  page
 */
const onFlipLeftStart = (page: number):void => { console.log('flip-left-start', page) }

/**
 * When the user ends flipping to the left
 *
 * @param   {number}  page
 *
 * @return  {void}
 */
const onFlipLeftEnd = (page: number):void => {
  console.log('flip-left-end', page)
  window.location.hash = `#${page}`
}

/**
 * When the user starts to flip to the right
 *
 * @param   {number}  page
 */
const onFlipRightStart = (page: number):void => { console.log('flip-right-start', page) }

/**
 * When the user ends flipping to the right
 *
 * @param   {number}  page
 *
 * @return  {void}
 */
const onFlipRightEnd = (page: number):void => {
  console.log('flip-right-end', page)
  window.location.hash = `#${page}`
}

/**
 * When the user starts to zoom
 *
 * @param   {number}  zoom
 *
 * @return  {void}
 */
const onZoomStart = (zoom: number):void => {
  console.log('zoom-start', zoom)
}

/**
 * When the user ends zooming
 *
 * @param   {number}  zoom
 *
 * @return  {[type]}
 */
const onZoomEnd = (zoom: number):void => {
  console.log('zoom-end', zoom)
}

/**
 * Set the page from the hash
 *
 * @return  {[type]}  [return description]
 */
const setPageFromHash = () => {
  const n = parseInt(window.location.hash.slice(1), 10)
  if (isFinite(n)) pageNum.value = n
}

onMounted(() => {
  window.addEventListener('keydown', (ev) => {
    if (!flipbook.value) return
    if (ev.code == 'ArrowLeft' && flipbook.value.canFlipLeft) flipbook.value.flipLeft()
    if (ev.code == 'ArrowRight' && flipbook.value.canFlipRight) flipbook.value.flipRight()
  })

  window.addEventListener('hashchange', setPageFromHash)
  setPageFromHash()
})

</script>

<style lang="scss">
@use '@styles/components/flipbook';
</style>
