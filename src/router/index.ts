import { createRouter, createWebHistory } from "vue-router";
import Navigation from "../views/navigation/Index.vue";
import type { RouteRecordRaw } from "vue-router";

export const localRouters: RouteRecordRaw[] = [
  {
    path: "/",
    component: Navigation,
    redirect: "/dashboard",
    children: [
      {
        path: "dashboard",
        component: () => import("@/views/dashboard/Index.vue"),
        name: "Dashboard",
        meta: { title: "dashboard", icon: "home-filled", fixed: true },
      },
      {
        path: "401",
        component: () => import("@/components/error-page/401.vue"),
        meta: { hidden: true },
      },
      {
        path: "/profile",
        name: "Profile",
        component: () => import("@/views/Profile.vue"),
        meta: { title: "个人信息", icon: "user", hidden: true },
      },
    ],
  },
  {
    path: "/login",
    component: () => import("@/views/Login.vue"),
    meta: { hidden: true },
  },
  {
    path: "/redirect",
    component: Navigation,
    meta: { hidden: true },
    children: [
      {
        path: "/redirect/:path(.*)",
        component: () => import("@/views/Redirect.vue"),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: localRouters,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export default router;
