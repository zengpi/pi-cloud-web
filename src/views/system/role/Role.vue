<script setup name="SystemRole" lang="ts">
import { ref, onMounted } from 'vue';
import { Search, RefreshLeft, Plus, Delete, Edit, Refresh } from "@element-plus/icons-vue";
import { ElMessage, ElMessageBox, ElTable } from 'element-plus';

import { QueryParam, Role, FormDialog } from '@/entity/system/role';
import { ComponentProps } from "@/entity"

import { roles, del } from '@/api/system/role';

import Form from './Form.vue';
import Pagination from "@/components/Pagination.vue"

const emit = defineEmits(["update:componentProps"])

defineProps<{
    componentProps: ComponentProps;
}>()

const showQuery = ref(true)
const query = ref<QueryParam>(new QueryParam())
const table = ref(ElTable)
const tableData = ref<Role[]>([])
const total = ref(0)
const loading = ref(false)
const delBtnLoading = ref<boolean>(false)

const formDialog = ref(new FormDialog())

const handleQuery = (ifReset: boolean) => {
    if (ifReset) {
        query.value = new QueryParam()
    }
    loadData();
}

const handleAdd = () => {
    formDialog.value.dialogVisible = true;
    formDialog.value.props.isEdit = false;
}

const handleEdit = (row: any) => {
    formDialog.value.dialogVisible = true;
    formDialog.value.props.isEdit = true;
    formDialog.value.props.formData = row;
}

const handleDel = (index: number, row: Role) => {
    ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
    }).then(() => {
        delBtnLoading.value = true;
        if (!row.id) {
            ElMessage({
                type: "error",
                message: "id 不能为空"
            });
            return;
        }
        del(row.id.toString()).then(() => {
            ElMessage({
                type: "success",
                message: "删除成功"
            })
            tableData.value.splice(index, 1);
            delBtnLoading.value = false;
        }).catch(() => {
            delBtnLoading.value = false;
        })
    })
}

const handleDelBatch = () => {
    const rows: Array<Role> = table.value.getSelectionRows();
    if (!rows) {
        ElMessage({
            type: "warning",
            message: "至少选择一条记录"
        });
        return;
    }
    ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
    }).then(() => {
        delBtnLoading.value = true;
        const ids = rows.map((e: Role) => e.id);
        del(ids.join(",")).then(() => {
            ElMessage({
                type: "success",
                message: "删除成功"
            });
            loadData();
            delBtnLoading.value = false;
        }).catch(() => {
            delBtnLoading.value = false;
        })
    })
}

const handleRoleClick = (row: Role) => {
    emit("update:componentProps", new ComponentProps(row.id, row.name))
}

const loadData = () => {
    loading.value = true;
    roles(query.value).then(({ data }) => {
        tableData.value = data.records;
        total.value = data.total;
        loading.value = false;
    }).catch(() => {
        loading.value = false;
    })
}

onMounted(() => {
    loadData();
})
</script>
    
<template>
    <div>
        <div class="head-container">
            <div class="query">
                <template v-if="showQuery">
                    <el-input v-model="query.keyWord" clearable placeholder="名称/编码" class="query-item"
                        style="width: auto" @keyup.enter.native="handleQuery(false)" />
                    <el-button type="success" :icon="Search" class="query-item" @click="handleQuery(false)">
                        搜索</el-button>
                    <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleQuery(true)">重置
                    </el-button>
                </template>
            </div>
            <div class="tools">
                <div class="tools-left">
                    <el-button type="primary" :icon="Plus" class="tool-item" @click="handleAdd">新增</el-button>
                    <el-button type="danger" :icon="Delete" :loading="delBtnLoading" class="tool-item"
                        @click="handleDelBatch">
                        删除
                    </el-button>
                </div>
                <div class="tools-right">
                    <el-button-group class="ml-4">
                        <el-tooltip content="显示/隐藏搜索">
                            <el-button :icon="Search" @click="showQuery = !showQuery" />
                        </el-tooltip>
                        <el-tooltip content="刷新">
                            <el-button :icon="Refresh" @click="handleQuery" />
                        </el-tooltip>
                    </el-button-group>
                </div>
            </div>
        </div>
        <el-table ref="table" :data="tableData" v-loading="loading" row-key="id"
            :tree-props="{ children: 'children', hasChildren: 'hasChildren' }" @row-click="handleRoleClick">
            <el-table-column type="selection" width="55" />
            <el-table-column prop="name" label="角色名称" />
            <el-table-column prop="roleCode" label="角色编码" />
            <el-table-column prop="roleDesc" label="角色描述" />

            <el-table-column fixed="right" label="操作" width="155px" align="center">
                <template #default="scope">
                    <el-tooltip content="编辑" placement="top">
                        <el-button type="warning" :icon="Edit" @click="handleEdit(scope.row)" />
                    </el-tooltip>
                    <el-tooltip content="删除" placement="top">
                        <el-button type="danger" :icon="Delete" :loading="delBtnLoading"
                            @click="handleDel(scope.$index, scope.row)" />
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="total" v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
            @pagination="loadData" />
        <Form v-if="formDialog.dialogVisible" v-model:dialog-visible="formDialog.dialogVisible"
            v-bind="formDialog.props" @refresh="loadData" />
    </div>
</template>
    