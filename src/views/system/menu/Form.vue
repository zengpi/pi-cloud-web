<script setup lang="ts">
import { ref, onMounted } from "vue";
import { ElMessage, type FormRules } from 'element-plus';

import { selectTree, add, edit } from "@/api/system/menu"

import { Menu, FormDialog } from '@/entity/system/menu';
import type { SelectTree } from "@/entity";

import SvgIcon from "@/components/SvgIcon.vue"
import IconSelect from "@/components/IconSelect.vue"

const emit = defineEmits(["update:dialogVisible", "refresh"])

const props = defineProps({
    dialogVisible: {
        required: true,
        type: Boolean
    },
    formDialog: {
        required: true,
        type: FormDialog
    }
})

const title = `${props.formDialog.isEdit ? "编辑" : "新增"} 菜单`
const formData = ref<Menu>(new Menu())
const rules = ref<FormRules>({})

let comfirmBtnLoading = ref<boolean>(false)

let menuSelectTree = ref<Array<SelectTree>>([{ value: -1, label: "顶级类目", children: [] }])

const closeDialog = () => {
    emit("update:dialogVisible", false)
}

/**
 * 确认
 */
const handleComfirm = () => {
    comfirmBtnLoading.value = true;
    if (props.formDialog.isEdit) {
        edit(formData.value).then(() => {
            ElMessage({
                type: "success",
                message: "编辑成功"
            });
            closeDialog();
            emit("refresh")
            comfirmBtnLoading.value = false;
        }).catch(() => {
            comfirmBtnLoading.value = false;
        })
    } else {
        add(formData.value).then(() => {
            ElMessage({
                type: "success",
                message: "添加成功"
            });
            closeDialog();
            emit("refresh")
            comfirmBtnLoading.value = false;
        }).catch(() => {
            comfirmBtnLoading.value = false;
        })
    }
}

const getSelectTree = () => {
    selectTree().then(({ data }) => {
        menuSelectTree.value[0].children = data;
    })
}

const selected = (name: string) => {
    formData.value.icon = name;
}

onMounted(() => {
    if (props.formDialog.isEdit) {
        formData.value = JSON.parse(JSON.stringify(props.formDialog.formData))
    }
    getSelectTree();
})
</script>

<template>
    <el-dialog v-model="dialogVisible" draggable :title="title" :before-close="closeDialog" width="610px">
        <el-form ref="form" :model="formData" :inline="true" :rules="rules" label-width="75px" class="demo-form-inline">

            <el-form-item label="菜单类型" prop="type">
                <el-radio-group v-model="formData.type" style="width: 202px;">
                    <el-radio-button :label="1">目录</el-radio-button>
                    <el-radio-button :label="2">菜单</el-radio-button>
                    <el-radio-button :label="3">按钮</el-radio-button>
                </el-radio-group>
            </el-form-item>

            <el-form-item v-show="formData.type !== 3" label="菜单图标" prop="icon">
                <div style="width: 470px">
                    <el-popover placement="bottom-start" :width="470" trigger="click">
                        <template #reference>
                            <el-input v-model="formData.icon" placeholder="点击选择图标" readonly>
                                <template #prefix>
                                    <SvgIcon v-if="formData.icon" :name="formData.icon as any" />
                                </template>
                            </el-input>
                        </template>
                        <IconSelect @selected="selected" />
                    </el-popover>
                </div>
            </el-form-item>

            <el-form-item v-show="formData.type !== 3" label="外链菜单" prop="icon">
                <el-radio-group v-model="formData.externalLinks">
                    <el-radio-button :label="1">是</el-radio-button>
                    <el-radio-button :label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="formData.type !== 3" label="菜单可见" prop="visible">
                <el-radio-group v-model="formData.visible">
                    <el-radio-button :label="1">是</el-radio-button>
                    <el-radio-button :label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item v-show="formData.type === 2" label="菜单缓存" prop="keepAlive">
                <el-radio-group v-model="formData.keepAlive">
                    <el-radio-button :label="1">是</el-radio-button>
                    <el-radio-button :label="0">否</el-radio-button>
                </el-radio-group>
            </el-form-item>
            <el-form-item :label="formData.type === 3 ? '按钮名称' : '菜单名称'" prop="name">
                <el-input v-model="formData.name" autocomplete="off"
                    :style="formData.type === 1 ? 'width: 470px;' : 'width: 192px;'" />
            </el-form-item>
            <el-form-item v-show="(formData.type === 2 && formData.externalLinks === 0) || formData.type === 3"
                label="权限标识" prop="permission">
                <el-input v-model="formData.permission" autocomplete="off" style="width: 192px;" />
            </el-form-item>
            <el-form-item v-show="formData.type !== 3" :label="formData.externalLinks === 0 ? '路由地址' : '外链地址'"
                prop="path">
                <el-input v-model="formData.path" autocomplete="off" style="width: 192px;" />
            </el-form-item>
            <el-form-item label="菜单排序" prop="sort">
                <el-input-number v-model="formData.sort" :min="1" :max="999" autocomplete="off" style="width: 192px;" />
            </el-form-item>
            <el-form-item v-show="formData.type === 2 && formData.externalLinks === 0" label="组件名称"
                prop="componentName">
                <el-input v-model="formData.componentName" autocomplete="off" style="width: 192px;" />
            </el-form-item>
            <el-form-item v-show="formData.type === 2 && formData.externalLinks === 0" label="组件路径" prop="component">
                <el-input v-model="formData.component" autocomplete="off" style="width: 192px;" />
            </el-form-item>
            <el-row>
                <el-col :span="24">
                    <el-form-item label="上级类目" prop="parentId">
                        <el-tree-select v-model="formData.parentId" :data="menuSelectTree" :check-strictly="true"
                            :render-after-expand="false" style="width: 470px;" />
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="handleComfirm" :loading="comfirmBtnLoading">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<style scoped lang="scss">
.el-form--inline .el-form-item {
    margin-right: 10px !important;
}
</style>