<template>
  <nav ref="mainNav" class="c-main-nav">
    <button
      type="button"
      class="c-main-nav__toggle c-button c-button--icon"
      aria-label="Open Menu"
      :aria-expanded="flyoutIsOpen"
      @click="toggleFlyout"
    >
      <img
        src="/images/icons/menu-button.svg"
        alt="Menu Icon"
        width="39"
        height="21"
      />
    </button>
    <Teleport v-if="isMobile" to="#mobileNav">
      <Transition name="fade">
        <div
          v-show="flyoutIsOpen"
          class="c-main-nav__flyout"
          :class="{ 'is-open': flyoutIsOpen }"
        >
          <MenuNav
            :menu-items="menuItems"
            class="c-main-nav__menu"
            :class="{ 'is-open': flyoutIsOpen }"
            @submenu-state="submenuIsOpen = $event"
            @menu-item-target-clicked="toggleFlyout"
          />
        </div>
      </Transition>
    </Teleport>
    <Transition v-else name="fade">
      <div v-show="flyoutIsOpen" class="c-main-nav__flyout">
        <MenuNav
          :menu-items="menuItems"
          class="c-main-nav__menu"
          :class="{ 'is-open': flyoutIsOpen }"
          @submenu-state="submenuIsOpen = $event"
        />
      </div>
    </Transition>
  </nav>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import MenuNav from "@components/header/menu-nav/MenuNav.vue";
import type { MenuProps } from "@components/header/menu-nav/MenuNav.vue";

defineProps<MenuProps>();
const flyoutIsOpen = ref(false);
const flyoutHeight = ref("");
const mainNav = ref(null);
const isMobile = ref(false);
const submenuIsOpen = ref(false);

/**
 * Toggle the flyout menu
 *
 * @return  {void}
 */
const toggleFlyout = (): void => {
  flyoutIsOpen.value = !flyoutIsOpen.value;
  controlScroll(flyoutIsOpen.value);
};

/**
 * Toggle disable scroll on body
 *
 * @param   {boolean}  status  yes/no
 *
 * @return  {void}
 */
const controlScroll = (status: boolean): void => {
  if (status) document.body.style.overflow = "hidden";
  if (!status) document.body.removeAttribute("style");
};

/**
 * Calculate the height of the flyout menu
 *
 * @return  {void}
 */
const resizeObserver = new ResizeObserver(() => {
  const viewportHeight = window.innerHeight;
  const headerInnerHeight = document
    .querySelector(".c-header__inner")
    ?.getBoundingClientRect().height;
  const headerInner = headerInnerHeight ? headerInnerHeight : 0;
  const remainingHeight = viewportHeight - headerInner;

  flyoutHeight.value = `${remainingHeight}px`;
  isMobile.value = window.innerWidth < 769;

  if (!isMobile.value) {
    flyoutIsOpen.value = false;

    controlScroll(false);
  }
});

onMounted(() => {
  isMobile.value = window.innerWidth < 769;

  const body = document.querySelector("body") as HTMLBodyElement;
  resizeObserver.observe(body);
});

onUnmounted(() => {
  resizeObserver.disconnect();
});
</script>

<style lang="scss">
@use "@styles/components/main-nav";

.c-main-nav {
  &__flyout {
    // stylelint-disable-next-line
    --height-flyout: v-bind(flyoutHeight);
  }
}
</style>
