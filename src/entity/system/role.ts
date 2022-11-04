import { BaseDialog, BaseQueryParam } from "..";

class QueryParam extends BaseQueryParam {

}

class RoleMemberQueryParam extends BaseQueryParam {
    roleId?: number;
}

class FormDialog extends BaseDialog {
    props: {
        isEdit?: boolean,
        formData?: Role
    } = {
        isEdit: false,
    }
}

class Role {
    /**
     * 角色 ID
     */
    id?: number;
    /**
     * 角色名称
     */
    name?: string;
    /**
     * 角色编码
     */
    roleCode?: string;
    /**
     * 角色描述
     */
    roleDesc?: string;
}

interface RoleMember {
    id: number;
    username: string;
    nickname: string;
    deptName: string;
}

/**
 * 分配用户角色 DTO
 */
class AllocationRoleUserDTO {
    roleId?: number;
    addUserIds?: string;
    removeUserIds?: string;
}

/**
 * 分配用户菜单 DTO
 */
class AllocationRoleMenuDTO {
    roleId?: number;
    menuIds?: string;
    constructor(roleId?: number, menuIds?: string){
        this.roleId = roleId;
        this.menuIds = menuIds;
    }
}

export { QueryParam, RoleMemberQueryParam, FormDialog, Role, AllocationRoleUserDTO, AllocationRoleMenuDTO }

export type { RoleMember }