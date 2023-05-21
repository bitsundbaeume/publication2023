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
      <img
        src="src/images/icons/menu-button.svg"
        alt="Menu Icon"
      >
    </button>
    <Teleport
      v-if="isMobile"
      to="#mobileNav"
    >
      <Transition name="fade">
        <div
          v-show="isOpen"
          class="c-main-nav__flyout"
          :class="{ 'is-open': isOpen }"
        >
          <MenuNav
            :menu-items="menuItems"
            class="c-main-nav__menu"
            :class="{ 'is-open': isOpen }"
          />
        </div>
      </Transition>
    </Teleport>
    <Transition
      v-else
      name="fade"
    >
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
import MenuNav from '@components/header/menu-nav/MenuNav.vue';

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
const flyoutHeight = ref('');
const isMobile = ref(false);

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
  const headerInnerHeight = document.querySelector('.c-header__inner')?.getBoundingClientRect().height;
  const headerInner = headerInnerHeight ? headerInnerHeight : 0;
  const remainingHeight = viewportHeight - headerInner;

  flyoutHeight.value = `${remainingHeight}px`;
  isMobile.value = window.innerWidth < 768;

  if (!isMobile.value) {
    isOpen.value = false;

    controlScroll(false)
  }
});

onMounted(() => {
  isMobile.value = window.innerWidth < 768;

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
