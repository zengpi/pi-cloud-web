<script setup lang="ts">
import { ref, computed, watch } from "vue";

import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import {
  Search,
  RefreshLeft,
  Plus,
  Delete,
  Refresh,
} from "@element-plus/icons-vue";

import { getRoleMembers, allocateRoleUser } from "@/api/system/role";

import type { ComponentProps } from "@/entity";
import { RoleMemberQuery, type RoleMember } from "@/entity/system/role";
import {
  OptionalUserDialog,
  OptionalUser as OptionalUserEntity,
} from "@/entity/system/user";

import Pagination from "@/components/Pagination.vue";
import OptionalUser from "./OptionalUser.vue";

const props = defineProps<{
  componentProps: ComponentProps;
}>();

const showQuery = ref(true);
const query = ref<RoleMemberQuery>(new RoleMemberQuery());

const table = ref(ElTable);
const tableData = ref<RoleMember[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref<boolean>(false);

const roleId = computed(() => props.componentProps.id);

const optionalUserDialog = ref(new OptionalUserDialog());

watch(roleId, (newVal: number | undefined) => {
  if (newVal === undefined) return;
  query.value.roleId = roleId.value;
  loadData();
});

function loadData() {
  loading.value = true;
  getRoleMembers(query.value)
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
  query.value = new RoleMemberQuery();
  query.value.roleId = roleId.value;
  loadData();
}

function handleAdd() {
  if (!roleId.value) {
    ElMessage.warning("请选择角色");
    return;
  }
  optionalUserDialog.value.dialogVisible = true;
  optionalUserDialog.value.props.id = props.componentProps.id;
  optionalUserDialog.value.props.name = props.componentProps.name;
}

/**
 * 用户选择
 * @param rows 待分配用户
 */
function handleOptionalUserSelect(rows: Array<OptionalUserEntity>) {
  loading.value = true;
  allocateRoleUser({
    roleId: roleId.value,
    toBeAddUserIds: rows.map((e) => e.id).join(","),
  }).then(() => {
    ElMessage.success("分配成功");
    loadData();
  });
}

/**
 * 移除角色成员
 * @param row 待取消分配用户
 */
function handleRemoveUserRole(row: OptionalUserEntity) {
  ElMessageBox.confirm("双击记录将移除该角色成员，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    loading.value = true;
    allocateRoleUser({
      roleId: roleId.value,
      toBeRemoveUserIds: row.id?.toString(),
    }).then(() => {
      ElMessage.success("移除成功");
      loadData();
    });
  });
}

/**
 * 批量移除角色成员
 */
function handleRemoveUserRoleBatch() {
  const rows: Array<RoleMember> = table.value.getSelectionRows();
  if (!rows || rows.length === 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }

  ElMessageBox.confirm("将移除所有选中的角色成员，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    loading.value = true;
    allocateRoleUser({
      roleId: roleId.value,
      toBeRemoveUserIds: rows.map((e) => e.id).join(","),
    }).then(() => {
      ElMessage.success("移除成功");
      loadData();
    });
  });
}
</script>

<template>
  <div>
    <div class="head-container">
      <div class="query">
        <template v-if="showQuery">
          <el-tag
            v-if="componentProps.name"
            type="success"
            style="margin: 0 3px 0 0"
          >
            {{ componentProps.name }}
          </el-tag>
          <el-input
            v-model="query.keyWord"
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
        </template>
      </div>
      <div class="tools">
        <div class="tools-left">
          <el-button
            v-has-authority="['sys_role_user_allocation']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_role_user_allocation']"
            type="danger"
            :icon="Delete"
            :loading="delBtnLoading"
            class="tool-item"
            @click="handleRemoveUserRoleBatch"
          >
            取消分配
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
      border
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
      @row-dblclick="handleRemoveUserRole"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column prop="username" label="用户名" />
      <el-table-column prop="nickname" label="昵称" />
      <el-table-column prop="deptName" label="部门" />
    </el-table>
    <Pagination
      :total="total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @pagination="loadData"
    />
    <OptionalUser
      v-if="optionalUserDialog.dialogVisible"
      v-model:dialogVisible="optionalUserDialog.dialogVisible"
      v-bind="componentProps"
      @select="handleOptionalUserSelect"
    />
  </div>
</template>
