import request from '@/util/axios';
import type { AxiosPromise, Method } from 'axios';

import type { QueryParam, Role, RoleMemberQueryParam, RoleMember, AllocationRoleUserDTO, AllocationRoleMenuDTO } from '@/entity/system/role'
import type { ResponseData } from '@/entity';

/**
 * 获取所有角色
 */
function roles(param: QueryParam): AxiosPromise<ResponseData<Array<Role>>> {
  return request({
    url: '/admin/role',
    method: 'get',
    params: param
  });
}

function saveOrUpdate(param: Role, isUpdate: boolean = false): AxiosPromise<any> {
  let method: Method = "POST";
  if (!isUpdate) {
    method = "PUT"
  }
  return request({
    url: "/admin/role",
    method: method,
    data: param
  })
}

function del(ids: string): AxiosPromise<any> {
  return request({
    url: "/admin/role?ids=" + ids,
    method: "delete"
  })
}

/**
 * 获取所有角色
 */
function getAllRoles(): AxiosPromise<Array<Role>> {
  return request({
    url: '/admin/role/allRoles',
    method: 'get'
  });
}

/**
 * 获取角色成员
 * @param queryParam 查询参数
 */
function getRoleMembers (queryParam: RoleMemberQueryParam): AxiosPromise<ResponseData<Array<RoleMember>>> {
  return request({
    url: "/admin/role/roleMembers",
    method: "get",
    params: queryParam
  })
}

function allocationRoleUser (roleUser: AllocationRoleUserDTO): AxiosPromise<any> {
  return request({
    url: "/admin/role/allocationRoleUser",
    method: "post",
    data: roleUser
  })
}

function allocateRoleMenu (allocationRoleMenuDto: AllocationRoleMenuDTO): AxiosPromise<any> {
  return request({
    url: "/admin/role/allocationRoleMenu",
    method: "post",
    data: allocationRoleMenuDto
  })
}

export { roles, saveOrUpdate, del, getAllRoles, getRoleMembers, allocationRoleUser, allocateRoleMenu }