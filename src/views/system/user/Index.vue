<script setup name="SystemUser" lang="ts">
import { ref, onMounted, watch } from "vue";

import { ElMessage, ElMessageBox, ElTable, ElTree } from "element-plus";
import {
  RefreshLeft,
  Refresh,
  Search,
  Plus,
  Edit,
  Delete,
  Download,
  Upload,
  Lock,
} from "@element-plus/icons-vue";

import { Splitpanes, Pane } from "splitpanes";
import "splitpanes/dist/splitpanes.css";

import { exportFile } from "@/util";

import {
  getUsers,
  updateUser,
  deleteUser,
  exportUser,
  downloadUserImportTemp,
  resetPass,
} from "@/api/system/user";
import { getDeptSelectTree } from "@/api/system/dept";

import { BaseDialog, type SelectTree } from "@/entity";
import { Query, User, UserForm, UserImportDialog } from "@/entity/system/user";

import Form from "./Form.vue";
import UserImport from "./UserImport.vue";

const showQuery = ref(true);
const query = ref<Query>(new Query());

const delBtnLoading = ref(false);

const table = ref(ElTable);
const tableData = ref<Array<User>>();
const total = ref(0);
const loading = ref(false);

/**
 * 更改状态 Loading
 */
const switchLoading = ref(false);
/**
 * 导出按钮 Loading
 */
const exportLoading = ref(false);

/**
 * 用户表单弹窗
 */
const userFormDialog = ref(new BaseDialog<UserForm>());
/**
 * 用户导入弹窗
 */
const userImportDialog = ref(new UserImportDialog());

/**
 * 状态 条件查询 选项
 */
const statusOptions = ref([
  {
    label: "启用",
    value: 1,
  },
  {
    label: "禁用",
    value: 0,
  },
]);

/**
 * 部门树实例
 */
const treeRef = ref<InstanceType<typeof ElTree>>();
/**
 * 部门（树形）
 */
const deptSelectTree = ref<Array<SelectTree>>();
/**
 * 部门过滤文本
 */
const filterText = ref("");

/**
 * 过滤部门
 */
watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

function loadData() {
  loading.value = true;

  getUsers(query.value)
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
  query.value = new Query();
  loadData();
}

function handleAdd() {
  userFormDialog.value.dialogVisible = true;
  userFormDialog.value.props.isEdit = false;
}

function handleEdit(row: User) {
  userFormDialog.value.dialogVisible = true;
  userFormDialog.value.props.isEdit = true;
  userFormDialog.value.props.formData = row;
}

function handleDel(row: User) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel(row.id.toString());
}

const handleDelBatch = () => {
  const rows: Array<User> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: User) => e.id).join(","));
};

function doDel(ids: string) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteUser(ids)
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

/**
 * 更改状态
 * @param row 待更改状态记录
 */
function changeStatus(row: User) {
  switchLoading.value = true;

  updateUser(row)
    .then(() => {
      let operation = row.enabled === 0 ? "禁用" : "启用";

      ElMessage.success(`${operation}成功！`);

      switchLoading.value = false;
    })
    .catch(() => {
      switchLoading.value = false;
    });
}

/**
 * 导出
 */
function handleExport() {
  exportLoading.value = true;
  exportUser(query.value)
    .then((response) => {
      exportFile(response);
      exportLoading.value = false;
    })
    .catch(() => {
      exportLoading.value = false;
    });
}

/**
 * 下载导入模板
 */
function handleDownloadTemp() {
  downloadUserImportTemp().then((response) => {
    exportFile(response);
  });
}

/**
 * 用户导入
 */
function handleImport() {
  userImportDialog.value.dialogVisible = true;
}

/**
 * 重置密码
 */
function handleResetPass(row: User) {
  ElMessageBox.confirm("将重置密码为 123456，是否继续？", "警告", {
    type: "warning",
    confirmButtonText: "是",
    cancelButtonText: "否",
  }).then(() => {
    if (!row.id) {
      ElMessage.error("id 不能为空");
      return;
    }
    resetPass(row.id).then(() => {
      ElMessage.success("重置成功！");
    });
  });
}

/**
 * 过滤部门节点
 */
function filterNode(value: string, data: SelectTree): any {
  if (!value) return true;
  return data.label.includes(value);
}

/**
 * 部门节点点击事件
 */
function handleDeptNodeClick(data: SelectTree) {
  query.value.deptId = data.value;
  loadData();
}

onMounted(() => {
  getDeptSelectTree().then(({ data }) => {
    deptSelectTree.value = data;
  });
  loadData();
});
</script>

<template>
  <div class="app-container">
    <splitpanes class="default-theme">
      <pane size="15" min-size="15" max-size="30" style="padding-right: 10px">
        <el-input v-model="filterText" placeholder="请输入关键字搜索" />
        <el-tree
          ref="treeRef"
          :data="deptSelectTree"
          :filter-node-method="filterNode"
          :highlight-current="true"
          :expand-on-click-node="false"
          filter
          class="filter-tree"
          @node-click="handleDeptNodeClick"
        />
      </pane>
      <pane>
        <div class="head-container">
          <div class="query">
            <template v-if="showQuery">
              <el-select
                v-model="query.enabled"
                clearable
                placeholder="状态"
                class="query-item"
                style="width: 80px"
              >
                <el-option
                  v-for="item in statusOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                />
              </el-select>
              <el-input
                v-model="query.keyWord"
                clearable
                placeholder="用户名/昵称/手机号"
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
                v-has-authority="['sys_user_add']"
                type="primary"
                :icon="Plus"
                class="tool-item"
                @click="handleAdd"
                >新增</el-button
              >
              <el-button
                v-has-authority="['sys_user_delete']"
                type="danger"
                :icon="Delete"
                :loading="delBtnLoading"
                class="tool-item"
                @click="handleDelBatch"
              >
                删除
              </el-button>
              <el-dropdown
                v-has-authority="['sys_user_import']"
                split-button
                type="success"
                class="tool-item"
                @click="handleImport"
              >
                导入
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item
                      :icon="Download"
                      @click="handleDownloadTemp"
                      >下载模板</el-dropdown-item
                    >
                    <el-dropdown-item :icon="Upload" @click="handleImport"
                      >导入</el-dropdown-item
                    >
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="tools-right">
              <el-button-group class="ml-4">
                <el-tooltip content="显示/隐藏搜索">
                  <el-button :icon="Search" @click="showQuery = !showQuery" />
                </el-tooltip>
                <el-tooltip content="刷新">
                  <el-button :icon="Refresh" @click="loadData" />
                </el-tooltip>
                <el-tooltip content="导出">
                  <el-button
                    v-has-authority="['sys_user_export']"
                    :icon="Download"
                    :loading="exportLoading"
                    @click="handleExport"
                  />
                </el-tooltip>
              </el-button-group>
            </div>
          </div>
        </div>
        <el-table ref="table" :data="tableData" v-loading="loading" stripe>
          <el-table-column type="selection" width="55" />
          <el-table-column prop="username" label="用户名" width="180" />
          <el-table-column prop="nickname" label="昵称" width="180" />
          <el-table-column prop="phone" label="手机" />
          <el-table-column prop="deptName" label="部门" />
          <el-table-column prop="age" label="年龄" />
          <el-table-column prop="sex" label="性别" #default="{ row }">
            <span v-if="row.sex === 1">男</span>
            <span v-else-if="row.sex === 2">女</span>
          </el-table-column>
          <el-table-column prop="status" label="状态" #default="{ row }">
            <el-switch
              v-model="row.enabled"
              :active-value="1"
              :inactive-value="0"
              :loading="switchLoading"
              style="
                --el-switch-on-color: #13ce66;
                --el-switch-off-color: #ff4949;
              "
              @change="changeStatus(row)"
            />
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column
            fixed="right"
            label="操作"
            width="220px"
            align="center"
          >
            <template #default="scope">
              <el-tooltip content="重置密码" placement="top">
                <el-button
                  v-has-authority="['sys_user_pass_reset']"
                  type="warning"
                  :icon="Lock"
                  @click="handleResetPass(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button
                  v-has-authority="['sys_user_edit']"
                  type="primary"
                  :icon="Edit"
                  @click="handleEdit(scope.row)"
                />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button
                  v-has-authority="['sys_user_delete']"
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
        <Form
          v-if="userFormDialog.dialogVisible"
          v-model:dialogVisible="userFormDialog.dialogVisible"
          v-bind="userFormDialog.props"
          @refresh="loadData"
        />
        <UserImport
          v-if="userImportDialog.dialogVisible"
          v-model:dialogVisible="userImportDialog.dialogVisible"
          @refresh="loadData"
        />
      </pane>
    </splitpanes>
  </div>
</template>
