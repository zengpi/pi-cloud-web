import { BaseQuery } from "..";

/**
 * 获取角色成员查询参数
 */
class RoleMemberQuery extends BaseQuery {
  /**
   * 角色 ID
   */
  roleId?: number;
}

/**
 * 角色
 */
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

/**
 * 角色成员
 */
interface RoleMember {
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
   * 部门名称
   */
  deptName: string;
}

/**
 * 角色用户分配
 */
class RoleUserAllocation {
  /**
   * 角色 ID
   */
  roleId?: number;
  /**
   * 待分配用户 ID，多个以逗号分隔
   */
  toBeAddUserIds?: string;
  /**
   * 待移除用户 ID，多个以逗号分隔
   */
  toBeRemoveUserIds?: string;
}

/**
 * 角色菜单分配
 */
class RoleMenuAllocation {
  /**
   * 角色 ID
   */
  roleId?: number;
  /**
   * 菜单 ID 列表，多个以逗号分隔
   */
  menuIds?: string;

  constructor(roleId?: number, menuIds?: string) {
    this.roleId = roleId;
    this.menuIds = menuIds;
  }
}

export { RoleMemberQuery, Role, RoleUserAllocation, RoleMenuAllocation };

export type { RoleMember };
