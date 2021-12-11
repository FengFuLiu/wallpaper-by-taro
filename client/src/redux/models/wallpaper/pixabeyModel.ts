import Taro from '@tarojs/taro';
import { defineModel } from "foca";
type IHit = {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  previewURL: string;
  previewWidth: number;
  previewHeight: number;
  webformatURL: string;
  webformatWidth: number;
  webformatHeight: number;
  largeImageURL: string;
  imageWidth: number;
  imageHeight: number;
  imageSize: number;
  views: number;
  downloads: number;
  collections: number;
  likes: number;
  comments: number;
  user_id: number;
  user: string;
  userImageURL: string;
}
export interface PixabeyResponse {
  total: number;
  totalHits: number;
  hits: IHit[];
}

const initialState = {
  total: 0,
  totalHits: 0,
  hits: []
};

export const pixabeyModel = defineModel("pixabey", {
  initialState,
  effects: {
    async getListInfo() {
      const res = await Taro.cloud
        .callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getPixabayImage',
            q: '东京',
          },
        });
      console.log("userInfo=", res);
      // this.dispatch(res);
    }
  }
});
