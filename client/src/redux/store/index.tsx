import { store } from 'foca'
import { taroStorage } from 'foca-taro-storage'

import { deviceInfoModel } from '../models/device/deviceInfoModel'

store.init({
  persist: [
    {
      key: 'wallpaper',
      version: '1.0.0',
      engine: taroStorage,
      models: [deviceInfoModel],
    },
  ],
});
