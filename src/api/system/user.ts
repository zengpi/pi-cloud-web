import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { BaseQuery, ResponseData } from "@/entity";
import type {
  Query,
  User,
  UserImportForm,
  Token,
  UserInfo,
  OptionalUser,
  LoginForm,
  UserForm,
  Profile,
} from "@/entity/system/user";

const BASE_URL = "/admin/user";

/**
 * 用户登录
 * @param loginForm 登录表单
 */
function login(loginForm: LoginForm): AxiosPromise<Token> {
  return request.post("/auth/oauth2/token", null, {
    params: loginForm,
    headers: {
      Authorization: "Basic YWRtaW46YWRtaW4=",
    },
  });
}

/**
 * 用户注销
 */
function logout(): AxiosPromise<any> {
  return request.post("/auth/logout");
}

/**
 * 用户查询
 *
 * @param query 查询条件
 * @return 用户
 */
function getUsers(query: Query): AxiosPromise<ResponseData<Array<User>>> {
  return request.get(BASE_URL, {
    params: query,
  });
}

/**
 * 新增用户
 *
 * @param userForm 用户表单
 */
function saveUser(userForm: UserForm): AxiosPromise<any> {
  return request.post(BASE_URL, userForm);
}

/**
 * 编辑用户
 *
 * @param userForm 用户表单
 */
function updateUser(userForm: UserForm): AxiosPromise<any> {
  return request.put(BASE_URL, userForm);
}

/**
 * 删除用户
 *
 * @param ids 用户 ID，多个以逗号分隔
 */
function deleteUser(ids: string): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 导出用户
 *
 * @param query
 * @returns
 */
function exportUser(query: Query): AxiosPromise<ArrayBuffer> {
  return request.get(`${BASE_URL}/userExport`, {
    params: query,
    responseType: "arraybuffer",
  });
}

/**
 * 下载用户导入模板
 */
function downloadUserImportTemp(): AxiosPromise<ArrayBuffer> {
  return request.get(`${BASE_URL}/userImportTemp`, {
    responseType: "arraybuffer",
  });
}

/**
 * 导入用户
 *
 * @param userImportForm 用户导入表单
 */
function importUser(userImportForm: UserImportForm): AxiosPromise<any> {
  const formData = new FormData();
  formData.append("file", userImportForm.file as File);
  formData.append("deptId", userImportForm.deptId!.toString());
  formData.append("roleIds", userImportForm.roleIds!.toString());
  return request.post(`${BASE_URL}/userImport`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

/**
 * 获取用户信息
 */
function getUserInfo(): AxiosPromise<UserInfo> {
  return request.get(`${BASE_URL}/info`);
}

/**
 * 修改个人信息
 * @param profile 个人信息
 */
function profileEdit(profile: Profile): AxiosPromise<any> {
  return request.put(`${BASE_URL}/profileEdit`, profile);
}

/**
 * 密码重置
 * @param id 待重置密码的用户 ID
 */
function resetPass(id: number): AxiosPromise<any> {
  return request.put(`${BASE_URL}/passReset/${id}`);
}

/**
 * 可选用户。如：为角色指定用户时，需要先查询出可以选择的用户列表，然后选择用户
 * @param query 查询条件
 * @return 可选用户列表
 */
function getOptionalUsers(
  query: BaseQuery
): AxiosPromise<ResponseData<Array<OptionalUser>>> {
  return request.get(`${BASE_URL}/optionalUsers`, {
    params: query,
  });
}

export {
  login,
  logout,
  getUsers,
  saveUser,
  updateUser,
  deleteUser,
  exportUser,
  downloadUserImportTemp,
  getUserInfo,
  importUser,
  resetPass,
  profileEdit,
  getOptionalUsers,
};
