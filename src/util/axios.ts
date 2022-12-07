import axios from "axios";
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import { ElMessage, ElMessageBox } from "element-plus";

import useStore from "@/stores";
import { localStorage } from "@/util/storage";
import { LocalStorageEnum } from "@/entity/enums";

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API,
  timeout: 5000,
  headers: { "Content-Type": "application/json;charset=utf-8" },
});

service.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    const { useUserStore } = useStore();
    if (useUserStore.token) {
      config.headers.Authorization = `${localStorage.get(
        LocalStorageEnum.TOKEN
      )}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

service.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, msg } = response.data;
    if (code === "00000") {
      return response.data;
    } else {
      if (response.data instanceof ArrayBuffer) {
        return response;
      }

      ElMessage({
        message: msg || "未知错误",
        type: "error",
      });
      return Promise.reject(new Error(msg || "未知错误"));
    }
  },
  async (error) => {
    let errMsg = "未知错误";

    const { code, msg } = error.response.data;
    if (code) {
      errMsg = msg;
      if (code === "A0304") {
        await ElMessageBox.alert(errMsg, "提示", {
          confirmButtonText: "确定",
          type: "warning",
        }).then(() => {
          localStorage.clear();
          const { useUserStore } = useStore();
          if (useUserStore.token) {
            window.location.reload();
          }
        });
      } else {
        ElMessage({
          message: errMsg,
          type: "error",
        });
      }
    } else {
      errMsg = error.response.statusText;

      if (error.response.status === 404) {
        errMsg = "页面找不到";
      } else if (error.response.status === 500) {
        errMsg = "内部服务错误";
      } else if (error.response.status === 503) {
        errMsg = "服务不可用";
      }

      ElMessage({
        message: errMsg,
        type: "error",
      });
    }

    return Promise.reject(new Error(errMsg));
  }
);

export default service;
