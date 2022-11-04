/**
 * 基础查询参数
 */
class BaseQueryParam {
    pageNum: number = 1;
    pageSize: number = 10;
    keyWord: string = '';
}

/**
 * 基础弹窗
 */
class BaseDialog {
    dialogVisible: boolean = false;
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

    constructor(id?: number, name?: string){
        this.id = id;
        this.name = name;
    }
}

/**
 * 树形选择器
 */
interface SelectTree {
    value?: number;
    label?: string;
    children?: Array<SelectTree>;
}

/**
 * 响应数据
 */
interface ResponseData<T> {
    records: T;
    total: number;
}

export { BaseQueryParam, BaseDialog, ComponentProps };
export type { SelectTree, ResponseData };
