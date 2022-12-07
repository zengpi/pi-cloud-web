import type { AxiosPromise } from "axios";

import request from "@/util/axios";

import type { ResponseData, BaseQuery } from "@/entity";
import type { RegisteredClient, ResetPassForm } from "@/entity/system/client";

const BASE_URL = "/admin/client";

function getClients(
  query: BaseQuery
): AxiosPromise<ResponseData<Array<RegisteredClient>>> {
  return request.get(BASE_URL, { params: query });
}

function saveOrUpdate(
  client: RegisteredClient | ResetPassForm,
  isEdit: boolean
): AxiosPromise<any> {
  return request({
    url: BASE_URL,
    method: isEdit ? "put" : "post",
    data: client,
  });
}

function deleteClient(ids: string): AxiosPromise<any> {
  return request.delete(`${BASE_URL}/${ids}`);
}

export { getClients, saveOrUpdate, deleteClient };
