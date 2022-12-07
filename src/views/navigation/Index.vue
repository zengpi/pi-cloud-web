<script setup lang="ts">
import useStore from "@/stores";

import settings from "@/settings";

import Sidebar from "./sidebar/Index.vue";
import Toolbar from "./toolbar/Index.vue";
import Tab from "./Tab.vue";
import MainBody from "./MainBody.vue";

const { useAppStore } = useStore();
</script>

<template>
  <div
    :class="{ 'sidebar-collapsed': useAppStore.sidebarCollapsed }"
    class="navigation-container"
  >
    <Sidebar />

    <div class="sizebar-right">
      <div :class="{ 'fixed-header': settings.fixedHeader }">
        <Toolbar />
        <Tab />
      </div>
      <MainBody />
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/assets/styles/variables.scss";

.navigation-container {
  height: 100%;
  width: 100%;

  .sizebar-right {
    height: 100%;
    transition: margin-left 0.25s;
    margin-left: $sidebar-width;

    .fixed-header {
      position: fixed;
      width: calc(100% - $sidebar-width);
      top: 0;
      right: 0;
      z-index: 9;
    }
  }
}
</style>
