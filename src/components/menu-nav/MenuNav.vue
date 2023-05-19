<template>
  <menu
    class="c-menu u-list-reset"
    role="menu"
  >
    <template
      v-for="(item, index) in props.menuItems"
      :key="index"
    >
      <MenuItem
        :menu-item="item"
        :depth="0"
      />
    </template>
  </menu>
</template>

<script setup lang="ts">
import MenuItem from '@components/menu-nav/MenuItem.vue';

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
</script>

<style lang="scss">
@use '@styles/components/menu';
</style>
