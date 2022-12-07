<script setup lang="ts">
import { computed } from "vue";

const props = withDefaults(
  defineProps<{
    prefix?: string;
    name: string;
    color?: string;
    width?: string;
    height?: string;
  }>(),
  {
    prefix: "icon",
    color: "",
    width: "1em",
    height: "1em",
  }
);

const symbolId = computed(() => `#${props.prefix}-${props.name}`);
</script>

<template>
  <svg aria-hidden="true" :width="width" :height="height" class="svg-icon">
    <use :xlink:href="symbolId" :fill="color" />
  </svg>
</template>

<style scoped>
.svg-icon {
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>
