<script setup lang="ts">
import { onMounted, ref } from "vue";

import { ElMessage, ElTable } from "element-plus";
import { Search, RefreshLeft } from "@element-plus/icons-vue";

import { getOptionalUsers } from "@/api/system/user";

import { BaseQuery } from "@/entity";
import type { OptionalUser } from "@/entity/system/user";

const emits = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "select", optionalUsers: Array<OptionalUser>): void;
}>();

const props = defineProps<{
  dialogVisible: boolean;
  id?: number;
  name?: string;
}>();

const title = `为 ${props.name} 分配成员`;

const query = ref(new BaseQuery());

const table = ref(ElTable);
const tableData = ref<Array<OptionalUser>>([]);
const total = ref(0);
const loading = ref(false);

function handleClose() {
  emits("update:dialogVisible", false);
}

function handleConfirm() {
  const rows = table.value.getSelectionRows();

  if (!rows || rows.length === 0) {
    ElMessage.warning("请至少选择一条记录");
    return;
  }
  handleClose();
  emits("select", rows);
}

function loadData() {
  loading.value = true;

  getOptionalUsers(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  query.value = new BaseQuery();
  loadData();
}

function handleDblclick(row: OptionalUser) {
  handleClose();
  emits("select", [row]);
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="handleClose"
    width="40%"
  >
    <div class="head-container">
      <div class="query">
        <el-input
          v-model.trim="query.keyWord"
          clearable
          placeholder="用户名/昵称/部门"
          class="query-item"
          style="width: auto"
          @keyup.enter="loadData"
        />
        <el-button
          type="success"
          :icon="Search"
          class="query-item"
          @click="loadData"
        >
          搜索</el-button
        >
        <el-button
          type="warning"
          :icon="RefreshLeft"
          class="query-item"
          @click="handleResetQuery"
          >重置
        </el-button>
      </div>
    </div>
    <el-table
      ref="table"
      stripe
      :data="tableData"
      v-loading="loading"
      @row-dblclick="handleDblclick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="deptName" label="部门名称" />
    </el-table>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="handleClose">取消</el-button>
        <el-button type="primary" @click="handleConfirm">确认</el-button>
      </span>
    </template>
  </el-dialog>
</template>
<style scoped lang="scss">
.query {
  text-align: right;
}
</style>
