<template>
  <li
    ref="menuItemRef"
    :class="[
      'c-menu__item',
      {
        'has-child':
          props.menuItem.childItems && props.menuItem.childItems.length > 0,
        'is-active': isCurrentPath,
        'has-visible-child': isOpen,
      },
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
      <button
        :ref="`menu-title-${depth}${index}`"
        class="c-menu__link is-menu-title"
        tabindex="0"
        @click="toggleMenuItem"
      >
        {{ props.menuItem.label }}
      </button>

      <MenuSubmenu
        ref="submenu"
        :is-open="isOpen"
        :class="[
          `is-level-${depth} is-${submenuDirection}`,
          { 'is-open': isOpen },
        ]"
      >
        <template
          v-for="(child, childItemIndex) in props.menuItem.childItems"
          :key="child.label"
        >
          <MenuItem
            :menu-item="child"
            :depth="depth + 1"
            :index="childItemIndex"
            @click="
              toggleMenuItem();
              $emit('menuItemTargetClicked', true);
            "
          />
        </template>
      </MenuSubmenu>
    </template>
  </li>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import MenuSubmenu from "@components/header/menu-nav/MenuSubmenu.vue";
import { onClickOutside } from "@vueuse/core";

export interface MenuItemData {
  label: string;
  path?: string;
  childItems?: MenuItemData[];
}

export interface MenuItemProps {
  menuItem: MenuItemData;
  depth: number;
  index: number;
}

const props = defineProps<MenuItemProps>();

const isOpen = ref(false);
const isCurrentPath = ref(false);
const menuItemRef = ref(null);
const submenuDirection = ref("right");

const emit = defineEmits<{
  submenuState: [isOpen: boolean];
  "submenu-state": [isOpen: boolean];
  menuItemTargetClicked: [value: boolean];
  "menu-item-target-clicked": [value: boolean];
}>();

/**
 * Close the submenu when clicking outside of it
 *
 * @param   {[type]}  menuItemRef
 *
 * @return  {void}
 */
onClickOutside(menuItemRef, (): void => {
  isOpen.value = false;

  emit("submenuState", isOpen.value);
});

/**
 * Toggle the submenu
 *
 * @return  {void}
 */
const toggleMenuItem = (): void => {
  isOpen.value = !isOpen.value;

  emit("submenuState", isOpen.value);
  setTimeout(() => {
    const submenuEl = document.querySelector(".c-submenu");
    const submenuRect = submenuEl?.getBoundingClientRect();
    const left = submenuRect?.left;
    const width = submenuRect?.width;
    const windowWidth = window.innerWidth;

    submenuDirection.value =
      left !== undefined && width !== undefined && left + width > windowWidth
        ? "left"
        : "right";
  }, 100);
};

onMounted(() => {
  if (import.meta.env.DEV) {
    isCurrentPath.value =
      window.location.pathname.slice(1) ===
      props.menuItem?.path?.replace(/^\//gm, "");
  } else {
    isCurrentPath.value =
      window.location.pathname.replace(/^\/|\/$/gm, "") ===
      props.menuItem?.path?.replace(/^\//gm, "");
  }
});
</script>
