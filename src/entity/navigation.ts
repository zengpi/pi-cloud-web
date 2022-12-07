import type { RouteLocationNormalized } from "vue-router";

interface MenuItem {
  path: string;
  meta: {
    /**
     * 图标
     */
    icon: string;
    /**
     * 是否隐藏
     */
    hidden: boolean;
    /**
     * 标题
     */
    title: string;
    /**
     * 是否固定 tab
     */
    fixed: boolean;
  };
  children: MenuItem[];
}

interface Tab extends Partial<RouteLocationNormalized> {
  title?: string;
}

export type { MenuItem, Tab };
