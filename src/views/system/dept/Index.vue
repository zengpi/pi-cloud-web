<script setup lang="ts" name="SystemDept">
import { ref, onMounted } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Plus,
  Delete,
  Edit,
  Refresh,
} from "@element-plus/icons-vue";

import { BaseDialog } from "@/entity";
import { Query, DeptTree } from "@/entity/system/dept";

import { getDeptTree, deleteDept } from "@/api/system/dept";

import Form from "./Form.vue";

const showQuery = ref(true);
const query = ref(new Query());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const tableData = ref<DeptTree[]>([]);
const loading = ref(false);

const formDialog = ref(new BaseDialog<DeptTree>());

function loadData() {
  loading.value = true;

  getDeptTree(query.value)
    .then(({ data }) => {
      tableData.value = data;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  query.value = new Query();
  loadData();
}

function handleAdd() {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
}

function handleEdit(row: DeptTree) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: DeptTree) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel(row.id.toString());
}

function handleDelBatch() {
  const rows: Array<DeptTree> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: DeptTree) => e.id).join(","));
}

function doDel(ids: string) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteDept(ids)
      .then(() => {
        ElMessage.success("删除成功");
        loadData();
        delBtnLoading.value = false;
      })
      .catch(() => {
        delBtnLoading.value = false;
      });
  });
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="app-container">
    <div class="head-container">
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="名称"
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
        </template>
      </div>
      <div class="tools">
        <div class="tools-left">
          <el-button
            v-has-authority="['sys_dept_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_dept_delete']"
            type="danger"
            :icon="Delete"
            :loading="delBtnLoading"
            class="tool-item"
            @click="handleDelBatch"
          >
            删除
          </el-button>
        </div>
        <div class="tools-right">
          <el-button-group class="ml-4">
            <el-tooltip content="显示/隐藏搜索">
              <el-button :icon="Search" @click="showQuery = !showQuery" />
            </el-tooltip>
            <el-tooltip content="刷新">
              <el-button :icon="Refresh" @click="loadData" />
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </div>
    <el-table ref="table" :data="tableData" v-loading="loading" row-key="id">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="部门名称" />
      <el-table-column prop="sort" label="排序" />
      <el-table-column prop="createTime" label="创建时间" />
      <el-table-column fixed="right" label="操作" width="155px" align="center">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              v-has-authority="['sys_dept_edit']"
              type="primary"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-has-authority="['sys_dept_delete']"
              type="danger"
              :icon="Delete"
              :loading="delBtnLoading"
              @click="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Form
      v-if="formDialog.dialogVisible"
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>
