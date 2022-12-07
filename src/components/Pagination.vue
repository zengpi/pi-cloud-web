<template>
  <div class="pagination">
    <el-pagination
      :total="total"
      v-model:current-page="page"
      v-model:page-size="limit"
      :layout="layout"
      :page-sizes="pageSizes"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from "vue";

const props = withDefaults(
  defineProps<{
    /**
     * 总条目数
     */
    total: number;
    /**
     * 当前页数，支持 v-model 双向绑定
     */
    currentPage: number;
    /**
     * 每页显示条目个数，支持 v-model 双向绑定
     */
    pageSize: number;
    /**
     * 每页显示个数选择器的选项设置
     */
    pageSizes?: number[];
    /**
     * 组件布局，子组件名用逗号分隔
     */
    layout?: string;
  }>(),
  {
    total: 0,
    currentPage: 1,
    pageSize: 10,
    pageSizes: () => [10, 20, 30, 50, 100],
    layout: "total, sizes, currentPage, prev, pager, next, jumper",
    autoScroll: true,
  }
);

const emit = defineEmits([
  "update:currentPage",
  "update:pageSize",
  "pagination",
]);

const page = ref(props.currentPage);
const limit = ref(props.pageSize);

watch([page, limit], async ([newPage, newLimit]) => {
  emit("update:currentPage", newPage);
  emit("update:pageSize", newLimit);
  emit("pagination");
});
</script>
