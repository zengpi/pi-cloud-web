<script setup lang="ts">
import { ref } from "vue";
import { ElMessageBox } from "element-plus";
import { CaretBottom } from "@element-plus/icons-vue";

import { useRoute, useRouter } from "vue-router";
import useStore from "@/stores";

import { logout } from "@/api/system/user";

import Breadcrumb from "./Breadcrumb.vue";
import LocaleSelect from "@/components/LocaleSelect.vue";
import SizeSelect from "./SizeSelect.vue";
import SvgIcon from "@/components/SvgIcon.vue";

const EXPAND = "expand";
const FOLD = "fold";

const route = useRoute();
const router = useRouter();
const { useAppStore, useUserStore, useTabStore, useRouterStore } = useStore();

const toogleSidebarBtn = ref(useAppStore.sidebarCollapsed ? EXPAND : FOLD);

function toggleSideBar() {
  toogleSidebarBtn.value = toogleSidebarBtn.value === FOLD ? EXPAND : FOLD;
  useAppStore.toggleSidebar();
}

function handleLogout() {
  ElMessageBox.confirm("确定注销并退出系统吗？", "提示", {
    confirmButtonText: "确定",
    cancelButtonText: "取消",
    type: "warning",
  }).then(() => {
    logout().then(() => {
      useUserStore.reset();
      useTabStore.$reset();
      useRouterStore.$reset();
      router.push(`/login?redirect=${route.fullPath}`);
    });
  });
}
</script>

<template>
  <div class="toolbar-container">
    <div class="fold-container" @click="toggleSideBar">
      <SvgIcon :name="toogleSidebarBtn" width="20px" height="20px" />
    </div>

    <Breadcrumb />

    <div class="tools-container">
      <SizeSelect id="size-select" class="tool" />
      <LocaleSelect class="tool" />
      <el-tooltip :content="$t('toolbar.document')" placement="bottom">
        <a target="_blank" href="https://www.yuque.com/zengpi/szfuh0">
          <SvgIcon name="document" width="20" height="20" class="tool" />
        </a>
      </el-tooltip>
      <div class="avatar-container">
        <img :src="useUserStore.avatar" class="avatar" />
      </div>

      <el-dropdown class="username-container tool" trigger="hover">
        <div class="username-wrapper">
          <span>{{ useUserStore.nickname }}</span>
          <CaretBottom style="width: 0.6em; height: 0.6em; margin-left: 5px" />
        </div>

        <template #dropdown>
          <el-dropdown-menu>
            <RouterLink to="/">
              <el-dropdown-item>{{ $t("toolbar.dashboard") }}</el-dropdown-item>
            </RouterLink>

            <RouterLink to="/profile">
              <el-dropdown-item>{{ $t("toolbar.info") }}</el-dropdown-item>
            </RouterLink>
            <el-dropdown-item divided @click="handleLogout">
              {{ $t("toolbar.logout") }}
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.toolbar-container {
  height: 50px;
  position: relative;
  background: #fff;
  border-bottom: 1px solid rgba(0, 21, 41, 0.08);

  .fold-container {
    line-height: 54px;
    height: 100%;
    padding: 0px 11px;
    float: left;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .tools-container {
    float: right;
    height: 100%;
    line-height: 50px;

    .tool {
      padding: 0 8px;
      height: 100%;
      color: #5a5e66;
      align-items: center;
      cursor: pointer;

      &:hover {
        background: rgba(0, 0, 0, 0.025);
      }
    }

    .avatar-container {
      display: inline-flex;
      height: 100%;
      align-items: center;
      padding: 0 8px;

      .avatar {
        width: 40px;
        height: 40px;
        border-radius: 10px;
      }
    }
  }

  .username-container {
    margin-right: 20px;

    .username-wrapper {
      font-size: 14px;
    }
  }
}
</style>
