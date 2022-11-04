<script setup lang="ts">
import settings from "@/settings"

defineProps<{
    collapse: boolean
}>()
</script>

<template>
    <div class="logo-container" :class="{ collapse: collapse }">
        <RouterLink class="sidebar-logo-link" to="/">
            <img src="@/assets/icons/logo.svg" class="sidebar-logo" />
            <h1 class="sidebar-title">{{ settings.title }}</h1>
        </RouterLink>
    </div>
</template>

<style lang="scss" scoped>
.logo-container {
    height: 50px;
    line-height: 50px;
    text-align: center;

    & .sidebar-logo-link {
        height: 100%;
        width: 100%;

        & .sidebar-logo {
            width: 35px;
            height: 35px;
            vertical-align: middle;
        }

        & .sidebar-title {
            display: inline-block;
            margin: 0;
            font-weight: 600;
            line-height: 50px;
            font-size: 14px;
            vertical-align: middle;
            margin-left: 12px;
        }
    }

    &.collapse {
        .sidebar-logo {
            margin-right: 0px;
        }

        .sidebar-title {
            display: none;
        }
    }
}
</style>