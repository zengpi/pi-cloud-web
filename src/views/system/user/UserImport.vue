<script setup lang="ts">
import { ref, onMounted } from "vue";

import {
  type UploadFile,
  type UploadFiles,
  type UploadInstance,
  type UploadRawFile,
  type FormRules,
  ElForm,
  genFileId,
  ElMessage,
} from "element-plus";
import { UploadFilled } from "@element-plus/icons-vue";

import { getDeptSelectTree } from "@/api/system/dept";
import { getAllRoles } from "@/api/system/role";
import { importUser } from "@/api/system/user";

import { getLoading } from "@/util/element-plus";
import { isNotSheet } from "@/util/validate";

import type { SelectTree } from "@/entity";
import type { Role } from "@/entity/system/role";
import { UserImportForm } from "@/entity/system/user";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

defineProps<{
  dialogVisible: boolean;
}>();

const form = ref(ElForm);
const formData = ref<UserImportForm>(new UserImportForm());
const rules = ref<FormRules>({});

const deptSelectTree = ref<Array<SelectTree>>();
const roleOptions = ref<Array<Role>>();

const upload = ref<UploadInstance>();

function handleClose() {
  emit("update:dialogVisible", false);
}

function handleComfirm() {
  form.value.validate((valid: any) => {
    if (valid) {
      if (!formData.value.file) {
        ElMessage.error("请上传文件");
        return;
      }
      importUser(formData.value).then(({ data }) => {
        ElMessage(data);
        emit("update:dialogVisible", false);
        emit("refresh");
      });
    }
  });
}

function handleFileChange(uploadFile: UploadFile, uploadFiles: UploadFiles) {
  if (isNotSheet(uploadFile.name)) {
    ElMessage.error("只接受 xlsx xls 文件");
    upload.value?.clearFiles();
    formData.value.file = undefined;
    return;
  }
  if (uploadFiles.length > 1) {
    upload.value?.clearFiles();
    const file = uploadFile.raw as UploadRawFile;
    file.uid = genFileId();
    upload.value!.handleStart(file);
  }
  formData.value.file = uploadFile.raw;
}

onMounted(async () => {
  const loading = getLoading();
  await Promise.all([getDeptSelectTree(), getAllRoles()])
    .then(function (results) {
      deptSelectTree.value = results[0].data;
      roleOptions.value = results[1].data;
      loading.close();
    })
    .catch(() => {
      loading.close();
    });
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    title="导入用户"
    width="400px"
    :before-close="handleClose"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="50px">
      <el-form-item label="部门" prop="deptId">
        <el-tree-select
          v-model="formData.deptId"
          :data="deptSelectTree"
          :check-strictly="true"
          :render-after-expand="false"
          placeholder="请选择部门"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="角色" prop="roleIds">
        <el-select
          v-model="formData.roleIds"
          multiple
          collapse-tags
          collapse-tags-tooltip
          placeholder="请选择角色"
          style="width: 300px"
        >
          <el-option
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文件">
        <el-upload
          ref="upload"
          :auto-upload="false"
          :on-change="handleFileChange"
          drag
          action=""
          accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
          style="width: 300px"
        >
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
