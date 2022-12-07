import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { ResponseData, BaseQuery } from "@/entity";
import type {
  Role,
  RoleMemberQuery,
  RoleMember,
  RoleUserAllocation,
  RoleMenuAllocation,
} from "@/entity/system/role";

const BASE_URL = "/admin/role";

/**
 * 获取角色
 * @param query 查询参数
 * @returns 角色
 */
function getRoles(query: BaseQuery): AxiosPromise<ResponseData<Array<Role>>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 新增或编辑角色
 * @param role 角色
 * @param isEdit 是否编辑
 */
function saveOrUpdate(role: Role, isEdit: boolean): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: role,
  });
}

/**
 * 角色删除
 *
 * @param ids 待删除 ID，多个以逗号分隔
 */
function deleteRole(ids: string): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 获取所有角色
 *
 * @return 角色
 */
function getAllRoles(): AxiosPromise<Array<Role>> {
  return request.get(`${BASE_URL}/allRoles`);
}

/**
 * 角色成员
 *
 * @param query 查询参数
 * @return 角色成员
 */
function getRoleMembers(
  query: RoleMemberQuery
): AxiosPromise<ResponseData<Array<RoleMember>>> {
  return request.get(`${BASE_URL}/roleMembers`, { params: query });
}

/**
 * 为角色分配用户
 *
 * @param dto RoleUserAllocationDTO
 */
function allocateRoleUser(dto: RoleUserAllocation): AxiosPromise<any> {
  return request.post(`${BASE_URL}/roleUserAllocation`, dto);
}

/**
 * 为角色分配菜单
 *
 * @param dto RoleMenuAllocationDTO
 */
function allocateRoleMenu(dto: RoleMenuAllocation): AxiosPromise<any> {
  return request.post(`${BASE_URL}/roleMenuAllocation`, dto);
}

export {
  getRoles,
  saveOrUpdate,
  deleteRole,
  getAllRoles,
  getRoleMembers,
  allocateRoleUser,
  allocateRoleMenu,
};
