<script setup lang="ts">
import { useRoute } from 'vue-router';

import useStore from '@/stores';

import Logo from "./Logo.vue"
import SidebarItem from './SidebarItem.vue';

import settings from "@/settings"

const { useAppStore, useRouterStore } = useStore();
const route = useRoute();
</script>

<template>
    <div :class="{ 'has-logo': settings.showLogo }" class="sidebar-container">
        <Logo v-if="settings.showLogo" :collapse="useAppStore.sidebarCollapsed" />

        <el-scrollbar class="scrollbar">
            <el-menu :default-active="route.path" :collapse="useAppStore.sidebarCollapsed" :collapse-transition="false">
                <SidebarItem v-for="route in useRouterStore.routers" :item="route" :key="route.path"
                    :base-path="route.path" />
            </el-menu>
        </el-scrollbar>
    </div>
</template>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.sidebar-container {
    width: $sidebar-width !important;
    height: 100%;
    position: fixed;
    overflow: hidden;
    z-index: 1001;
    box-shadow: 10px 0 10px -10px #b5c4d3;

    .el-menu {
        border: none;
        height: 100%;
        width: 100%;
    }
}

.has-logo {
    .scrollbar {
        height: calc(100% - 50px) !important;
    }
}
</style>