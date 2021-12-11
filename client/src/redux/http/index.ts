import axios, { AxiosError } from "axios";
import { enhance } from "foca-miniprogram-axios";

const instance = axios.create();

instance.interceptors.response.use(undefined, (err: AxiosError) => {
  return Promise.reject(err);
});

export const http = enhance(instance, {
  throttle: true,
  retry: true
});
