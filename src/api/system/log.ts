import type { AxiosPromise } from "axios";

import qs from "qs";

import request from "@/util/axios";

import type { ResponseData } from "@/entity";
import type { Log, Query } from "@/entity/system/log";

const BASE_URL = "/admin/log";

function getLogs(query: Query): AxiosPromise<ResponseData<Log[]>> {
  return request.get(`${BASE_URL}?` + qs.stringify(query, { indices: false }));
}

function deleteLogs(ids: string): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

function exportLog(query: Query): AxiosPromise<ArrayBuffer> {
  return request.get(
    `${BASE_URL}/export?` + qs.stringify(query, { indices: false }),
    {
      responseType: "arraybuffer",
    }
  );
}

export { getLogs, deleteLogs, exportLog };
