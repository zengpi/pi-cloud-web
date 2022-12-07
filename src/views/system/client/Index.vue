<script setup name="RegisteredClient" lang="ts">
import { ref, onMounted } from "vue";

import { ElMessageBox, ElMessage, ElTable, ElForm } from "element-plus";
import {
  RefreshLeft,
  Search,
  Plus,
  Edit,
  Delete,
  Lock,
  Refresh,
} from "@element-plus/icons-vue";

import { BaseQuery, BaseDialog } from "@/entity";
import {
  RegisteredClient,
  ResetPassForm,
  AuthorizationGrantTypeEnum,
} from "@/entity/system/client";

import { getClients, deleteClient, saveOrUpdate } from "@/api/system/client";

import Pagination from "@/components/Pagination.vue";
import Form from "./Form.vue";

const showQuery = ref(true);
const query = ref(new BaseQuery());

const table = ref(ElTable);
const tableData = ref<RegisteredClient[]>([]);
const total = ref(0);
const loading = ref(false);

const delBtnLoading = ref(false);

const formDialog = ref(new BaseDialog<RegisteredClient>());

const form = ref(ElForm);
const resetPassFormData = ref<ResetPassForm>({});

const resetPassDialogVisible = ref(false);

const resetPassConfirmLoading = ref(false);

const validConfirmPass = (_rule: any, _value: any, callback: any) => {
  if (
    resetPassFormData.value.clientSecret !==
    resetPassFormData.value.clientSecretConfirm
  ) {
    callback(new Error("两次输入的密码不一致"));
  }
  callback();
};

const resetPassFormRules = {
  clientSecret: [{ required: true, trigger: "blur", message: "密码不能为空" }],
  clientSecretConfirm: [
    { required: true, trigger: "blur", message: "请再次输入密码" },
    { validator: validConfirmPass, trigger: "blur" },
  ],
};

function loadData() {
  loading.value = true;
  getClients(query.value)
    .then(({ data }) => {
      tableData.value = data.records;
      total.value = data.total;
      loading.value = false;
    })
    .catch(() => {
      loading.value = false;
    });
}

function handleResetQuery() {
  query.value = new BaseQuery();
  loadData();
}

function handleAdd() {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = false;
}

function handleEdit(row: RegisteredClient) {
  formDialog.value.dialogVisible = true;
  formDialog.value.props.isEdit = true;
  formDialog.value.props.formData = row;
}

function handleDel(row: RegisteredClient) {
  if (!row.id) {
    ElMessage.error("id 不能为空");
    return;
  }
  doDel(row.id.toString());
}

function handleDelBatch() {
  const rows: Array<RegisteredClient> = table.value.getSelectionRows();
  if (!rows || rows.length <= 0) {
    ElMessage.warning("至少选择一条记录");
    return;
  }
  doDel(rows.map((e: RegisteredClient) => e.id).join(","));
}

function doDel(ids: string) {
  ElMessageBox.confirm("将永久删除选中的记录，是否继续？", "警告", {
    confirmButtonText: "是",
    cancelButtonText: "否",
    type: "warning",
  }).then(() => {
    delBtnLoading.value = true;

    deleteClient(ids)
      .then(() => {
        ElMessage.success("删除成功");
        loadData();
        delBtnLoading.value = false;
      })
      .catch(() => {
        delBtnLoading.value = false;
      });
  });
}

function handleAuthorizationGrantTypes(authorizationGrantTypes: string) {
  if (!authorizationGrantTypes) return "";
  let authorizationGrantTypeArr = authorizationGrantTypes.split(",");
  let rst = "";
  authorizationGrantTypeArr.forEach((item) => {
    if (rst) rst += " | ";
    rst +=
      AuthorizationGrantTypeEnum[
        item as keyof typeof AuthorizationGrantTypeEnum
      ];
  });
  return rst;
}

function handleResetPass(id: number) {
  resetPassDialogVisible.value = true;
  resetPassFormData.value.id = id;
}

function handleCloseResetPassDialog() {
  resetPassDialogVisible.value = !resetPassDialogVisible.value;
  form.value.resetFields();
}

function handleResetPassComfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      resetPassConfirmLoading.value = true;
      saveOrUpdate(resetPassFormData.value, true)
        .then(() => {
          ElMessage.success("操作成功");
          handleCloseResetPassDialog();
          resetPassConfirmLoading.value = false;
        })
        .catch(() => {
          resetPassConfirmLoading.value = false;
        });
    }
  });
}

onMounted(() => {
  loadData();
});
</script>

<template>
  <div class="app-container">
    <div class="head-container">
      <div class="query">
        <template v-if="showQuery">
          <el-input
            v-model="query.keyWord"
            clearable
            placeholder="客户端ID/名称"
            class="query-item"
            style="width: auto"
            @keyup.enter="loadData"
          />
          <el-button
            type="success"
            :icon="Search"
            class="query-item"
            @click="loadData"
          >
            搜索</el-button
          >
          <el-button
            type="warning"
            :icon="RefreshLeft"
            class="query-item"
            @click="handleResetQuery"
            >重置
          </el-button>
        </template>
      </div>
      <div class="tools">
        <div class="tools-left">
          <el-button
            v-has-authority="['sys_client_add']"
            type="primary"
            :icon="Plus"
            class="tool-item"
            @click="handleAdd"
            >新增</el-button
          >
          <el-button
            v-has-authority="['sys_client_delete']"
            type="danger"
            :icon="Delete"
            :loading="delBtnLoading"
            class="tool-item"
            @click="handleDelBatch"
          >
            删除
          </el-button>
        </div>
        <div class="tools-right">
          <el-button-group class="ml-4">
            <el-tooltip content="显示/隐藏搜索">
              <el-button :icon="Search" @click="showQuery = !showQuery" />
            </el-tooltip>
            <el-tooltip content="刷新">
              <el-button :icon="Refresh" @click="loadData" />
            </el-tooltip>
          </el-button-group>
        </div>
      </div>
    </div>
    <el-table ref="table" :data="tableData" v-loading="loading" stripe border>
      <el-table-column type="selection" width="55" />
      <el-table-column prop="clientId" label="客户端ID" width="90" />
      <el-table-column
        prop="clientName"
        label="名称"
        width="110"
        show-overflow-tooltip
      />
      <el-table-column
        prop="clientAuthenticationMethods"
        label="认证方式"
        width="150"
        show-overflow-tooltip
      />
      <el-table-column
        prop="authorizationGrantTypes"
        label="授权类型"
        min-width="220"
        show-overflow-tooltip
        #default="{ row }"
      >
        <span>{{
          handleAuthorizationGrantTypes(row.authorizationGrantTypes)
        }}</span>
      </el-table-column>
      <el-table-column
        prop="redirectUris"
        label="重定向URI"
        width="200"
        show-overflow-tooltip
      />
      <el-table-column
        prop="scopes"
        label="作用域"
        width="90"
        show-overflow-tooltip
      />
      <el-table-column
        prop="requireAuthorizationConsent"
        label="授权许可"
        width="90"
        #default="{ row }"
      >
        <span v-if="row.requireAuthorizationConsent === 1">是</span>
        <span v-else>否</span>
      </el-table-column>
      <el-table-column
        prop="accessTokenFormat"
        label="访问令牌格式"
        width="110"
        #default="{ row }"
      >
        <span v-if="row.accessTokenFormat === 'self-contained'">JWT</span>
        <span v-else-if="row.accessTokenFormat === 'reference'">Opaque</span>
      </el-table-column>
      <el-table-column
        prop="accessTokenTimeToLive"
        label="访问令牌有效期(s)"
        width="150"
      />
      <el-table-column
        prop="refreshTokenTimeToLive"
        label="刷新令牌有效期(s)"
        width="150"
      />
      <el-table-column fixed="right" label="操作" width="220px" align="center">
        <template #default="scope">
          <el-tooltip content="重置密码" placement="top">
            <el-button
              v-has-authority="['sys_client_edit']"
              type="warning"
              :icon="Lock"
              @click="handleResetPass(scope.row.id)"
            />
          </el-tooltip>
          <el-tooltip content="编辑" placement="top">
            <el-button
              v-has-authority="['sys_client_edit']"
              type="primary"
              :icon="Edit"
              @click="handleEdit(scope.row)"
            />
          </el-tooltip>
          <el-tooltip content="删除" placement="top">
            <el-button
              v-has-authority="['sys_client_delete']"
              type="danger"
              :icon="Delete"
              :loading="delBtnLoading"
              @click="handleDel(scope.row)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
    </el-table>
    <Pagination
      :total="total"
      v-model:current-page="query.pageNum"
      v-model:page-size="query.pageSize"
      @pagination="loadData"
    />
    <Form
      v-if="formDialog.dialogVisible"
      v-model:dialog-visible="formDialog.dialogVisible"
      v-bind="formDialog.props"
      @refresh="loadData"
    />
    <el-dialog
      v-if="resetPassDialogVisible"
      v-model="resetPassDialogVisible"
      draggable
      title="重置密码"
      :before-close="handleCloseResetPassDialog"
      width="400px"
    >
      <el-form
        ref="form"
        :model="resetPassFormData"
        :rules="resetPassFormRules"
        label-width="90px"
      >
        <el-form-item label="密码" prop="clientSecret">
          <el-input
            v-model="resetPassFormData.clientSecret"
            type="password"
            placeholder="请输入密码"
            show-password
          />
        </el-form-item>
        <el-form-item label="确认密码" prop="clientSecretConfirm">
          <el-input
            v-model="resetPassFormData.clientSecretConfirm"
            type="password"
            placeholder="请在次输入密码"
            show-password
          />
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="handleCloseResetPassDialog">取消</el-button>
          <el-button
            type="primary"
            @click="handleResetPassComfirm"
            :loading="resetPassConfirmLoading"
            >确认
          </el-button>
        </span>
      </template>
    </el-dialog>
  </div>
</template>
