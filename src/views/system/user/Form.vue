<script setup lang="ts">
/**
 * 用户表单
 * @author ZnPi
 * @date 2022-09-15
 */
import { ref, onMounted } from 'vue';
import { ElForm, ElMessage, type FormRules } from 'element-plus'

import { getLoading } from '@/util/element-plus'
import { isPhone } from '@/util/validate';

import { User } from '@/entity/system/user';
import type { DeptTree } from '@/entity/system/dept';
import type { Role } from '@/entity/system/role';

import { add, edit } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept';
import { getAllRoles } from '@/api/system/role';

const emit = defineEmits(["update:dialogVisible", "refresh"])

const props = defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    },
    isEdit: {
        type: Boolean,
        required: false,
        default: false
    },
    form: {
        type: Object,
        required: false,
        default: {}
    }
})

let title = `${props.isEdit ? "编辑" : "新增"} 用户`
let form = ref(ElForm)
let formData = ref<User>(new User());
let comfirmLoading = ref<boolean>(false);


const validatePhone = (rule: any, value: any, callback: any) => {
    if (value !== '' && !isPhone(value)) {
        callback(new Error("手机号不合法"));
    }
    callback();
}
const rules = ref<FormRules>({
    username: [
        { required: true, message: "用户名不能为空", trigger: "blur" }
    ],
    nickname: [
        { required: true, message: "昵称不能为空", trigger: "blur" }
    ],
    phone: [
        { validator: validatePhone, trigger: "blur" }
    ]
})

let deptTree = ref<Array<DeptTree>>();
let roleOptions = ref<Array<Role>>();

const closeDialog = () => {
    emit('update:dialogVisible', false)
}

const handleComfirm = () => {
    comfirmLoading.value = true;
    if (props.isEdit === true) {
        edit(formData.value).then(() => {
            ElMessage({
                message: `编辑成功`,
                type: "success"
            })
            closeDialog();
            emit("refresh");
            comfirmLoading.value = false;
        }).catch(() => {
            comfirmLoading.value = false;
        })
    } else {
        add(formData.value).then(() => {
            ElMessage({
                message: `新增成功`,
                type: "success"
            })
            closeDialog();
            emit("refresh");
            comfirmLoading.value = false;
        }).catch(() => {
            comfirmLoading.value = false;
        })
    }
}

onMounted(async () => {
    if (props.isEdit) {
        formData.value = JSON.parse(JSON.stringify(props.form));
    }
    const loading = getLoading();
    await Promise.all([getDeptTree(), getAllRoles()])
        .then(function (results) {
            deptTree.value = results[0].data;
            roleOptions.value = results[1].data;
            loading.close();
        })
        .catch(() => {
            loading.close();
        });
});
</script>

<template>
    <el-dialog v-model="dialogVisible" draggable :title="title" :before-close="closeDialog" width="400px">
        <el-form ref="form" :model="formData" :rules="rules" label-width="85px">
            <el-form-item label="用户名" prop="username">
                <el-input v-model="formData.username" autocomplete="off" />
            </el-form-item>
            <el-form-item label="用户昵称" prop="nickname">
                <el-input v-model="formData.nickname" autocomplete="off" />
            </el-form-item>
            <el-form-item label="所属部门">
                <el-tree-select v-model="formData.deptId" :data="deptTree" :props="{ label: 'name' }" value-key="id"
                    :check-strictly="true" :render-after-expand="false" placeholder="请选择部门" style="width: 300px" />
            </el-form-item>
            <el-form-item label="手机号码" prop="phone">
                <el-input v-model="formData.phone" autocomplete="off" />
            </el-form-item>
            <el-form-item label="角色">
                <el-select v-model="formData.roleIds" multiple collapse-tags collapse-tags-tooltip placeholder="请选择角色"
                    style="width: 300px">
                    <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="状态">
                <el-radio-group v-model="formData.enabled">
                    <el-radio-button label=1>启用</el-radio-button>
                    <el-radio-button label=0>禁用</el-radio-button>
                </el-radio-group>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="closeDialog">取消</el-button>
                <el-button type="primary" @click="handleComfirm" :loading="comfirmLoading">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>