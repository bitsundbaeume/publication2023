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
        @click="toggleMenuItem"
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
          />
        </template>
      </MenuSubmenu>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import MenuSubmenu from '@components/menu-nav/MenuSubmenu.vue';
import { ChevronRight } from 'lucide-vue-next';
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
 * @return  {void}  [return description]
 */
onClickOutside(submenu, (event) => {
  const targetPath = event.composedPath();
  const ignoreNode = document.querySelector('.c-menu__item.has-child');
  if (ignoreNode && !targetPath.includes(ignoreNode)) {
    isOpen.value = false
  }
})

/**
  * Toggle the submenu
  *
  * @return  {void}
  */
const toggleMenuItem = (): void => {
  isOpen.value = !isOpen.value;
}

onMounted(() => {
  if (import.meta.env.DEV) {
    isCurrentPath.value = window.location.pathname.slice(1) === props.menuItem.path.replace(/^\//gm, '');
  } else {

    isCurrentPath.value = window.location.pathname.replace(/^\/|\/$/gm, '') === props.menuItem.path.replace(/^\//gm, '');
  }
})
</script>
