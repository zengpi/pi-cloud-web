<script setup lang="ts" name="Log">
import { ref, onMounted } from "vue"

import { Search, RefreshLeft, Delete, Refresh, Download } from "@element-plus/icons-vue"
import { ElMessageBox, ElMessage, ElTable } from "element-plus"

import { toDateString } from "xe-utils"

import { QueryParam, Log } from "@/entity/system/log"

import { getLogs, delLogs, exportLog } from "@/api/system/log"
import { exportFile } from "@/util"

const showSearch = ref(true)
const query = ref(new QueryParam())
const delBtnLoading = ref(false)
const table = ref(ElTable)
const tableData = ref<Log[]>()
const total = ref(0)
const loading = ref(false)
const exportLoading = ref(false)

const queryColumnOptions = [
    {
        label: "操作人",
        value: "create_by"
    },
    {
        label: "标题",
        value: "title"
    },
    {
        label: "方法名称",
        value: "method_name"
    }
]
const typeOptions = [
    {
        label: "正常",
        value: 1
    },
    {
        label: "异常",
        value: 0
    }
]

function loadData() {
    loading.value = true;
    getLogs(query.value).then(({ data }) => {
        tableData.value = data.records
        total.value = data.total
    }).catch(() => { })
    loading.value = false;
}

function handleResetQuery() {
    query.value = new QueryParam();
    initDate()
    loadData()
}

function handleDelBatch() {
    const rows: Array<Log> = table.value.getSelectionRows();
    if (!rows) {
        ElMessage.error("至少选择一条记录")
        return
    }
    ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
    }).then(() => {
        delBtnLoading.value = true;
        const ids = rows.map((e: Log) => e.id);
        delLogs(ids.join(",")).then(() => {
            ElMessage.success("删除成功")
            loadData();
        }).catch(() => { })
        delBtnLoading.value = false;
    })
}

function handleDel(index: number, row: Log) {
    ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
        confirmButtonText: "是",
        cancelButtonText: "否",
        type: "warning"
    }).then(() => {
        delBtnLoading.value = true
        if (!row.id) {
            ElMessage.error("id 不能为空")
            return
        }
        delLogs(row.id.toString()).then(() => {
            ElMessage.success("删除成功")
            tableData.value?.splice(index, 1);
        }).catch(() => { })
        delBtnLoading.value = false;
    })
}

function handleExport() {
    exportLoading.value = true
    exportLog(query.value).then(response => {
        exportFile(response);
    }).catch(() => { })
    exportLoading.value = false
}

function initDate() {
    const now = new Date();
    query.value.createTime = [toDateString(now, "yyyy-MM-dd 00:00:00"), toDateString(now, "yyyy-MM-dd 23:59:59")]
}

onMounted(() => {
    initDate()
    loadData()
})
</script>

<template>
    <div class="app-container">
        <div class="head-container">
            <div class="query">
                <template v-if="showSearch">
                    <el-date-picker v-model="query.createTime" type="datetimerange" start-placeholder="开始时间"
                        end-placeholder="结束时间" value-format="YYYY-MM-DD HH:mm:ss" class="query-item"
                        style="width: auto" />
                    <el-select v-model="query.type" clearable placeholder="类型" class="query-item" style="width: 110px">
                        <el-option v-for="item in typeOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-select v-model="query.queryColumn" clearable placeholder="查询字段" class="query-item"
                        style="width: 110px">
                        <el-option v-for="item in queryColumnOptions" :key="item.value" :label="item.label"
                            :value="item.value" />
                    </el-select>
                    <el-input v-model="query.keyWord" clearable placeholder="请输入关键字..." class="query-item"
                        style="width: auto" @keyup.enter.native="loadData" />
                    <el-button type="success" :icon="Search" class="query-item" @click="loadData">
                        搜索</el-button>
                    <el-button type="warning" :icon="RefreshLeft" class="query-item" @click="handleResetQuery">重置
                    </el-button>
                </template>
            </div>
            <div class="tools">
                <div class="tools-left">
                    <el-button type="danger" :icon="Delete" :loading="delBtnLoading" class="tool-item"
                        @click="handleDelBatch">
                        删除
                    </el-button>
                </div>
                <div class="tools-right">
                    <el-button-group class="ml-4">
                        <el-tooltip content="显示/隐藏搜索">
                            <el-button :icon="Search" @click="showSearch = !showSearch" />
                        </el-tooltip>
                        <el-tooltip content="刷新">
                            <el-button :icon="Refresh" @click="loadData" />
                        </el-tooltip>
                        <el-tooltip content="导出">
                            <el-button :icon="Download" :loading="exportLoading" @click="handleExport" />
                        </el-tooltip>
                    </el-button-group>
                </div>
            </div>
        </div>
        <el-table ref="table" :data="tableData" v-loading="loading" stripe border>
            <el-table-column type="selection" width="55" align="center" />
            <el-table-column prop="createTime" label="时间" width="180" align="center" />
            <el-table-column prop="type" label="类型" width="85" #default="{ row }">
                <el-tag v-if="row.type === 0" type="danger" effect="dark">
                    异常
                </el-tag>
                <el-tag v-else-if="row.type === 1" type="success" effect="dark">
                    正常
                </el-tag>
            </el-table-column>
            <el-table-column prop="ip" label="IP地址" width="100" align="center" />
            <el-table-column prop="title" label="标题" width="100" align="center" />
            <el-table-column prop="requestMethod" label="请求方式" width="90" align="center" />
            <el-table-column prop="requestTime" label="请求时间" width="90" align="center" #default="{ row }">
                <el-tag v-if="row.requestTime" effect="dark">
                    {{ row.requestTime }}
                </el-tag>
            </el-table-column>
            <el-table-column prop="methodName" label="方法名称" align="center" show-overflow-tooltip />
            <el-table-column prop="requestParam" label="请求参数" align="center" show-overflow-tooltip />
            <el-table-column prop="exceptionDesc" label="异常描述" align="center" show-overflow-tooltip />
            <el-table-column fixed="right" label="操作" width="90px" align="center">
                <template #default="scope">
                    <el-tooltip content="删除" placement="top">
                        <el-button v-has-authority="['sys_user_delete']" type="danger" :icon="Delete"
                            :loading="delBtnLoading" @click="handleDel(scope.$index, scope.row)" />
                    </el-tooltip>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="total" v-model:current-page="query.pageNum" v-model:page-size="query.pageSize"
            @pagination="loadData" />
    </div>
</template>