<script setup lang="ts">
import { computed, nextTick, ref, watch, onMounted, getCurrentInstance, type ComponentInternalInstance } from 'vue';
import { useRoute, useRouter, type RouteRecordRaw } from 'vue-router';
import type { TabPaneName, TabsPaneContext } from 'element-plus';
import { Refresh, CircleClose, Close, ArrowLeft, ArrowRight, SemiSelect } from '@element-plus/icons-vue';
import path from 'path-browserify';

import { genTitle } from '@/util/i18n';
import useStore from '@/stores';

import type { Tab } from '@/entity/navigation';

import SvgIcon from '@/components/SvgIcon.vue';
import settings from '@/settings';

const route = useRoute();
const router = useRouter();
const { useTabStore, useRouterStore } = useStore();
const { proxy } = getCurrentInstance() as ComponentInternalInstance;

const tabValue = ref("")
const tabMenuVisible = ref(false);
const targetTab = ref<Tab>({});
const left = ref(0);
const top = ref(0);

const tabs = computed<any[]>(() => useTabStore.tabs);

const routes = computed<Array<RouteRecordRaw>>(() => useRouterStore.routers);

const isFirstTab = computed(() => {
  try {
    if (targetTab.value.meta && targetTab.value.meta.fixed) {
      return true;
    }

    for (let each of tabs.value) {
      if (!each.meta.fixed) {
        return (
          (targetTab.value as Tab).fullPath === each.fullPath
        );
      }
    }

    return false;
  } catch (err) {
    return false;
  }
})

const isLastTab = computed(() => {
  try {
    return (
      (targetTab.value as Tab).fullPath ===
      tabs.value[tabs.value.length - 1].fullPath
    );
  } catch (err) {
    return false;
  }
})

watch(
  route,
  () => {
    appendTab();
  }
);

watch(tabMenuVisible, (value) => {
  if (value) {
    document.body.addEventListener('click', () => tabMenuVisible.value = false);
  } else {
    document.body.removeEventListener('click', () => tabMenuVisible.value = false);
  }
});

function initTabs() {
  const fixedTabs = getFixedTabs(routes.value);
  fixedTabs.forEach(each => {
    if (each.name) {
      useTabStore.addTab(each);
    }
  })
  appendTab()
}

function getFixedTabs(routes: Array<RouteRecordRaw>, basePath = '/'): Array<Tab> {
  let fixedTabs: Tab[] = [];

  routes.forEach(route => {
    if (route.meta && route.meta.fixed) {
      const tabPath = path.resolve(basePath, route.path);
      fixedTabs.push({
        fullPath: tabPath,
        path: tabPath,
        name: route.name,
        meta: { ...route.meta },
      });
    }

    if (route.children) {
      const childTabs = getFixedTabs(route.children, route.path);
      if (childTabs.length >= 1) {
        fixedTabs = fixedTabs.concat(childTabs);
      }
    }
  });
  return fixedTabs;
}

function appendTab() {
  if (route.name) {
    tabValue.value = route.path
    useTabStore.add(route);
  }
}

function hasTabToClose() {
  if (targetTab.value.meta && targetTab.value.meta.fixed) {
    return useTabStore.tabs.some(e => !(e.meta && e.meta.fixed))
  }
  else {
    return useTabStore.tabs.some(e => !(e.meta && e.meta.fixed)
      && e.fullPath !== targetTab.value.fullPath)
  }
}

function isFixed(tab: Tab) {
  return tab.meta && tab.meta.fixed;
}

function handleTabClick(tabsPane: TabsPaneContext) {
  router.push(tabs.value.find((e: any) => e.path === tabsPane.props.name))
}

function handleRightClick(e: any) {
  let target = e.target;
  if (!target) return;

  if (target.className instanceof SVGAnimatedString || target.parentNode.className.indexOf("el-tabs__item") > -1) {
    target = target.parentNode;
    if (target.className instanceof SVGAnimatedString || target.className.indexOf('el-icon') > -1) {
      target = target.parentNode;
    }
  } else if (target.className.indexOf("el-tabs__item") === -1) {
    return
  }

  if (settings.fixedHeader) {
    const marginLeft = proxy?.$el.getBoundingClientRect().left;

    left.value = e.clientX - marginLeft + 15;
  } else {
    left.value = e.clientX + 15;
  }

  top.value = e.clientY;

  tabMenuVisible.value = true;
  const id = target.id.replace("tab-", "");
  targetTab.value = tabs.value.find((e: any) => e.path === id);
}

function removeTab(name: TabPaneName) {
  const tab = tabs.value.find((e: any) => e.path === name)
  doRemove(tab)
}

function doRemove(target: Tab) {
  useTabStore.del(target).then((res: any) => {
    if (target.path === route.path) {
      toLastTab(res.tabs, target);
    }
  });
}

function toLastTab(tabs: Tab[], tab?: any) {
  const lastTab = tabs.slice(-1)[0];
  if (lastTab && lastTab.fullPath) {
    router.push(lastTab.fullPath);
  } else {
    router.push('/');
  }
}

function refreshTab(targetTab: Tab) {
  useTabStore.delCachedTab(targetTab);
  const { fullPath } = targetTab;
  nextTick(() => {
    router.replace({ path: '/redirect' + fullPath });
  });
}

function closeLeftTabs() {
  useTabStore.delLeftTabs(targetTab.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastTab(res.visitedViews);
    }
  });
}

function closeRightTabs() {
  useTabStore.delRightTabs(targetTab.value).then((res: any) => {
    if (
      !res.visitedViews.find((item: any) => item.fullPath === route.fullPath)
    ) {
      toLastTab(res.visitedViews);
    }
  });
}

function closeOtherTabs() {
  router.push(targetTab.value as any);
  useTabStore.delOthers(targetTab.value);
}

function closeAllTabs(view: Tab) {
  useTabStore.delAllTabs().then((res: any) => {
    toLastTab(res.visitedViews, view);
  });
}

onMounted(() => {
  initTabs();
});
</script>

<template>
  <div class="tabs-container">
    <el-tabs v-model="tabValue" type="card" @click.right.prevent="handleRightClick" @tab-click="handleTabClick"
      @tab-remove="removeTab">
      <el-tab-pane v-for="tab in tabs" :closable="!isFixed(tab)" :key="tab.path" class="tags-item"
        :label="tab.meta.title" :name="tab.path">
        <template #label>
          <SvgIcon v-if="tab.meta && tab.meta.icon" :name="tab.meta.icon"></SvgIcon>
          <span style="margin-left: 5px;">{{ genTitle(tab.meta.title) }}</span>
        </template>
      </el-tab-pane>
    </el-tabs>
    <ul v-show="tabMenuVisible" :style="{ left: left + 'px', top: top + 'px' }" class="tab-menu">
      <li @click="refreshTab(targetTab)">
        <el-icon>
          <Refresh />
        </el-icon>
        刷新
      </li>
      <li v-if="!isFixed(targetTab)" @click="doRemove(targetTab)">
        <el-icon>
          <CircleClose />
        </el-icon>
        关闭
      </li>
      <li v-if="hasTabToClose()" @click="closeOtherTabs">
        <el-icon>
          <Close />
        </el-icon>
        关闭其它
      </li>
      <li v-if="!isFirstTab" @click="closeLeftTabs">
        <el-icon>
          <ArrowLeft />
        </el-icon>
        关闭左侧
      </li>
      <li v-if="!isLastTab" @click="closeRightTabs">
        <el-icon>
          <ArrowRight />
        </el-icon>
        关闭右侧
      </li>
      <li v-if="hasTabToClose()" @click="closeAllTabs(targetTab)">
        <el-icon>
          <SemiSelect />
        </el-icon>
        关闭所有
      </li>
    </ul>
  </div>
</template>

<style lang="scss" scoped>
.tabs-container {
  width: 100%;
  background-color: #fff;
  box-shadow: 0 1px 3px #0000001f, 0 0 3px #0000000a;

  .tab-menu {
    margin: 0;
    padding: 5px 0;
    position: absolute;
    list-style-type: none;
    background: #fff;
    z-index: 3000;
    border-radius: 6px;
    font-size: 12px;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        color: #fff;
        background: var(--el-menu-active-color);
      }
    }
  }
}

.el-icon {
  vertical-align: -0.17em;
}

:deep(.el-tabs--card>.el-tabs__header) {
  margin: 0 !important;
  border: none;

  .el-tabs__nav,
  .el-tabs__item {
    border: none;
  }

  .el-tabs__item.is-active {
    border-bottom: 2px solid var(--el-color-primary) !important;
  }
}
</style>
