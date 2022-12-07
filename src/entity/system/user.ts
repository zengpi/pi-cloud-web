import type { UploadRawFile } from "element-plus";

import { BaseQuery, ComponentProps } from "@/entity";

class Query extends BaseQuery {
  /**
   * 用户状态（0:=禁用;1:=启用）
   */
  enabled: number = 1;
  /**
   * 部门 ID
   */
  deptId: number | null = null;
}

/**
 * 用户导入对话框
 */
class UserImportDialog {
  dialogVisible: boolean = false;
}

/**
 * 可选用户对话框
 */
class OptionalUserDialog {
  dialogVisible: boolean = false;
  props: ComponentProps = new ComponentProps();
}

/**
 * 登录表单
 */
class LoginForm {
  /**
   * 用户名
   */
  username: string = "admin";
  /**
   * 密码
   */
  password: string = "admin";
  /**
   * 授权类型
   */
  grant_type: string = "password";
  /**
   * SCOPE
   */
  scope?: string;
  /**
   * 验证码
   */
  code: string = "";
  /**
   * 随机码
   */
  randomCode: string = "";
}

/**
 * 用户
 */
class User {
  /**
   * 标识
   */
  id?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 用户名
   */
  username?: string = "";
  /**
   * 昵称
   */
  nickname?: string = "";
  /**
   * 性别(1:=男; 2:=女)
   */
  sex?: number;
  /**
   * 生日
   */
  bday?: string;
  /**
   * 年龄
   */
  age?: number;
  /**
   * 手机
   */
  phone?: string;
  /**
   * 部门 ID
   */
  deptId?: number;
  /**
   * 部门名称
   */
  deptName?: string;
  /**
   * 角色 ID 列表
   */
  roleIds?: Array<number>;
  /**
   * 状态（0:=禁用，1:=启用）
   */
  enabled: number = 1;
}

/**
 * 用户表单
 */
class UserForm {
  /**
   * 标识
   */
  id?: number;
  /**
   * 用户名
   */
  username?: string = "";
  /**
   * 昵称
   */
  nickname?: string = "";
  /**
   * 密码
   */
  password?: string;
  /**
   * 性别(1:=男; 2:=女)
   */
  sex?: number = 1;
  /**
   * 生日
   */
  bday?: string;
  /**
   * 手机
   */
  phone?: string;
  /**
   * 部门 ID
   */
  deptId?: number;
  /**
   * 角色 ID 列表
   */
  roleIds?: Array<number>;
  /**
   * 状态（0:=禁用，1:=启用）
   */
  enabled: number = 1;
}

/**
 * 用户导入表单
 */
class UserImportForm {
  /**
   * 部门 ID
   */
  deptId?: number;
  /**
   * 角色 ID 列表
   */
  roleIds?: Array<number>;
  /**
   * 文件
   */
  file?: UploadRawFile;
}

/**
 * 可选用户
 */
class OptionalUser {
  /**
   * 标识
   */
  id?: number;
  /**
   * 用户名
   */
  username?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 部门名称
   */
  deptName?: string;
}

/**
 * 登录用户信息
 */
interface UserInfo {
  /**
   * 用户信息
   */
  userInfo: {
    /**
     * 标识
     */
    id: number;
    /**
     * 用户名
     */
    username: string;
    /**
     * 昵称
     */
    nickname: string;
    /**
     * 手机
     */
    phone: string;
    /**
     * 头像
     */
    avatar: string;
  };
  /**
   * 角色
   */
  roles: string[];
  /**
   * 权限标识
   */
  authorities: string[];
}

/**
 * 个人信息
 */
class Profile {
  /**
   * 标识
   */
  id?: number;
  /**
   * 新密码，如果此字段不为空，oldPassword 字段也不允许为空
   */
  password?: string;
  /**
   * 旧密码
   */
  oldPassword?: string;
  /**
   * 昵称
   */
  nickname?: string;
  /**
   * 手机
   */
  phone?: string;
}

/**
 * token
 */
interface Token {
  /**
   * 访问令牌
   */
  access_token: string;
  /**
   * 刷新令牌
   */
  refresh_token: string;
  /**
   * SCOPE
   */
  scope: string;
  /**
   * 令牌类型
   */
  token_type: string;
  /**
   * 过期时间
   */
  expires_in: string;
}

export {
  Query,
  OptionalUserDialog,
  User,
  UserImportForm,
  OptionalUser,
  LoginForm,
  UserForm,
  Profile,
  UserImportDialog,
};
export type { UserInfo, Token };
