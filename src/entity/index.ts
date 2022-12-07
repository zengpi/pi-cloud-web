/**
 * 基础查询参数
 */
class BaseQuery {
  pageNum: number = 1;
  pageSize: number = 10;
  keyWord: string = "";
}

/**
 * 基础弹窗
 */
class BaseDialog<T> {
  dialogVisible: boolean = false;
  props: {
    isEdit?: boolean;
    formData?: T;
  } = {
    isEdit: false,
  };
}

/**
 * 组件间传递的属性
 */
class ComponentProps {
  /**
   * ID
   */
  id?: number;
  /**
   * 名称
   */
  name?: string;

  constructor(id?: number, name?: string) {
    this.id = id;
    this.name = name;
  }
}

/**
 * 树形选择器
 */
interface SelectTree {
  value: number;
  label: string;
  children: Array<SelectTree>;
}

/**
 * 响应数据
 */
interface ResponseData<T> {
  records: T;
  total: number;
}

export { BaseQuery, BaseDialog, ComponentProps };
export type { SelectTree, ResponseData };
