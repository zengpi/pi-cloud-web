<script setup lang="ts">
import { isExternalLink } from "@/util/validate";
import { useRouter } from "vue-router";

const props = defineProps<{
  to: string;
}>();

const router = useRouter();
</script>

<template>
  <a v-if="isExternalLink(to)" :href="to" target="_blank">
    <slot />
  </a>
  <div v-else @click="router.push(props.to)">
    <slot />
  </div>
</template>
