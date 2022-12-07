<script setup lang="ts">
import { ref, onMounted, watch } from "vue";
import { ElForm, ElMessage, type FormRules } from "element-plus";

import {
  RegisteredClient,
  AuthenticationMethodEnum,
} from "@/entity/system/client";

import { saveOrUpdate } from "@/api/system/client";

const emit = defineEmits<{
  (e: "update:dialogVisible", dialogVisible: boolean): void;
  (e: "refresh"): void;
}>();

const props = withDefaults(
  defineProps<{
    dialogVisible: boolean;
    isEdit?: boolean;
    formData?: RegisteredClient;
  }>(),
  {
    dialogVisible: false,
    isEdit: false,
  }
);

const title = `${props.isEdit ? "编辑" : "新增"} 客户端`;

const form = ref(ElForm);
const formData = ref<RegisteredClient>(new RegisteredClient());
const rules = ref<FormRules>({
  clientId: [{ required: true, message: "客户端ID不能为空", trigger: "blur" }],
  clientName: [
    { required: true, message: "客户端名称不能为空", trigger: "blur" },
  ],
  authorizationGrantTypes: [
    { required: true, message: "授权类型不能为空", trigger: "blur" },
  ],
  scopes: [{ required: true, message: "SCOPE不能为空", trigger: "blur" }],
  accessTokenTimeToLive: [
    { required: true, message: "访问令牌有效期不能为空", trigger: "blur" },
  ],
  refreshTokenTimeToLive: [
    { required: true, message: "刷新令牌有效期不能为空", trigger: "blur" },
  ],
});

const confirmLoading = ref(false);

const AuthorizationGrantTypeOptions = [
  {
    label: "授权码模式",
    value: "authorization_code",
  },
  {
    label: "客户端凭证",
    value: "client_credentials",
  },
  {
    label: "刷新令牌",
    value: "refresh_token",
  },
  {
    label: "密码模式",
    value: "password",
  },
];
const accessTokenFormatOptions = [
  {
    label: "JWT",
    value: "self-contained",
  },
  {
    label: "Opaque",
    value: "reference",
  },
];

const authorizationGrantTypes = ref<string[]>([]);

watch(authorizationGrantTypes, () => {
  formData.value.authorizationGrantTypes =
    authorizationGrantTypes.value.join(",");
});

function closeDialog() {
  emit("update:dialogVisible", false);
}

function handleComfirm() {
  form.value.validate((valid: boolean) => {
    if (valid) {
      confirmLoading.value = true;

      saveOrUpdate(formData.value, props.isEdit)
        .then(() => {
          ElMessage.success("操作成功");
          closeDialog();
          emit("refresh");
        })
        .catch(() => {
          confirmLoading.value = false;
        });
    }
  });
}

onMounted(() => {
  if (props.isEdit) {
    formData.value = JSON.parse(JSON.stringify(props.formData));
    if (formData.value.authorizationGrantTypes) {
      authorizationGrantTypes.value =
        formData.value.authorizationGrantTypes.split(",") as string[];
    }
  }
});
</script>

<template>
  <el-dialog
    v-model="dialogVisible"
    draggable
    :title="title"
    :before-close="closeDialog"
    width="800px"
  >
    <el-divider content-position="left">
      <span style="color: red"
        >提示：如果有多个 SCOPE 或 重定向
        URI，请使用逗号分隔；新建客户端默认密码为 123456；</span
      >
    </el-divider>
    <el-form ref="form" :model="formData" :rules="rules" label-width="125px">
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="客户端ID" prop="clientId">
            <el-input v-model="formData.clientId" autocomplete="off" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="客户端名称" prop="clientName">
            <el-input v-model="formData.clientName" autocomplete="off" />
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="认证方式" prop="clientAuthenticationMethods">
            <el-select
              v-model="formData.clientAuthenticationMethods"
              placeholder="请选择"
              style="width: 450px"
            >
              <el-option
                v-for="item in AuthenticationMethodEnum"
                :key="item"
                :label="item"
                :value="item"
              />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="授权类型" prop="authorizationGrantTypes">
            <el-select
              v-model="authorizationGrantTypes"
              multiple
              collapse-tags
              collapse-tags-tooltip
              placeholder="请选择"
              style="width: 450px"
            >
              <el-option
                v-for="item in AuthorizationGrantTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="SCOPE" prop="scopes">
            <el-input
              type="textarea"
              v-model="formData.scopes"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="重定向URI" prop="redirectUris">
            <el-input
              type="textarea"
              v-model="formData.redirectUris"
              autocomplete="off"
            />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="授权许可" prop="requireAuthorizationConsent">
            <el-radio-group v-model="formData.requireAuthorizationConsent">
              <el-radio-button :label="1">是</el-radio-button>
              <el-radio-button :label="0">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访问令牌格式" prop="accessTokenFormat">
            <el-select
              v-model="formData.accessTokenFormat"
              placeholder="请选择"
              style="width: 450px"
            >
              <el-option
                v-for="item in accessTokenFormatOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>

      <el-row :gutter="20">
        <el-col :span="12">
          <el-form-item label="访问令牌有效期" prop="accessTokenTimeToLive">
            <el-input-number
              v-model="formData.accessTokenTimeToLive"
              :min="1"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="刷新令牌有效期" prop="refreshTokenTimeToLive">
            <el-input-number
              v-model="formData.refreshTokenTimeToLive"
              :min="1"
              controls-position="right"
            />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <template #footer>
      <span class="dialog-footer">
        <el-button @click="closeDialog">取消</el-button>
        <el-button
          type="primary"
          @click="handleComfirm"
          :loading="confirmLoading"
          >确认</el-button
        >
      </span>
    </template>
  </el-dialog>
</template>

<style lang="scss">
.el-divider--horizontal {
  margin-top: 0;
}
</style>
