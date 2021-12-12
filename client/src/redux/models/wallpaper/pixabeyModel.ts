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

export type RequestProps = {
  q: string,
  page: number,
  image_type: "all" | "photo" | "illustration" | "vector",
  orientation: "all" | "horizontal" | "vertical",
  category: 'backgrounds' | 'fashion' | 'nature' | 'science' | 'education' | 'feelings' | 'health' | 'people' | 'religion' | 'places' | 'animals' | 'industry' | 'computer' | 'food' | 'sports' | 'transportation' | 'travel' | 'buildings' | 'business' | 'music',
  colors: "grayscale" | "transparent" | "red" | "orange" | "yellow" | "green" | "turquoise" | "blue" | "lilac" | "pink" | "white" | "gray" | "black" | "brown"
}

const initialState = {
  total: 0,
  totalHits: 0,
  hits: [] as IHit[]
};

export const pixabeyModel = defineModel("pixabey", {
  initialState,
  effects: {
    async getListInfo(params: Partial<RequestProps>) {
      const res = await Taro.cloud
        .callFunction({
          name: 'quickstartFunctions',
          data: {
            type: 'getPixabayImage',
            ...params
          },
        });
      const { hits, total, totalHits } = res.result as PixabeyResponse
      this.dispatch((state) => {
        state.total = total;
        state.totalHits = totalHits;
        state.hits = [...state.hits, ...hits];
      });
    }
  }
});
