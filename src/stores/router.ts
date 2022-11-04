import { shallowRef } from 'vue'
import { defineStore } from 'pinia'
import type { RouteRecordRaw } from 'vue-router';

import { localRouters } from '@/router';

import { buildMenu } from '@/api/system/menu';

import Navigation from "@/views/navigation/Index.vue"

const components = import.meta.glob('../views/**/*.vue');

const useRouterStore = defineStore('router', () => {
    /**
     * 所有菜单
     */
    const routers = shallowRef<Array<RouteRecordRaw>>([]);
    /**
     * 数据库中动态获取的菜单
     */
    const dynamicRouters = shallowRef<Array<RouteRecordRaw>>([]);

    /**
     * 生成菜单
     * @returns /
     */
    function generateRouters() {
        return new Promise((resolve, reject) => {
            buildMenu()
                .then(({ data }) => {
                    let tempMenus = data;
                    if (!tempMenus) {
                        tempMenus = [];
                    };
                    dynamicRouters.value = handleDynamicRoute(tempMenus as any[]);
                    routers.value = localRouters.concat(dynamicRouters.value);
                    resolve(routers.value);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }

    return { routers, dynamicRouters, generateRouters }
})

function handleDynamicRoute(routers: RouteRecordRaw[]) {
    const rstRouters: RouteRecordRaw[] = [];

    routers.forEach((router) => {
        const tempRouter: RouteRecordRaw = { ...router };
        if (tempRouter.component as any === 'Navigation') {
            tempRouter.component = Navigation;
        } else {
            const component = components[`../views/${tempRouter.component}.vue`] as any;
            tempRouter.component = component ? component : () => import('@/components/error-page/404.vue');
        }
        rstRouters.push(tempRouter);

        if (tempRouter.children) {
            tempRouter.children = handleDynamicRoute(tempRouter.children);
        }
    });
    return rstRouters;
};

export default useRouterStore;