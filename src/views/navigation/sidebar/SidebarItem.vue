<script setup lang="ts">
import path from "path-browserify";

import { isExternalLink } from "@/util/validate";
import { genTitle } from "@/util/i18n";

import { MenuTypeEnum } from "@/entity/enums";

import RouterLink from "./RouterLink.vue";
import SvgIcon from "@/components/SvgIcon.vue";

const props = defineProps<{
  item: any;
  basePath: string;
}>();

function resolvePath(routePath: string) {
  if (isExternalLink(routePath)) {
    return routePath;
  }
  if (isExternalLink(props.basePath)) {
    return props.basePath;
  }
  let basePath = props.basePath;
  if (!basePath) basePath = "/";
  return path.resolve(basePath, routePath);
}
</script>

<template>
  <div v-if="!item.meta">
    <SidebarItem
      v-for="child in item.children"
      :key="child.path"
      :item="child"
      :base-path="resolvePath(child.path)"
    />
  </div>

  <div v-else-if="item.meta && !item.meta.hidden">
    <template v-if="!item.meta.type || item.meta.type === MenuTypeEnum.MENU">
      <RouterLink :to="basePath">
        <el-menu-item :index="basePath">
          <el-icon>
            <SvgIcon v-if="item.meta.icon" :name="item.meta.icon" />
          </el-icon>
          <template #title>
            {{ genTitle(item.meta.title) }}
          </template>
        </el-menu-item>
      </RouterLink>
    </template>

    <el-sub-menu v-else :index="resolvePath(item.path)">
      <template #title>
        <el-icon>
          <SvgIcon
            v-if="item.meta && item.meta.icon"
            :name="item.meta.icon"
          ></SvgIcon>
        </el-icon>
        <span>{{ genTitle(item.meta.title) }}</span>
      </template>
      <SidebarItem
        v-for="child in item.children"
        :key="child.path"
        :item="child"
        :base-path="resolvePath(child.path)"
      />
    </el-sub-menu>
  </div>
</template>

<style lang="scss" scoped></style>
