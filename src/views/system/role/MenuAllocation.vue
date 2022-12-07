<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";

import { ElMessage, type ElTree } from "element-plus";
import { CircleCheck } from "@element-plus/icons-vue";

import { getMenuSelectTree, getMenuIdsByRoleId } from "@/api/system/menu";
import { allocateRoleMenu } from "@/api/system/role";

import type { ComponentProps, SelectTree } from "@/entity";
import { RoleMenuAllocation } from "@/entity/system/role";

const props = defineProps<{
  componentProps: ComponentProps;
}>();

const treeRef = ref<InstanceType<typeof ElTree>>();

const treeData = ref<Array<SelectTree>>();

const filterText = ref("");

const confirmLoading = ref(false);

const roleId = computed(() => props.componentProps.id);

watch(filterText, (val) => {
  treeRef.value!.filter(val);
});

watch(roleId, () => {
  loadMenuIdsByRoleId();
});

const filterNode = (value: string, data: SelectTree): boolean => {
  if (!value) return true;
  return data.label!.includes(value);
};

/**
 * 根据 RoleId 获取菜单 ID
 */
const loadMenuIdsByRoleId = () => {
  getMenuIdsByRoleId(roleId.value).then(({ data }) => {
    treeRef.value!.setCheckedKeys(data);
  });
};

const handleConfirm = () => {
  if (!roleId.value) {
    ElMessage.warning("请选择角色");
    return;
  }
  confirmLoading.value = true;

  const nodes = treeRef.value!.getCheckedNodes(false, true);
  allocateRoleMenu(
    new RoleMenuAllocation(roleId.value, nodes.map((e) => e.value).join(","))
  )
    .then(() => {
      ElMessage.success("分配成功");
      confirmLoading.value = false;
    })
    .catch(() => {
      confirmLoading.value = false;
    });
};

onMounted(() => {
  getMenuSelectTree(true).then(({ data }) => {
    treeData.value = data;
  });
});
</script>

<template>
  <div>
    <div>
      <el-input class="filter" v-model="filterText" placeholder="关键词" />
      <el-button
        type="primary"
        :icon="CircleCheck"
        :loading="confirmLoading"
        @click="handleConfirm"
        >提交
      </el-button>
    </div>
    <el-tree
      ref="treeRef"
      show-checkbox
      :data="treeData"
      node-key="value"
      :filter-node-method="filterNode"
    />
  </div>
</template>

<style scoped lang="scss">
.filter {
  width: 84%;
  margin-right: 5px;
}
</style>
