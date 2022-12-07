<script setup lang="ts">
import useStore from "@/stores";

const { useTabStore } = useStore();
</script>

<template>
  <section class="main-body-container">
    <RouterView v-slot="{ Component, route }">
      <transition name="router-fade" mode="out-in">
        <keep-alive :include="useTabStore.cachedTabs">
          <component :is="Component" :key="route.fullPath" />
        </keep-alive>
      </transition>
    </RouterView>
  </section>
</template>

<style lang="scss" scoped>
.main-body-container {
  min-height: calc(100vh - 101px);
  width: 100%;
}

.fixed-header + .main-body-container {
  padding-top: 90px;
}
</style>
