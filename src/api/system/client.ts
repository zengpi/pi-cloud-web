import type { AxiosPromise, Method } from 'axios';

import request from '@/util/axios';

import type { ResponseData, BaseQueryParam } from "@/entity";
import type { RegisteredClient } from '@/entity/system/client';

function getClients(queryParam: BaseQueryParam): AxiosPromise<ResponseData<Array<RegisteredClient>>> {
    return request.get("/admin/client", { params: queryParam });
}

function saveOrUpdate(data: any, isUpdate: boolean = false): AxiosPromise<any> {
    let method: Method = "POST";
    if (isUpdate) {
        method = "PUT"
    }
    return request({
        url: "/admin/client",
        method: method,
        data: data
    })
}

function delClient(ids: string): AxiosPromise<any> {
    return request({
        url: "/admin/client?ids=" + ids,
        method: "delete"
    })
}

export { getClients, saveOrUpdate, delClient }