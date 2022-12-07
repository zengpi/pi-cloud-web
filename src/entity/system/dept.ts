class Query {
  keyWord?: string;
}

/**
 * 部门（树形）
 */
class DeptTree {
  /**
   * 标识
   */
  id?: number;
  /**
   * 创建时间
   */
  createTime?: string;
  /**
   * 部门名称
   */
  name?: string;
  /**
   * 排序
   */
  sort?: number;
  /**
   * 子节点
   */
  children?: DeptTree[];
}

/**
 * 部门
 */
class DeptForm {
  /**
   * 标识
   */
  id?: number;
  /**
   * 部门名称
   */
  name?: string;
  /**
   * 排序
   */
  sort?: number = 999;
  /**
   * 父部门 ID
   */
  parentId?: number = 0;
}

export { Query, DeptForm, DeptTree };
