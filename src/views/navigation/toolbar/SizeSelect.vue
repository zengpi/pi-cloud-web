<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";

import useStore from "@/stores";
import { ComponentsSizeEnum } from "@/entity/enums";
import i18n from "@/locale";

import SvgIcon from "@/components/SvgIcon.vue";

const { useAppStore } = useStore();
const size = computed(() => useAppStore.size);

const sizeOptions = computed(() => [
  { label: i18n.global.t("size.default"), value: ComponentsSizeEnum.DEFAULT },
  { label: i18n.global.t("size.large"), value: ComponentsSizeEnum.LARGE },
  { label: i18n.global.t("size.small"), value: ComponentsSizeEnum.SMALL },
]);

function handleClick(size: string) {
  useAppStore.setSize(size);
  ElMessage.success(i18n.global.t("tip.switchSizeSuccess"));
}
</script>

<template>
  <el-dropdown class="size-select" trigger="hover" @command="handleClick">
    <SvgIcon name="size" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="item of sizeOptions"
          :key="item.value"
          :disabled="(size || 'default') == item.value"
          :command="item.value"
        >
          {{ item.label }}
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
