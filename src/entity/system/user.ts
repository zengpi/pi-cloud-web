import type { UploadRawFile } from 'element-plus'

import { BaseDialog, BaseQueryParam, ComponentProps } from '@/entity'

/**
 * 查询参数
 */
class QueryParam extends BaseQueryParam {
    enabled: number = 1;
    deptId: number | null = null;
}

/**
 * 表单对话框
 */
class FormDialog extends BaseDialog {
    isEdit?: boolean = false;
    form?: User;
}

/**
 * 可选用户对话框
 */
class OptionalUserDialog extends BaseDialog {
    props: ComponentProps = new ComponentProps();
}

/**
 * 登录表单
 */
class LoginForm {
    username: string = 'admin';
    password: string = 'admin';
    grant_type: string = 'password';
    scope?: string;
    code: string = '';
    randomCode: string = '';
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
 * 用户
 */
class User {
    id?: number;
    username?: string = "";
    nickname?: string = "";
    oldPassword?: string = "";
    password?: string = "";
    deptId?: number;
    roleIds?: Array<number>;
    sex?: number;
    phone?: string;
    avatar?: string;
    deptName?: string;
    enabled: number = 1;
    createTime?: string;
}

/**
 * 可选用户
 */
class OptionalUser {
    id?: number;
    username?: string;
    nickname?: string;
    deptName?: string;
}

/**
 * 登录用户信息
 */
interface UserInfo {
    userInfo: {
        username: string;
        nickname: string;
        avatar: string;
        phone: string;
        deptId: number;
    };
    roles: string[];
    authorities: string[];
}

/**
 * token
 */
interface Token {
    access_token: string;
    token_type: string;
}

export { QueryParam, FormDialog, OptionalUserDialog, User, UserImportForm, OptionalUser, LoginForm };
export type { UserInfo, Token };
