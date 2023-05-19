<template>
  <nav
    ref="mainNav"
    class="c-main-nav"
  >
    <button
      type="button"
      class="c-main-nav__toggle c-button c-button--icon"
      aria-label="Menu öffnen"
      :aria-expanded="isOpen"
      @click="toggleFlyout"
    >
      <span class="c-main-nav__toggle-label">Menü</span>
      <MenuIcon />
    </button>

    <Transition name="fade">
      <div
        v-show="isOpen"
        class="c-main-nav__flyout"
      >
        <MenuNav
          :menu-items="menuItems"
          class="c-main-nav__menu"
          :class="{ 'is-open': isOpen }"
        />
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import MenuNav from '@components/menu-nav/MenuNav.vue';
import { Menu as MenuIcon } from 'lucide-vue-next';

export interface MainNavProps {
  menuItems: [
    {
      label: string;
      path: string;
      childItems: [
        {
          label: string;
          path: string;
        }
      ];
    }
  ];
}

const props = defineProps<MainNavProps>()

const isOpen = ref(false);

const mainNav = ref(null);

let flyoutHeight = ref('');

/**
 * Toggle the flyout menu
 *
 * @return  {void}
 */
const toggleFlyout = (): void => {
  isOpen.value = !isOpen.value;
  controlScroll(isOpen.value);
}


/**
 * Toggle disable scroll on body
 *
 * @param   {boolean}  status  yes/no
 *
 * @return  {void}
 */
const controlScroll = (status: boolean): void => {
  if (status) document.body.style.overflow = 'hidden';
  if (!status) document.body.removeAttribute('style');
};

/**
 * Calculate the height of the flyout menu
 *
 * @return  {void}
 */
const resizeObserver = new ResizeObserver(() => {
  const viewportHeight = window.innerHeight;
  const logoHeight = document.querySelector('.c-logo')?.getBoundingClientRect().height;
  const mainNavToggleHeight = document.querySelector('.c-main-nav__toggle')?.getBoundingClientRect().height;
  const headerElementsHeight = logoHeight && mainNavToggleHeight ? logoHeight + mainNavToggleHeight : 0;
  const remainingHeight = viewportHeight - headerElementsHeight;

  flyoutHeight.value = remainingHeight + 'px';

  if (window.innerWidth > 768) {
    isOpen.value = false;
    controlScroll(false)
  }
});

onMounted(() => {
  const body = document.querySelector('body') as HTMLElement;
  resizeObserver.observe(body);
})

onUnmounted(() => {
  resizeObserver.disconnect();
})
</script>

<style lang="scss">
@use '@styles/components/main-nav';

.c-main-nav {
  &__flyout {
    --height-flyout: v-bind(flyoutHeight);
  }
}
</style>
