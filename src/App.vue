<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { RouterView } from "vue-router";
import { ElConfigProvider } from "element-plus";
import useStore from "@/stores";

// 导入 Element Plus 语言包
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

const { useAppStore } = useStore();
const locale = computed(() => useAppStore.locale);
const size: any = computed(() => useAppStore.size);

const localeModule = ref();

watch(
  locale,
  (val) => {
    localeModule.value = val == "en" ? en : zhCn;
  },
  { immediate: true }
);
</script>

<template>
  <ElConfigProvider :locale="localeModule" :size="size">
    <RouterView />
  </ElConfigProvider>
</template>
