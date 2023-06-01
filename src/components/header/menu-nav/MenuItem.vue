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
  >
    <a
      v-if="!props.menuItem.childItems"
      :href="props.menuItem.path"
      class="c-menu__link"
      @click="$emit('menuItemTargetClicked', true)"
    >
      {{ props.menuItem.label }}
    </a>

    <template v-else>
      <a
        :ref="`menu-title-${depth}${index}`"
        class="c-menu__link is-menu-title"
        role="button"
        tabindex="0"
        @click="toggleMenuItem"
        @keydown="toggleMenuItem"
      >
        {{ props.menuItem.label }}
      </a>

      <MenuSubmenu
        ref="submenu"
        :is-open="isOpen"
        :class="[`is-level-${depth}`, { 'is-open': isOpen }]"
      >
        <template
          v-for="(child, childItemIndex) in props.menuItem.childItems"
          :key="child.label"
        >
          <MenuItem
            :menu-item="child"
            :depth="depth + 1"
            :index="childItemIndex"
            @click="toggleMenuItem(); $emit('menuItemTargetClicked', true)"
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
  index: number;
}

const props = defineProps<MenuItemProps>()

const isOpen = ref(false)
const isCurrentPath = ref(false)
const submenu = ref(null)

const emit = defineEmits(['submenuState', 'menuItemTargetClicked'])

/**
 * If the user clicks outside the submenu, close the submenu
 *
 * @param   {[type]}  submenu
 * @param   {[type]}  event
 *
 * @return  {void}             [return description]
 */
onClickOutside(submenu, (event): void => {
  if ((event.target as Element).classList.contains('is-menu-title')) return;

  isOpen.value = false

  emit('submenuState', isOpen.value)
})

/**
  * Toggle the submenu
  *
  * @return  {void}
  */
const toggleMenuItem = (): void => {
  isOpen.value = !isOpen.value;

  emit('submenuState', isOpen.value)
}

// TODO: add direction control
// const direction = (event) => {
//   const el = event.target.getBoundingClientRect();
//   const left = el.left;
//   const width = el.width;
//   const windowHeight = window.innerHeight;
//   const windowWidth = window.innerWidth;
//   console.log('direction', left + width, windowWidth);
//   console.log(left + width <= windowWidth);
// }

onMounted(() => {
  if (import.meta.env.DEV) {
    isCurrentPath.value = window.location.pathname.slice(1) === props.menuItem.path.replace(/^\//gm, '');
  } else {

    isCurrentPath.value = window.location.pathname.replace(/^\/|\/$/gm, '') === props.menuItem.path.replace(/^\//gm, '');
  }
})
</script>
