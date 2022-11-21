<script setup name="SystemMenu" lang="ts">
import { ref, onMounted } from "vue"
import { ElMessage, ElMessageBox, ElTable } from "element-plus";
import { Search, RefreshLeft, Plus, Delete, Edit, Refresh } from "@element-plus/icons-vue";

import Form from "./Form.vue"

import { menus, del } from "@/api/system/menu"

import { Menu, QueryParam, FormDialog } from '@/entity/system/menu';

const table = ref(ElTable)

let showSearch = ref<boolean>(true)
let query = ref<QueryParam>(new QueryParam())
let tableData = ref<Menu[]>([])
let loading = ref(false)

let formDialog = ref<FormDialog>(new FormDialog())

let delBtnLoading = ref<boolean>(false)

/**
 * 查询
 * @param ifReset 是否重置
 */
const handleQuery = (ifReset: boolean) => {
  if (ifReset) {
    query.value = new QueryParam()
  }
  loadData();
}

/**
 * 新增
 */
const handleAdd = () => {
  formDialog.value.dialogVisible = true
  formDialog.value.isEdit = false;
}

/**
 * 编辑
 * @param row 待编辑数据
 */
const handleEdit = (row: Menu) => {
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
  formDialog.value.isEdit = true;
  formDialog.value.dialogVisible = true
  formDialog.value.formData = row;
}

/**
 * 删除一条记录
 * @param index 待删除记录的索引 
 * @param row 待删除记录
 */
const handleDel = (row: Menu) => {
  ElMessageBox.confirm(
    "将永久删除选中的菜单，是否继续？",
    "警告",
    {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    }
  ).then(() => {
    if (!row.id) {
      ElMessage({
        type: "error",
        message: "id 不能为空"
      })
      return;
    }
    delBtnLoading.value = true;
    del(row.id.toString()).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      })
      loadData();
      delBtnLoading.value = false
    }).catch(() => delBtnLoading.value = false)
  })
}

/**
 * 批量删除记录
 */
const handleDelBatch = () => {
  const rows: Array<Menu> = table.value.getSelectionRows();
  if (!rows) {
    ElMessage({
      type: "warning",
      message: "至少选择一条记录"
    });
    return;
  }
  ElMessageBox.confirm(
    "将永久删除选中的菜单及其下面的子菜单，是否继续？",
    "警告",
    {
      confirmButtonText: "是",
      cancelButtonText: "否",
      type: "warning"
    }
  ).then(() => {
    delBtnLoading.value = true;
    const ids = rows.map((e: Menu) => e.id);
    del(ids.join(",")).then(() => {
      ElMessage({
        type: "success",
        message: "删除成功"
      });
      loadData();
      delBtnLoading.value = false
    }).catch(() => delBtnLoading.value = false)
  })
}

/**
 * 加载数据
 */
const loadData = () => {
  loading.value = true;
  menus(query.value.keyWord).then(({ data }) => {
    tableData.value = data;
    loading.value = false;
  }).catch(() => {
    loading.value = false;
  })
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="app-container">
    <div class="head-container">
      <div class="query">
        <template v-if="showSearch">
          <el-input v-model="query.keyWord" clearable placeholder="名称/组件路径/权限标识" class="query-item" style="width: auto"
            @keyup.enter.native="handleQuery(false)" />
          <el-button type="success" :icon="Search" class="query-item" @click="handleQuery(false)">
            搜索</el-button>
          <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleQuery(true)">重置
          </el-button>
        </template>
      </div>
      <div class="tools">
        <div class="tools-left">
          <el-button type="primary" :icon="Plus" class="tool-item" @click="handleAdd">新增</el-button>
          <el-button type="danger" :icon="Delete" :loading="delBtnLoading" class="tool-item" @click="handleDelBatch">
            删除
          </el-button>
          <el-button type="warning" :icon="Edit" class="tool-item" @click="handleEdit">修改</el-button>
        </div>
        <div class="tools-right">
          <el-button-group class="ml-4">
            <el-tooltip content="显示/隐藏搜索">
              <el-button :icon="Search" @click="showSearch = !showSearch" />
            </el-tooltip>
            <el-tooltip content="刷新">
              <el-button :icon="Refresh" @click="handleQuery" />
            </el-tooltip>
            <!-- <el-tooltip content="导出">
                            <el-button :icon="Download" :loading="exportBtnLoading" @click="handleExport" />
                        </el-tooltip> -->
          </el-button-group>
        </div>
      </div>
    </div>
    <el-table ref="table" :data="tableData" v-loading="loading" row-key="id"
      :tree-props="{ children: 'children', hasChildren: 'hasChildren' }">
      <el-table-column type="selection" width="55" />
      <el-table-column prop="name" label="菜单名称" width="180" />
      <el-table-column prop="icon" label="图标" width="70" #default="{ row }">
        <SvgIcon v-if="row.icon" :name="row.icon" />
      </el-table-column>
      <el-table-column prop="path" label="路由路径" width="150" show-overflow-tooltip />
      <el-table-column prop="componentName" label="组件名称" width="140" />
      <el-table-column prop="component" label="组件路径" width="180" />
      <el-table-column prop="permission" label="权限标识" width="120" />
      <el-table-column prop="sort" label="排序" width="60" />
      <el-table-column prop="keepAlive" label="是否缓存" width="90" #default="{ row }">
        <template v-if="row.type === 2">
          <el-tag v-if="row.keepAlive === 0" type="warning" class="mx-1" effect="dark">不缓存
          </el-tag>
          <el-tag v-else-if="row.keepAlive === 1" class="mx-1" effect="dark">缓存</el-tag>
        </template>
        <span v-else />
      </el-table-column>
      <el-table-column prop="type" label="菜单类型" width="90" />
      <el-table-column prop="externalLinks" label="是否外链" width="90" #default="{ row }">
        <template v-if="row.type === 2">
          <el-tag v-if="row.externalLinks === 0" type="warning" class="mx-1" effect="dark">否
          </el-tag>
          <el-tag v-else-if="row.externalLinks === 1" class="mx-1" effect="dark">是</el-tag>
        </template>
        <span v-else />
      </el-table-column>
      <el-table-column prop="visible" label="是否可见" width="90" #default="{ row }">
        <el-tag v-if="row.visible === 0" type="warning" class="mx-1" effect="dark">不可见
        </el-tag>
        <el-tag v-else-if="row.visible === 1" class="mx-1" effect="dark">可见</el-tag>
      </el-table-column>
      <el-table-column prop="redirect" label="重定向路径" width="140" />
      <el-table-column prop="createTime" label="创建时间" width="170" />
      <el-table-column fixed="right" label="操作" width="155px" align="center">
        <template #default="scope">
          <el-tooltip content="编辑" placement="top">
            <el-button type="primary" :icon="Edit" @click="handleEdit(scope.row)" />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button type="danger" :icon="Delete" :loading="delBtnLoading" @click="handleDel(scope.row)" />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Form v-if="formDialog.dialogVisible" v-model:dialogVisible="formDialog.dialogVisible" :form-dialog="formDialog"
      @refresh="loadData" />
  </div>
</template>