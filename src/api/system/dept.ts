import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { SelectTree } from "@/entity";
import type { DeptTree, DeptForm, Query } from "@/entity/system/dept";

const BASE_URL = "/admin/dept";

/**
 * 获取部门（树形）
 * @param query 查询参数
 * @returns 部门（树形）
 */
function getDeptTree(query: Query): AxiosPromise<Array<DeptTree>> {
  return request.get(BASE_URL, { params: query });
}

/**
 * 新增或编辑部门
 * @param dept 部门
 * @param isEdit 是否编辑
 */
function saveOrUpdate(dept: DeptForm, isEdit: boolean): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: dept,
  });
}

/**
 * 删除部门
 * @param ids 待删除记录的 ID 列表，以逗号分隔
 */
function deleteDept(ids: string): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

/**
 * 获取部门选择器（树形）
 * @returns 部门选择器（树形）
 */
function getDeptSelectTree(): AxiosPromise<Array<SelectTree>> {
  return request.get(`${BASE_URL}/deptSelectTree`);
}

export { getDeptTree, saveOrUpdate, deleteDept, getDeptSelectTree };
