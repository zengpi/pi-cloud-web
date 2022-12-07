<script setup lang="ts">
import { ref } from "vue";

import { Search } from "@element-plus/icons-vue";

import SvgIcon from "@/components/SvgIcon.vue";

const modules = import.meta.glob("../assets/icons/*.svg");

const re = /.*\/assets\/icons\/(.*)\.svg/;

/**
 * ../assets/icons 文件夹中的所有 icon
 */
const allIcons: string[] = [];
/**
 * 可选 icon，通常是条件过滤后的 icon 列表
 */
const optionalIcons = ref(allIcons);
/**
 * 搜索值
 */
const icon = ref("");

const emit = defineEmits(["select"]);

for (const path in modules) {
  let iconParseRst = re.exec(path);
  if (iconParseRst && iconParseRst.length > 1) {
    allIcons.push(iconParseRst[1]);
  }
}

function filterIcons() {
  optionalIcons.value = allIcons;
  if (icon.value) {
    optionalIcons.value = allIcons.filter(
      (item) => item.indexOf(icon.value) !== -1
    );
  }
}

function selectIcon(name: string) {
  emit("select", name);
  document.body.click();
}

function reset() {
  icon.value = "";
  optionalIcons.value = allIcons;
}

defineExpose({
  reset,
});
</script>

<template>
  <div class="icon-select">
    <el-input
      v-model="icon"
      clearable
      placeholder="请输入图标名称"
      :prefix-icon="Search"
      @clear="filterIcons"
      @input="filterIcons"
    />
    <el-scrollbar class="icon-select__list">
      <div
        v-for="(item, index) in optionalIcons"
        :key="index"
        @click="selectIcon(item)"
      >
        <SvgIcon :name="item" height="30px" style="margin-right: 5px" />
        <span>{{ item }}</span>
      </div>
    </el-scrollbar>
  </div>
</template>

<style lang="scss" scoped>
.icon-select {
  width: 100%;

  &__list {
    height: 200px;

    div {
      height: 30px;
      line-height: 30px;
      cursor: pointer;
      width: 33%;
      float: left;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    span {
      display: inline-block;
      vertical-align: -0.15em;
      fill: currentColor;
      overflow: hidden;
    }
  }
}
</style>
