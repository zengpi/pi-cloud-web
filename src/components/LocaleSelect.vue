<script setup lang="ts">
import { computed } from "vue";
import { ElMessage } from "element-plus";
import { useI18n } from "vue-i18n";

import useStore from "@/stores";
import SvgIcon from "@/components/SvgIcon.vue";

const { useAppStore } = useStore();

const language = computed(() => useAppStore.locale);
const { locale } = useI18n();

function handleLocaleChange(lang: string) {
  locale.value = lang;
  useAppStore.setLocale(lang);

  if (lang == "en") {
    ElMessage.success("Switch Language Successful!");
  } else {
    ElMessage.success("切换语言成功！");
  }
}
</script>

<template>
  <el-dropdown trigger="hover" @command="handleLocaleChange">
    <SvgIcon name="language" width="20" height="20" />
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item :disabled="language === 'zh'" command="zh">
          中文
        </el-dropdown-item>
        <el-dropdown-item :disabled="language === 'en'" command="en">
          English
        </el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>
