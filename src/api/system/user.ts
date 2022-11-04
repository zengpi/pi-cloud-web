import request from '@/util/axios';
import type { AxiosPromise } from 'axios';

import type { QueryParam, User, UserImportForm, Token, UserInfo, OptionalUser, LoginForm } from '@/entity/system/user'
import type { BaseQueryParam, ResponseData } from '@/entity';

/**
 * 登录
 * @param data
 */
function login(data: LoginForm): AxiosPromise<Token> {
  return request.post('/auth/oauth2/token', null, {
    params: data,
    headers: {
      Authorization: 'Basic YWRtaW46YWRtaW4=',
    },
  });
}

/**
 * 注销
 */
function logout(): AxiosPromise<any> {
  return request.post('/auth/logout');
}

/**
 * 查询
 *
 * @param queryParams
 */
function users(
  queryParams: QueryParam
): AxiosPromise<ResponseData<Array<User>>> {
  return request.get('/admin/user', {
    params: queryParams,
  });
}

/**
 * 新增
 *
 * @param user
 */
function add(user: User): AxiosPromise<any> {
  return request.post('/admin/user', user);
}

/**
 * 修改
 *
 * @param data
 */
function edit(data: User): AxiosPromise<any> {
  return request.put('/admin/user', data);
}

/**
 * 删除
 *
 * @param ids
 */
function del(ids: string): AxiosPromise<any> {
  return request.delete('/admin/user/' + ids);
}

/**
 * 导出用户
 *
 * @param query
 * @returns
 */
function exportUser(query: QueryParam): AxiosPromise<ArrayBuffer> {
  return request.get('/admin/user/export', {
    params: query,
    responseType: 'arraybuffer',
  });
}

/**
 * 下载用户模板
 * @returns
 */
function downloadUserTemp(): AxiosPromise<ArrayBuffer> {
  return request.get('/admin/user/userImportTemp', {
    responseType: 'arraybuffer',
  });
}

/**
 * 获取用户信息
 */
function getUserInfo(): AxiosPromise<UserInfo> {
  return request.get('/admin/user/info');
}

/**
 * 导入用户
 *
 * @param data 用户数据
 */
function importUser(data: UserImportForm): AxiosPromise<any> {
  const formData = new FormData();
  formData.append('file', data.file as File);
  formData.append('deptId', data.deptId!.toString());
  formData.append('roleIds', data.roleIds!.toString());
  return request.post('/admin/user/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
}

/**
 * 密码重置
 * @param id 待重置密码的用户 ID
 */
function passReset(id: number): AxiosPromise<any> {
  return request.get("/admin/user/passReset", {
    params: { id }
  })
}

/**
 * 更新个人信息
 * @param user 个人信息
 */
function profileEdit(user: User): AxiosPromise<any> {
  return request.put("/admin/user/profileEdit", user)
}

/**
 * 可选用户。如：为角色指定用户时，需要先查询出可以选择的用户列表，然后选择用户
 * @param query 查询条件
 * @return 可选用户列表
 */
function optionalUsers(query: BaseQueryParam): AxiosPromise<ResponseData<Array<OptionalUser>>> {
  return request.get("/admin/user/optionalUsers", {
    params: query
  })
}

export { login, logout, users, add, edit, del, exportUser, downloadUserTemp, getUserInfo, importUser, passReset, profileEdit, optionalUsers }