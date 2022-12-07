<script setup lang="ts">
import { onBeforeMount, ref, watch } from "vue";
import { useRoute, type RouteLocationMatched } from "vue-router";
import { ArrowRight } from "@element-plus/icons-vue";
import { compile } from "path-to-regexp";

import router from "@/router";
import { genTitle } from "@/util/i18n";

const route = useRoute();

const breadcrumbs = ref([] as Array<RouteLocationMatched>);

watch(
  () => route.path,
  (path) => {
    if (path.startsWith("/redirect/")) {
      return;
    }
    getBreadcrumb();
  }
);

function getBreadcrumb() {
  breadcrumbs.value = route.matched.filter(
    (value) => value.meta && value.meta.title
  );
}

function handleClick(breadcrumb: any) {
  const { redirect, path } = breadcrumb;
  if (redirect) {
    router.push(redirect);
    return;
  }
  router.push(pathCompile(path));
}

const pathCompile = (path: string) => {
  const { params } = route;
  const toPath = compile(path);
  return toPath(params);
};

onBeforeMount(() => {
  getBreadcrumb();
});
</script>

<template>
  <el-breadcrumb class="app-breadcrumb" :separator-icon="ArrowRight">
    <el-breadcrumb-item
      v-for="(breadcrumb, index) in breadcrumbs"
      :key="breadcrumb.path"
    >
      <span v-if="index === breadcrumbs.length - 1">{{
        genTitle(breadcrumb.meta.title)
      }}</span>
      <a v-else @click.prevent="handleClick(breadcrumb)">
        {{ genTitle(breadcrumb.meta.title) }}
      </a>
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  line-height: 50px;
  margin-left: 8px;
  float: left;
}
</style>
