import request from "@/util/axios";

import type { AxiosPromise } from "axios";

import type { SelectTree } from "@/entity";
import type {
  MenuTree,
  MenuForm,
  CurrentUserMenuTree,
  Query,
} from "@/entity/system/menu";

const BASE_URL = "/admin/menu";

/**
 * 获取菜单（树形）
 * @param query 查询条件
 * @return 菜单列表
 */
function getMenuTree(query: Query): AxiosPromise<MenuTree[]> {
  return request(BASE_URL, { params: query });
}

/**
 * 新增或编辑菜单
 * @param menuForm 菜单
 * @param isEdit 是否编辑
 */
function saveOrUpdate(menuForm: MenuForm, isEdit: boolean): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: menuForm,
  });
}

/**
 * 删除菜单
 * @param ids 待删除记录的 ID 列表，以逗号分隔
 */
function deleteMenu(ids: string): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 构建当前用户的树形菜单
 * @returns 当前用户的树形菜单
 */
function buildMenu(): AxiosPromise<CurrentUserMenuTree[]> {
  return request.get(`${BASE_URL}/buildMenu`);
}

/**
 * 获取菜单选择器（树形）
 */
function getMenuSelectTree(
  containsButtons: boolean = false
): AxiosPromise<Array<SelectTree>> {
  return request(`${BASE_URL}/menuSelectTree/${containsButtons}`);
}

/**
 * 根据角色 ID 获取菜单 ID 列表
 *
 * @param roleId 角色 ID
 * @returns 菜单 ID 列表
 */
function getMenuIdsByRoleId(roleId?: number): AxiosPromise<Array<number>> {
  return request(`${BASE_URL}/menuIdsByRoleId/${roleId}`);
}

export {
  getMenuTree,
  saveOrUpdate,
  deleteMenu,
  buildMenu,
  getMenuSelectTree,
  getMenuIdsByRoleId,
};
