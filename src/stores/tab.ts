import { ref } from 'vue'
import { defineStore } from 'pinia';
import clone from 'xe-utils/clone'

import type { Tab } from '@/entity/navigation';

const useTabsStore = defineStore('tab', () => {
  /**
   * 标签
   */
  const tabs = ref<Array<Tab>>([])
  /**
   * 已缓存标签
   */
  const cachedTabs = ref<Array<any>>([])

  function addTab(tab: Tab) {
    if (tabs.value.some(e => e.path === tab.path)) return;
    if (tab.meta && tab.meta.fixed) {
      tabs.value.unshift(clone(tab, true));
    } else {
      tabs.value.push(clone(tab, true));
    }
  }

  function addCachedTab(tab: Tab) {
    if (cachedTabs.value.includes(tab.name)) return;
    if (tab.meta && tab.meta.keepAlive) {
      cachedTabs.value.push(tab.name);
    }
  }

  function add(tab: Tab) {
    addTab(tab);
    addCachedTab(tab);
  }

  function delTab(tab: Tab) {
    return new Promise((resolve) => {
      for (const [i, v] of tabs.value.entries()) {
        if (v.path === tab.path) {
          tabs.value.splice(i, 1);
          break;
        }
      }
      resolve([...tabs.value]);
    });
  }

  function delCachedTab(tab: Tab) {
    return new Promise((resolve) => {
      const index = cachedTabs.value.indexOf(tab.name);
      index > -1 && cachedTabs.value.splice(index, 1);
      resolve([...cachedTabs.value]);
    });
  }

  function del(tab: Tab) {
    return new Promise((resolve) => {
      delTab(tab);
      delCachedTab(tab);
      resolve({
        tabs: [...tabs.value],
        cachedTabs: [...cachedTabs.value],
      });
    });
  }

  function delLeftTabs(targetTab: Tab) {
    return new Promise((resolve) => {
      const currIndex = tabs.value.findIndex(
        e => e.path === targetTab.path
      );
      if (currIndex === -1) {
        return;
      }
      tabs.value = tabs.value.filter((item, index) => {
        if (index >= currIndex || (item.meta && item.meta.fixed)) {
          return true;
        }

        const cacheIndex = cachedTabs.value.indexOf(item.name as string);
        if (cacheIndex > -1) {
          cachedTabs.value.splice(cacheIndex, 1);
        }
        return false;
      });
      resolve({
        visitedViews: [...tabs.value],
      });
    });
  }

  function delRightTabs(tab: Tab) {
    return new Promise((resolve) => {
      const currIndex = tabs.value.findIndex(
        e => e.path === tab.path
      );
      if (currIndex === -1) {
        return;
      }
      tabs.value = tabs.value.filter((item, index) => {
        if (index <= currIndex || (item.meta && item.meta.affix)) {
          return true;
        }

        const cacheIndex = cachedTabs.value.indexOf(item.name as string);
        if (cacheIndex > -1) {
          cachedTabs.value.splice(cacheIndex, 1);
        }
        return false;
      });
      resolve({
        visitedViews: [...tabs.value],
      });
    });
  }

  function delOtherTabs(tab: Tab) {
    return new Promise((resolve) => {
      tabs.value = tabs.value.filter((e) => {
        return e.meta?.fixed || e.path === tab.path;
      });
      resolve([...tabs.value]);
    });
  }

  function delOtherCachedTabs(tab: Tab) {
    return new Promise((resolve) => {
      const index = cachedTabs.value.indexOf(tab.name);
      if (index > -1) {
        cachedTabs.value = cachedTabs.value.slice(index, index + 1);
      } else {
        cachedTabs.value = [];
      }
      resolve([...cachedTabs.value]);
    });
  }

  function delOthers(tab: Tab) {
    return new Promise((resolve) => {
      delOtherTabs(tab);
      delOtherCachedTabs(tab);
      resolve({
        visitedTabs: [...tabs.value],
        cachedTabs: [...cachedTabs.value],
      });
    });
  }

  function delAllTabs() {
    return new Promise((resolve) => {
      const fixedTags = tabs.value.filter((tab) => tab.meta?.fixed);
      tabs.value = fixedTags;
      cachedTabs.value = [];
      resolve({
        visitedViews: [...tabs.value],
        cachedViews: [...cachedTabs.value],
      });
    });
  }

  return {
    tabs,
    cachedTabs,
    addTab,
    add,
    delCachedTab,
    del,
    delLeftTabs,
    delRightTabs,
    delOthers,
    delAllTabs
  }
});

export default useTabsStore;
