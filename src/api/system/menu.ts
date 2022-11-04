import request from "@/util/axios";

import type { AxiosPromise } from "axios";

import type { Menu } from "@/entity/system/menu"
import type { SelectTree } from "@/entity"


/**
 * 获取菜单
 * @param keyWord 搜索条件
 * @return 菜单列表
 */
function menus(keyWord: string | undefined): AxiosPromise<Menu[]> {
  return request({
    url: "/admin/menu",
    method: "get",
    params: { keyWord: keyWord }
  });
}

/**
* 菜单树形选择
*/
function selectTree(containBtn: boolean = false): AxiosPromise<Array<SelectTree>> {
  return request({
    url: '/admin/menu/selectTree?containBtn=' + containBtn,
    method: 'get'
  });
}


/**
 * 获取路由列表
 */
function buildMenu(): AxiosPromise<Menu[]> {
  return request({
    url: '/admin/menu/buildMenu',
    method: 'get'
  });
}

/**
 * 新增
 */
function add(menu: Menu): AxiosPromise<any> {
  return request({
    url: "/admin/menu",
    method: "post",
    data: menu
  });
}

function edit(menu: Menu): AxiosPromise<any> {
  return request({
    url: "/admin/menu",
    method: "put",
    data: menu
  })
}

function del(ids: string): AxiosPromise<any> {
  return request({
    url: "/admin/menu?ids=" + ids,
    method: "delete"
  })
}

function getMenuLeafIdsByRoleId(roleId?: number): AxiosPromise<Array<number>> {
  return request({
    url: "/admin/menu/menuLeafIds/" + roleId,
    method: "get"
  })
}

export { menus, selectTree, buildMenu, add, edit, del, getMenuLeafIdsByRoleId }