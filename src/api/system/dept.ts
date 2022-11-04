import type { DeptTree } from '@/entity/system/dept';
import request from '@/util/axios';
import type { AxiosPromise } from 'axios';

/**
 * 部门树
 */
function getDeptTree(): AxiosPromise<Array<DeptTree>> {
  return request({
    url: '/admin/dept/deptTree',
    method: 'get',
  });
}

export { getDeptTree }