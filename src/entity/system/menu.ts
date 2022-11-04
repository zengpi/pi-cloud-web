import { BaseDialog } from "..";

class QueryParam {
  /**
   * 关键词
   */
  keyWord?: string;
}

class FormDialog extends BaseDialog {
  isEdit?: boolean = false;
  formData?: Menu;
}

class Menu {
  /**
   * 唯一标识
   */
  id?: number;
  /**
   * 菜单名称
   */
  name?: string;
  /**
  * 路由路径（浏览器地址栏路径）
  */
  path?: string;
  /**
  * 组件名称
  */
  componentName?: string;
  /**
  * 组件路径（vue页面完整路径，省略.vue后缀）
  */
  component?: string;
  /**
  * 权限标识
  */
  permission?: string;
  /**
  * 图标
  */
  icon?: string;
  /**
  * 排序
  */
  sort?: number = 999;
  /**
  * 是否缓存（0:=关闭, 1:=开启）
  */
  keepAlive?: number = 1;
  /**
  * 菜单类型（1:=菜单, 2:=目录，3:=按钮）
  */
  type?: number = 1;
  /**
   * 是否外链（0:=否, 1:=是）
   */
  externalLinks?: number = 0;
  /**
  * 是否可见（0:=不可见，1：可见）
  */
  visible?: number = 1;
  /**
  * 重定向路径
  */
  redirect?: string;
  /**
  * 父目录 ID（-1表示根目录）
  */
  parentId?: number = -1;
}

export { QueryParam, FormDialog, Menu }