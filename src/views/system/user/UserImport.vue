<script setup lang="ts">
/**
* 用户导入弹窗
* @author ZnPi
* @date 2022-09-16
*/
import { ref, onMounted } from 'vue';

import { UploadFilled } from '@element-plus/icons-vue'
import { type UploadFile, type UploadFiles, type UploadInstance, type UploadRawFile, type FormRules, ElForm, genFileId, ElMessage } from 'element-plus'

import { getLoading } from '@/util/element-plus'
import { isNotSheet } from "@/util/validate"

import type { DeptTree } from '@/entity/system/dept';
import type { Role } from '@/entity/system/role';
import { UserImportForm } from '@/entity/system/user'

import { getDeptTree } from '@/api/system/dept';
import { getAllRoles } from '@/api/system/role';
import { importUser } from '@/api/system/user'

defineProps({
    dialogVisible: {
        type: Boolean,
        required: true
    }
});

const emit = defineEmits(["update:dialogVisible", "refresh"]);

let form = ref(ElForm)

let formData = ref<UserImportForm>(new UserImportForm());

const rules = ref<FormRules>({

});

let deptTree = ref<Array<DeptTree>>();
let roleOptions = ref<Array<Role>>();

const upload = ref<UploadInstance>()

const handleClose = () => {
    emit("update:dialogVisible", false);
}

const handleComfirm = () => {
    form.value.validate((valid: any) => {
        if (valid) {
            if (!formData.value.file) {
                ElMessage({ type: "error", message: "请上传文件" })
                return;
            }
            importUser(formData.value).then(({ data }) => {
                ElMessage({ type: "success", message: data });
                emit("update:dialogVisible", false);
                emit("refresh")
            })
        }
    });
}

const handleFileChange = (uploadFile: UploadFile, uploadFiles: UploadFiles) => {
    if (isNotSheet(uploadFile.name)) {
        ElMessage({
            type: "error",
            message: "只接受 xlsx xls 文件"
        });
        upload.value?.clearFiles();
        formData.value.file = undefined;
        return;
    }
    if (uploadFiles.length > 1) {
        upload.value?.clearFiles();
        const file = uploadFile.raw as UploadRawFile
        file.uid = genFileId()
        upload.value!.handleStart(file)
    }
    formData.value.file = uploadFile.raw;
}

onMounted(async () => {
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
})
</script>

<template>
    <el-dialog v-model="dialogVisible" title="导入用户" width="400px" :before-close="handleClose">
        <el-form ref="form" :model="formData" :rules="rules" label-width="50px">
            <el-form-item label="部门" prop="deptId">
                <el-tree-select v-model="formData.deptId" :data="deptTree" :props="{ label: 'name' }" value-key="id"
                    :check-strictly="true" :render-after-expand="false" placeholder="请选择部门" style="width: 300px" />
            </el-form-item>
            <el-form-item label="角色" prop="roleIds">
                <el-select v-model="formData.roleIds" multiple collapse-tags collapse-tags-tooltip placeholder="请选择角色"
                    style="width: 300px">
                    <el-option v-for="item in roleOptions" :key="item.id" :label="item.name" :value="item.id" />
                </el-select>
            </el-form-item>
            <el-form-item label="文件">
                <el-upload ref="upload" :auto-upload="false" :on-change="handleFileChange" drag action=""
                    accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                    style="width: 100%">
                    <el-icon class="el-icon--upload">
                        <upload-filled />
                    </el-icon>
                    <div class="el-upload__text">
                        将文件拖到此处，或 <em>点击上传</em>
                    </div>
                </el-upload>
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="handleComfirm">确认</el-button>
            </span>
        </template>
    </el-dialog>
</template>
