<script setup lang="ts">
import { onMounted, ref } from "vue"
import { Search, RefreshLeft } from "@element-plus/icons-vue";
import { ElMessage, ElTable } from "element-plus";

import { optionalUsers } from "@/api/system/user";

import type { OptionalUser } from "@/entity/system/user";
import { BaseQueryParam } from "@/entity";

const emits = defineEmits<{
    (e: "update:dialogVisible", dialogVisible: boolean): void,
    (e: "select", optionalUsers: Array<OptionalUser>): void
}>()

const props = defineProps<{
    dialogVisible: boolean,
    id?: number,
    name?: string
}>()

const title = `为 ${props.name} 分配成员`

const query = ref(new BaseQueryParam())

const table = ref(ElTable)
const tableData = ref<Array<OptionalUser>>([])
const total = ref(0)
const tableLoading = ref(false)

const handleClose = () => {
    emits("update:dialogVisible", false)
}

const handleConfirm = () => {
    const rows = table.value.getSelectionRows();
    if (!rows || rows.length === 0) {
        ElMessage({
            type: "warning",
            message: "请至少选择一条记录"
        })
        return;
    }
    emits("select", rows);
}

const handleQuery = (isRest: boolean) => {
    if (isRest) {
        query.value = new BaseQueryParam();
    }
    loadData();
}

const handleDblclick = (row: OptionalUser) => {
    handleClose();
    emits("select", [row]);
}

const loadData = () => {
    tableLoading.value = true;
    optionalUsers(query.value).then(({ data }) => {
        tableData.value = data.records;
        total.value = data.total;
        tableLoading.value = false;
    }).catch(() => {
        tableLoading.value = false;
    })
}

onMounted(() => {
    loadData();
})
</script>

<template>
    <el-dialog v-model="dialogVisible" draggable :title="title" :before-close="handleClose" width="40%">
        <div class="head-container">
            <div class="query">
                <el-input v-model.trim="query.keyWord" clearable placeholder="用户名/昵称/部门" class="query-item"
                    style="width: auto" @keyup.enter.native="handleQuery(false)" />
                <el-button type="success" :icon="Search" class="query-item" @click="handleQuery(false)">
                    搜索</el-button>
                <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleQuery(true)">重置
                </el-button>
            </div>
        </div>
        <el-table ref="table" stripe :data="tableData" v-loading="tableLoading" @row-dblclick="handleDblclick">
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