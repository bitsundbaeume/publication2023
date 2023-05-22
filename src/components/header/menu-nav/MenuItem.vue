<template>
  <li
    :class="[
      'c-menu__item',
      {
        'has-child': props.menuItem.childItems && props.menuItem.childItems.length > 0,
        'is-active': isCurrentPath,
        'has-visible-child': isOpen
      }
    ]"
    role="menuitem"
    tabindex="-1"
    @mouseenter="direction($event)"
    @focus="direction($event)"
    @mouseleave="direction($event)"
    @blur="direction($event)"
  >
    <a
      v-if="!props.menuItem.childItems"
      :href="props.menuItem.path"
      class="c-menu__link"
    >
      {{ props.menuItem.label }}
    </a>

    <template v-else>
      <a
        class="c-menu__link is-menu-title"
        role="button"
        tabindex="0"
        @click.prevent="toggleMenuItem"
        @keydown="toggleMenuItem"
      >
        <span>{{ props.menuItem.label }}</span>
      </a>

      <MenuSubmenu
        ref="submenu"
        :is-open="isOpen"
        :class="[`is-level-${depth}`, { 'is-open': isOpen }]"
      >
        <template
          v-for="(child, childIndex) in props.menuItem.childItems"
          :key="childIndex"
        >
          <MenuItem
            :menu-item="child"
            :depth="depth + 1"
            @click="toggleMenuItem"
          />
        </template>
      </MenuSubmenu>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import MenuSubmenu from '@components/header/menu-nav/MenuSubmenu.vue';
import { onClickOutside } from '@vueuse/core';

export interface MenuItemProps {
  menuItem: {
    label: string;
    path: string;
    childItems?: [
      {
        label: string;
        path: string;
      }
    ];
  };
  depth: number;
}

const props = defineProps<MenuItemProps>()

const isOpen = ref(false)
const isCurrentPath = ref(false)
const submenu = ref(null)

/**
 * If the user clicks outside the submenu, close the submenu
 *
 * @return  {void}
 */
onClickOutside(submenu, (event): void => {
  // const targetPath = event.composedPath();
  // const ignoreNode = document.querySelector('.c-menu__item.has-child');
  // if (ignoreNode && !targetPath.includes(ignoreNode)) {
  //   isOpen.value = false
  // }
  isOpen.value = false
})

/**
  * Toggle the submenu
  *
  * @return  {void}
  */
const toggleMenuItem = (): void => {
  isOpen.value = !isOpen.value;
}

// TODO: add direction control
const direction = (event) => {
  const el = event.target.getBoundingClientRect();
  const left = el.left;
  const width = el.width;
  const windowHeight = window.innerHeight;
  const windowWidth = window.innerWidth;
  console.log('direction', left + width, windowWidth);
  console.log(left + width <= windowWidth);


}

onMounted(() => {
  if (import.meta.env.DEV) {
    isCurrentPath.value = window.location.pathname.slice(1) === props.menuItem.path.replace(/^\//gm, '');
  } else {

    isCurrentPath.value = window.location.pathname.replace(/^\/|\/$/gm, '') === props.menuItem.path.replace(/^\//gm, '');
  }
})
</script>
