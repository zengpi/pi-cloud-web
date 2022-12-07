<script setup name="SystemRole" lang="ts">
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

import { BaseQuery, BaseDialog, ComponentProps } from "@/entity";
import type { Role } from "@/entity/system/role";

import { getRoles, deleteRole } from "@/api/system/role";

import RoleForm from "./RoleForm.vue";
import Pagination from "@/components/Pagination.vue";

const emit = defineEmits<{
  (e: "update:componentProps", componentProps: ComponentProps): void;
}>();

defineProps<{
  componentProps: ComponentProps;
}>();

const showQuery = ref(true);
const query = ref(new BaseQuery());

const table = ref(ElTable);
const tableData = ref<Role[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref<boolean>(false);

const formDialog = ref(new BaseDialog<Role>());

const loadData = () => {
  loading.value = true;

  getRoles(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
};

function handleResetQuery() {
  query.value = new BaseQuery();
  loadData();
}

const handleAdd = () => {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
};

const handleEdit = (row: Role) => {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
};

const handleDel = (row: Role) => {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel(row.id.toString());
};

const handleDelBatch = () => {
  const rows: Array<Role> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: Role) => e.id).join(","));
};

function doDel(ids: string) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteRole(ids)
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

const handleRoleClick = (row: Role) => {
  emit("update:componentProps", new ComponentProps(row.id, row.name));
};

onMounted(() => {
  loadData();
});
</script>

<template>
  <div>
    <div class="head-container">
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="名称/编码"
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
            v-has-authority="['sys_role_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_role_delete']"
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
    <el-table
      ref="table"
      :data="tableData"
      v-loading="loading"
      row-key="id"
      @row-click="handleRoleClick"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="角色名称" />
      <el-table-column prop="roleCode" label="角色编码" />
      <el-table-column prop="roleDesc" label="角色描述" />

      <el-table-column fixed="right" label="操作" width="155px" align="center">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button
              v-has-authority="['sys_role_edit']"
              type="warning"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-has-authority="['sys_role_delete']"
              type="danger"
              :icon="Delete"
              :loading="delBtnLoading"
              @click="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @pagination="loadData"
    />
    <RoleForm
      v-if="formDialog.dialogVisible"
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
  </div>
</template>
