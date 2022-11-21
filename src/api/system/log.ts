import type { AxiosPromise } from "axios"
import qs from "qs"

import request from "@/util/axios";

import type { ResponseData } from "@/entity";
import type { Log, QueryParam } from "@/entity/system/log";

function getLogs(queryParam: QueryParam): AxiosPromise<ResponseData<Log[]>> {
    return request.get("/admin/log?" + qs.stringify(queryParam, { indices: false }))
}

function delLogs(ids: string): AxiosPromise<any> {
    return request.delete("/admin/log", { params: { ids: ids } })
}

function exportLog(queryParam: QueryParam): AxiosPromise<ArrayBuffer> {
    return request.get("/admin/log/export?" + qs.stringify(queryParam, { indices: false }),
        {
            responseType: 'arraybuffer'
        })
}

export { getLogs, delLogs, exportLog }