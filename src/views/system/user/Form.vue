<script setup lang="ts">
import { ref, onMounted } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";
import { getLoading } from "@/util/element-plus";

import { isPhone } from "@/util/validate";

import { saveUser, updateUser } from "@/api/system/user";
import { getDeptSelectTree } from "@/api/system/dept";
import { getAllRoles } from "@/api/system/role";

import type { SelectTree } from "@/entity";
import { UserForm } from "@/entity/system/user";
import type { Role } from "@/entity/system/role";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: UserForm;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 用户`;

const form = ref(ElForm);
const formData = ref(new UserForm());

const validatePhone = (_rule: any, value: any, callback: any) => {
  if (value && !isPhone(value)) {
    callback(new Error("手机号不合法"));
  }
  callback();
};
const rules = ref<FormRules>({
  username: [{ required: true, message: "用户名不能为空", trigger: "blur" }],
  nickname: [{ required: true, message: "昵称不能为空", trigger: "blur" }],
  phone: [{ validator: validatePhone, trigger: "blur" }],
});

const comfirmLoading = ref<boolean>(false);

const deptSelectTree = ref<Array<SelectTree>>([]);

const roleOptions = ref<Array<Role>>([]);

const sexOptions = [
  {
    label: "男",
    value: 1,
  },
  {
    label: "女",
    value: 2,
  },
];

function closeDialog() {
  emit("update:dialogVisible", false);
}

function handleComfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      comfirmLoading.value = true;

      if (props.isEdit === true) {
        updateUser(formData.value)
          .then(() => {
            ElMessage.success(`编辑成功`);
            closeDialog();
            emit("refresh");
          })
          .catch(() => {});
      } else {
        saveUser(formData.value)
          .then(() => {
            ElMessage.success(`新增成功`);
            closeDialog();
            emit("refresh");
            comfirmLoading.value = false;
          })
          .catch(() => {
            comfirmLoading.value = false;
          });
      }
    }
  });
}

onMounted(async () => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
  }

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
    draggable
    :title="title"
    :before-close="closeDialog"
    width="400px"
  >
    <el-form ref="form" :model="formData" :rules="rules" label-width="85px">
      <el-form-item label="用户名" prop="username">
        <el-input v-model="formData.username" autocomplete="off" />
      </el-form-item>
      <el-form-item label="用户昵称" prop="nickname">
        <el-input v-model="formData.nickname" autocomplete="off" />
      </el-form-item>
      <el-form-item label="所属部门">
        <el-tree-select
          v-model="formData.deptId"
          :data="deptSelectTree"
          :check-strictly="true"
          :render-after-expand="false"
          placeholder="请选择部门"
          style="width: 300px"
        />
      </el-form-item>
      <el-form-item label="手机号码" prop="phone">
        <el-input v-model="formData.phone" autocomplete="off" />
      </el-form-item>
      <el-form-item label="角色">
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
      <el-form-item label="性别" prop="sex">
        <el-select v-model="formData.sex">
          <el-option
            v-for="item in sexOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="生日" prop="bday">
        <el-date-picker
          v-model="formData.bday"
          type="date"
          placeholder="选择一个日期"
        />
      </el-form-item>
      <el-form-item label="状态">
        <el-radio-group v-model="formData.enabled">
          <el-radio-button label="1">启用</el-radio-button>
          <el-radio-button label="0">禁用</el-radio-button>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm"
          :loading="comfirmLoading"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
