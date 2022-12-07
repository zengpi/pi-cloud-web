import { BaseQuery } from "..";

class Query extends BaseQuery {
  queryColumn?: string;
  createTime?: string[];
  type?: number;
}

class Log {
  /**
   * 主键
   */
  id?: number;
  /**
   * 类型(0:=异常;1:=正常)
   */
  type?: number;
  /**
   * IP地址
   */
  ip?: string;
  /**
   * 标题
   */
  title?: string;
  /**
   * 描述
   */
  exceptionDesc?: string;
  /**
   * 请求方式
   */
  requestMethod?: string;
  /**
   * 请求参数
   */
  requestParam?: string;
  /**
   * 请求时间
   */
  requestTime?: number;
  /**
   * 方法名称
   */
  methodName?: string;
}

export { Query, Log };
