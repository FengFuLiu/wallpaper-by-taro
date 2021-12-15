import Taro from '@tarojs/taro'
import { defineModel } from 'foca'

import { deviceInfoModel } from '../device/deviceInfoModel'

export type IHit = {
  id: number;
  pageURL: string;
  type: string;
  tags: string;
  tagList: string[];
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
  top: number;
  left: number;
  masonryHeight: number;
  masonryWidth: number;
  contentLines: number
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
  parentHeight: 100,
  hits: [] as IHit[]
};

export const LINE_HEIGHT = 15;
export const CONTENT_FONT_SIZE = 12;

const PADDING_HORIZONTAL = 10;
const MASONRY_COLUMN = 2;
let columnHeightList: number[] = new Array(MASONRY_COLUMN).fill(0);//2列

export const pixabeyModel = defineModel("pixabey", {
  initialState,
  effects: {
    async getListInfo(params: Partial<RequestProps>) {
      const res = await Taro.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getPixabayImage',
          ...params
        },
      });
      const { hits, total, totalHits } = res.result as PixabeyResponse

      const isClearList = params.page === 1;
      if (isClearList) columnHeightList = new Array(MASONRY_COLUMN).fill(0);

      const { windowWidth } = deviceInfoModel.state;

      this.dispatch((state) => {
        state.total = total;
        state.totalHits = totalHits;
        hits.forEach(item => {
          item.tagList = item.tags.split(',').map(tag => tag.trim());
          item.masonryWidth = Number(((windowWidth - (PADDING_HORIZONTAL * 3)) / MASONRY_COLUMN).toFixed(2));
          const scale = item.webformatHeight / item.webformatWidth;
          item.masonryHeight = Number((item.masonryWidth * scale).toFixed(2));

          item.contentLines = Math.ceil(item.masonryWidth / (String(item.tagList).length * CONTENT_FONT_SIZE)) + 1;
          console.log(item.contentLines)
          const minHeightIndex = columnHeightList.findIndex(item => item === Math.min(...columnHeightList));
          item.top = columnHeightList[minHeightIndex];
          item.left = item.masonryWidth * minHeightIndex + PADDING_HORIZONTAL * (minHeightIndex + 1);

          const increasedHeightVal = Number((columnHeightList[minHeightIndex] + item.masonryHeight + (LINE_HEIGHT * item.contentLines)).toFixed(2))
          columnHeightList[minHeightIndex] = increasedHeightVal;
        });
        state.hits = isClearList ? hits : [...state.hits, ...hits];
        state.parentHeight = Math.min(...columnHeightList);
      });
    }
  }
});
