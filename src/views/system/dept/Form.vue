<script setup lang="ts">
import { ref, onMounted } from "vue";

import { ElForm, ElMessage, type FormRules } from "element-plus";

import type { SelectTree } from "@/entity";
import { DeptForm } from "@/entity/system/dept";

import { saveOrUpdate, getDeptSelectTree } from "@/api/system/dept";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: DeptForm;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 部门`;

const form = ref(ElForm);
const formData = ref(new DeptForm());
const rules = ref<FormRules>({
  name: [{ required: true, message: "部门名称不能为空", trigger: "blur" }],
});

const comfirmBtnLoading = ref(false);

const deptSelectTree = ref<SelectTree[]>([
  { value: 0, label: "顶级类目", children: [] },
]);

function closeDialog() {
  emit("update:dialogVisible", false);
}

function handleComfirm() {
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
}

/**
 * 初始化部门选择器（树形）
 */
function initDeptSelectTree() {
  getDeptSelectTree()
    .then(({ data }) => {
      deptSelectTree.value[0].children = data;
    })
    .catch(() => {});
}

onMounted(() => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
  }
  // 初始化部门选择器（树形）
  initDeptSelectTree();
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
    <el-form ref="form" :model="formData" :rules="rules" label-width="80px">
      <el-form-item label="部门名称" prop="name">
        <el-input v-model="formData.name" autocomplete="off" />
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model="formData.sort" :min="1" />
      </el-form-item>
      <el-form-item label="上级类目" prop="parentId">
        <el-tree-select
          v-model="formData.parentId"
          :data="deptSelectTree"
          :check-strictly="true"
          :render-after-expand="false"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm"
          :loading="comfirmBtnLoading"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>
