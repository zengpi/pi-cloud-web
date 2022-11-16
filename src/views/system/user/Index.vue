<script setup name="SystemUser" lang="ts">
/**
 * 用户管理
 * @author ZnPi
 * @date 2022-09-15
 */
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
  Lock
} from '@element-plus/icons-vue'

import { Splitpanes, Pane } from 'splitpanes'
import 'splitpanes/dist/splitpanes.css'

import { exportFile } from '@/util';

import { QueryParam, FormDialog, User } from '@/entity/system/user'
import { BaseDialog } from "@/entity";
import type { DeptTree } from '@/entity/system/dept';

import { users, edit, del, exportUser, downloadUserTemp, passReset } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept';

import Form from './Form.vue'
import UserImport from "./UserImport.vue";

let showSearch = ref(true)

let query = ref<QueryParam>(new QueryParam())

let tableData = ref<Array<User>>()

let loading = ref(false)

let total = ref(0)

const table = ref(ElTable)

/**
 * 更改状态 Loading
 */
let switchLoading = ref(false)
/**
 * 删除按钮 Loading
 */
let delBtnLoading = ref(false)
/**
 * 导出按钮 Loading
 */
let exportLoading = ref(false)

/**
 * 用户表单弹窗
 */
let userFormDialog = ref(new FormDialog())
/**
 * 用户导入弹窗
 */
let userImportDialog = ref(new BaseDialog())

/**
 * 状态 条件查询 选项
 */
const statusOptions = ref([
  {
    label: '启用',
    value: 1
  },
  {
    label: '禁用',
    value: 0
  }
])

let deptTree = ref<Array<DeptTree>>();
const filterText = ref('')
const treeRef = ref<InstanceType<typeof ElTree>>()

watch(filterText, (val) => {
  treeRef.value!.filter(val)
})

/**
 * 查询
 */
const handleQuery = () => {
  loadData();
}

/**
 * 重置
 */
const handleResetQuery = () => {
  query.value = new QueryParam()
  loadData()
}

/**
 * 新增
 */
const handleAdd = () => {
  userFormDialog.value.dialogVisible = true;
  userFormDialog.value.isEdit = false;
}

/**
 * 删除
 * @param index 待删除记录的索引 
 * @param row 待删除记录
 */
const handleDel = (index: number, row: User) => {
  ElMessageBox.confirm(
    '将永久删除该记录，是否继续？',
    '警告',
    {
      confirmButtonText: '是',
      cancelButtonText: '否',
      type: 'warning',
    }
  )
    .then(() => {
      delBtnLoading.value = true;
      if (!row.id) {
        ElMessage({
          type: "error",
          message: "id 不能为空"
        });
        return;
      }
      del(row.id.toString()).then(() => {
        tableData.value?.splice(index, 1);
        total.value -= 1;
        ElMessage({
          type: 'success',
          message: '删除成功',
        })
        delBtnLoading.value = false;
      }).catch(() => {
        delBtnLoading.value = false;
      })
    })
}

/**
 * 批量删除
 */
const handleDelBatch = () => {
  const rows: Array<User> = table.value.getSelectionRows();

  if (!rows || rows.length === 0) {
    ElMessage({
      type: "warning",
      message: "至少选择一条记录"
    });
    return;
  }
  ElMessageBox.confirm(
    "将永久删除选中记录，是否继续？",
    "警告",
    {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    }).then(() => {

      const ids = rows.map((e: User) => e.id);
      delBtnLoading.value = true;
      del(ids.join(",")).then(() => {
        ElMessage({ type: "success", message: "删除成功" });
        loadData();
        delBtnLoading.value = false;
      }).catch(() => {
        delBtnLoading.value = false;
      })
    });
}

/**
 * 编辑
 * @param row 待编辑记录
 */
const handleEdit = (row: User) => {
  if (row instanceof PointerEvent) {
    const rows = table.value.getSelectionRows();
    if (rows.length !== 1) {
      ElMessage({
        type: "warning",
        message: "请选择一条记录"
      });
      return;
    }
    row = rows[0];
  }
  userFormDialog.value.dialogVisible = true;
  userFormDialog.value.isEdit = true;
  userFormDialog.value.form = row;
}

/**
 * 更改状态
 * @param row 待更改状态记录 
 */
const changeStatus = (row: User) => {
  switchLoading.value = true;
  edit(row).then(() => {
    let operation = row.enabled === 0 ? '禁用' : '启用';

    ElMessage({
      message: `${operation}成功！`,
      type: "success"
    })
    switchLoading.value = false;
  }).catch(() => {
    switchLoading.value = false;
  })
}

/**
 * 导出
 */
const handleExport = () => {
  exportLoading.value = true
  exportUser(query.value).then(response => {
    exportFile(response);
    exportLoading.value = false
  }).catch(() => {
    exportLoading.value = false
  })
}

/**
 * 下载导入模板
 */
const handleDownloadTemp = () => {
  downloadUserTemp().then(response => {
    exportFile(response);
  })
}

/**
 * 用户导入
 */
const handleImport = () => {
  userImportDialog.value.dialogVisible = true;
}

/**
 * 调用接口，加载数据
 */
const loadData = () => {
  loading.value = true;

  users(query.value).then(({ data }) => {
    tableData.value = data.records
    total.value = data.total
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

/**
 * 重置密码
 */
const handleResetPass = (row: User) => {
  ElMessageBox.confirm(
    "将重置密码为 123456，是否继续？",
    "警告",
    {
      type: "warning",
      confirmButtonText: "是",
      cancelButtonText: "否"
    }).then(() => {
      if (!row.id) {
        ElMessage({
          type: "error",
          message: "id 不能为空"
        });
        return;
      }
      passReset(row.id).then(() => {
        ElMessage({
          type: "success",
          message: "重置成功！"
        })
      })
    })
}

/**
 * 过滤部门节点
 */
const filterNode = (value: string, data: any): any => {
  if (!value) return true
  return data.name.includes(value)
}

/**
 * 部门节点点击事件
 */
const handleDeptNodeClick = (data: any) => {
  query.value.deptId = data.id;
  loadData();
}

onMounted(() => {
  getDeptTree().then(({ data }) => {
    deptTree.value = data;
  })
  loadData();
})

</script>  

<template>
  <div class='app-container'>
    <splitpanes class="default-theme">
      <pane size="15" min-size="15" max-size="30" style="padding-right: 10px;">
        <el-input v-model="filterText" placeholder="请输入关键字搜索" />
        <el-tree ref="treeRef" :data="deptTree" :props="{ label: 'name' }" :filter-node-method="filterNode"
          :highlight-current="true" :expand-on-click-node="false" filter class="filter-tree"
          @node-click="handleDeptNodeClick" />
      </pane>
      <pane>
        <div class="head-container">
          <div class="query">
            <template v-if="showSearch">
              <el-select v-model="query.enabled" clearable placeholder="状态" class="query-item" style="width: 80px;">
                <el-option v-for="item in statusOptions" :key="item.value" :label="item.label" :value="item.value" />
              </el-select>
              <el-input v-model="query.keyWord" clearable placeholder="用户名/昵称/手机号" class="query-item"
                style="width: auto" @keyup.enter.native="handleQuery" />
              <el-button type="success" :icon="Search" class="query-item" @click="handleQuery">
                搜索</el-button>
              <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleResetQuery">重置
              </el-button>
            </template>
          </div>
          <div class="tools">
            <div class="tools-left">
              <el-button v-has-authority="['sys_user_add']" type="primary" :icon="Plus" class="tool-item"
                @click="handleAdd">新增</el-button>
              <el-button v-has-authority="['sys_user_delete']" type="danger" :icon="Delete" :loading="delBtnLoading"
                class="tool-item" @click="handleDelBatch">
                删除
              </el-button>
              <el-button type="warning" v-has-authority="['sys_user_edit']" :icon="Edit" class="tool-item"
                @click="handleEdit">修改</el-button>
              <el-dropdown split-button type="success" class="tool-item" @click="handleImport">
                导入
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item :icon="Download" @click="handleDownloadTemp">下载模板</el-dropdown-item>
                    <el-dropdown-item :icon="Upload" @click="handleImport">导入</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
            </div>
            <div class="tools-right">
              <el-button-group class="ml-4">
                <el-tooltip content="显示/隐藏搜索">
                  <el-button :icon="Search" @click="showSearch = !showSearch" />
                </el-tooltip>
                <el-tooltip content="刷新">
                  <el-button :icon="Refresh" @click="handleQuery" />
                </el-tooltip>
                <el-tooltip content="导出">
                  <el-button :icon="Download" :loading="exportLoading" @click="handleExport" />
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
          <el-table-column prop="status" label="状态" #default="{ row }">
            <el-switch v-model="row.enabled" :active-value="1" :inactive-value="0" :loading="switchLoading"
              style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949" @change='changeStatus(row)' />
          </el-table-column>
          <el-table-column prop="createTime" label="创建时间" />
          <el-table-column fixed="right" label="操作" width="220px" align="center">
            <template #default="scope">
              <el-tooltip content="重置密码" placement="top">
                <el-button type="warning" :icon="Lock" @click="handleResetPass(scope.row)" />
              </el-tooltip>
              <el-tooltip content="编辑" placement="top">
                <el-button v-has-authority="['sys_user_edit']" type="primary" :icon="Edit"
                  @click="handleEdit(scope.row)" />
              </el-tooltip>
              <el-tooltip content="删除" placement="top">
                <el-button v-has-authority="['sys_user_delete']" type="danger" :icon="Delete" :loading="delBtnLoading"
                  @click="handleDel(scope.$index, scope.row)" />
              </el-tooltip>
            </template>
          </el-table-column>
        </el-table>
        <Pagination :total="total" v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
          @pagination="loadData" />
        <Form v-if='userFormDialog.dialogVisible' v-model:dialogVisible='userFormDialog.dialogVisible'
          :is-edit="userFormDialog.isEdit" :form="userFormDialog.form" @refresh="loadData" />
        <UserImport v-if='userImportDialog.dialogVisible' v-model:dialogVisible="userImportDialog.dialogVisible"
          @refresh="loadData" />
      </pane>
    </splitpanes>
  </div>
</template>