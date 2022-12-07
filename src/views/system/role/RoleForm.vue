<script setup lang="ts">
import { ref, onMounted } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";

import { saveOrUpdate } from "@/api/system/role";

import { Role } from "@/entity/system/role";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: Role;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 角色`;

const form = ref(ElForm);
const formData = ref(new Role());
const rules = ref<FormRules>({
  name: [{ required: true, message: "角色名称不能为空", trigger: "blur" }],
  roleCode: [{ required: true, message: "角色编码不能为空", trigger: "blur" }],
});

const comfirmBtnLoading = ref(false);

const closeDialog = () => {
  emit("update:dialogVisible", false);
};

const handleConfirm = () => {
  form.value.validate((valid: boolean) => {
    if (valid) {
      comfirmBtnLoading.value = true;

      saveOrUpdate(formData.value, props.isEdit)
        .then(() => {
          ElMessage.success("操作成功");
          closeDialog();
          emit("refresh");
          comfirmBtnLoading.value = false;
        })
        .catch(() => {
          comfirmBtnLoading.value = false;
        });
    }
  });
};

onMounted(() => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
  }
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="closeDialog"
    width="400px"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="85px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色编码" prop="roleCode">
        <el-input v-model="formData.roleCode" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色描述" prop="username">
        <el-input v-model="formData.roleDesc" autocomplete="off" />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleConfirm"
          :loading="comfirmBtnLoading"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
