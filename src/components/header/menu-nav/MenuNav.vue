<template>
  <menu class="c-menu u-list-reset" role="menu">
    <template v-for="(item, index) in props.menuItems" :key="item.label">
      <MenuItem
        :menu-item="item"
        :depth="0"
        :index="index"
        @submenu-state="$emit('submenuState', $event)"
        @menu-item-target-clicked="$emit('menuItemTargetClicked', $event)"
      />
    </template>
  </menu>
</template>

<script setup lang="ts">
import MenuItem from "@components/header/menu-nav/MenuItem.vue";

export interface MenuProps {
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

const props = defineProps<MenuProps>();

defineEmits<{
  submenuState: [isOpen: boolean];
  "submenu-state": [isOpen: boolean];
  menuItemTargetClicked: [value: boolean];
}>();
</script>

<style lang="scss">
@use "@styles/components/menu";
</style>
