<template>
  <Flipbook
    ref="flipbook"
    v-slot="flipbook"
    class="c-flipbook"
    :pages="pages"
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
      </div>
    </div>
  </Flipbook>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Flipbook from 'flipbook-vue'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-vue-next'

const flipbook = ref(null)
const flipbookContentHeight = ref('')
const pageNum = ref(0)

// Example pages
const pages = [
  'src/pdfs/jpg/0001.jpg',
  'src/pdfs/jpg/0002.jpg',
  'src/pdfs/jpg/0003.jpg',
  'src/pdfs/jpg/0004.jpg',
  'src/pdfs/jpg/0005.jpg',
  'src/pdfs/jpg/0006.jpg',
  'src/pdfs/jpg/0007.jpg',
  'src/pdfs/jpg/0008.jpg',
  'src/pdfs/jpg/0009.jpg',
  'src/pdfs/jpg/0010.jpg',
  'src/pdfs/jpg/0011.jpg'
]

/**
 * When the user starts to flip to the left
 *
 * @param   {number}  page             [page description]
 * @param   {[type]}  flip-left-start  [flip-left-start description]
 * @param   {[type]}  page             [page description]
 *
 * @return  {[type]}                   [return description]
 */
const onFlipLeftStart = (page: number) => { console.log('flip-left-start', page) }

/**
 * When the user ends flipping to the left
 *
 * @param   {number}  page  [page description]
 *
 * @return  {[type]}        [return description]
 */
const onFlipLeftEnd = (page: number) => {
  console.log('flip-left-end', page)
  window.location.hash = `#${page}`
}

/**
 * When the user starts to flip to the right
 *
 * @param   {number}  page              [page description]
 * @param   {[type]}  flip-right-start  [flip-right-start description]
 * @param   {[type]}  page              [page description]
 *
 * @return  {[type]}                    [return description]
 */
const onFlipRightStart = (page: number) => { console.log('flip-right-start', page) }

/**
 * When the user ends flipping to the right
 *
 * @param   {number}  page  [page description]
 *
 * @return  {[type]}        [return description]
 */
const onFlipRightEnd = (page: number) => {
  console.log('flip-right-end', page)
  window.location.hash = `#${page}`
}

/**
 * When the user starts to zoom
 *
 * @param   {number}  zoom  [zoom description]
 *
 * @return  {[type]}        [return description]
 */
const onZoomStart = (zoom: number) => {
  console.log('zoom-start', zoom)
}

/**
 * When the user ends zooming
 *
 * @param   {number}  zoom  [zoom description]
 *
 * @return  {[type]}        [return description]
 */
const onZoomEnd = (zoom: number) => {
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

const resizeObserver = new ResizeObserver(() => {
  const flipbookEl = document.querySelector('.c-flipbook .bounding-box')

  console.log(flipbookEl.getBoundingClientRect().height);
  flipbookContentHeight.value = `${flipbookEl.getBoundingClientRect().height}px`
  // const viewportHeight = window.innerHeight;
  // const logoHeight = document.querySelector('.c-logo')?.getBoundingClientRect().height;
  // const mainNavToggleHeight = document.querySelector('.c-main-nav__toggle')?.getBoundingClientRect().height;
  // const headerElementsHeight = logoHeight && mainNavToggleHeight ? logoHeight + mainNavToggleHeight : 0;
  // const remainingHeight = viewportHeight - headerElementsHeight;

  // flyoutHeight.value = `${remainingHeight}px`;

  // if (window.innerWidth > 768) {
  //   isOpen.value = false;
  //   controlScroll(false)
  // }
});

onMounted(() => {
  window.addEventListener('keydown', (ev) => {
    if (!flipbook.value) return
    if (ev.code == 'ArrowLeft' && flipbook.value.canFlipLeft) flipbook.value.flipLeft()
    if (ev.code == 'ArrowRight' && flipbook.value.canFlipRight) flipbook.value.flipRight()
  })

  window.addEventListener('hashchange', setPageFromHash)
  setPageFromHash()

  // const flipbookEl = document.querySelector('body') as HTMLElement;
  // resizeObserver.observe(flipbookEl);
})

</script>

<style lang="scss">
@use '@styles/components/flipbook';

// .c-flipbook {
//   min-height: v-bind(flipbookContentHeight);
// }
</style>
