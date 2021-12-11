import { store } from "foca";
import { taroStorage } from "foca-taro-storage";
import { tokenModel } from "../models/token/tokenModel";

store.init({
  persist: [
    {
      key: "parents",
      version: "1.0.0",
      engine: taroStorage,
      models: [tokenModel]
    }
  ]
});
