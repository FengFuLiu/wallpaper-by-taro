import Taro from '@tarojs/taro';
import { defineModel } from 'foca';

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
  contentLines: number;
  isAD: boolean;
  adId: string;
};
export interface PixabeyResponse {
  total: number;
  totalHits: number;
  hits: IHit[];
}

export type RequestProps = {
  q: string;
  page: number;
  image_type: 'all' | 'photo' | 'illustration' | 'vector';
  orientation: 'all' | 'horizontal' | 'vertical';
  category:
  | 'backgrounds'
  | 'fashion'
  | 'nature'
  | 'science'
  | 'education'
  | 'feelings'
  | 'health'
  | 'people'
  | 'religion'
  | 'places'
  | 'animals'
  | 'industry'
  | 'computer'
  | 'food'
  | 'sports'
  | 'transportation'
  | 'travel'
  | 'buildings'
  | 'business'
  | 'music';
  colors:
  | 'grayscale'
  | 'transparent'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'turquoise'
  | 'blue'
  | 'lilac'
  | 'pink'
  | 'white'
  | 'gray'
  | 'black'
  | 'brown';
};

const initialState = {
  total: 0,
  totalHits: 0,
  parentHeight: 100,
  hits: [] as IHit[],
};

export const LINE_HEIGHT = 24;
export const CONTENT_FONT_SIZE = 12;

const PADDING_HORIZONTAL = 10;
const PADDING_VERTICAL = 10;
const MASONRY_COLUMN = 2;
const TAG_PADDING_LEFT = 8; //标签之间的间隔
let columnHeightList: number[] = new Array(MASONRY_COLUMN).fill(0); //2列
const { windowWidth = 375 } = Taro.getSystemInfoSync();

const adID = ['adunit-922fa483c377b63c', 'adunit-ab36eacce8876258', 'adunit-b7969e0a1475e613', 'adunit-f986a9285af12234', 'adunit-8f111c8165edac5f', 'adunit-056adc116c7acc7d', 'adunit-d490a4cb82f1d10a']

export const pixabeyModel = defineModel('pixabey', {
  initialState,
  effects: {
    async getListInfo(params: Partial<RequestProps>) {
      const res = await Taro.cloud.callFunction({
        name: 'quickstartFunctions',
        data: {
          type: 'getPixabayImage',
          ...params,
        },
      });
      const { hits, total, totalHits } = res.result as PixabeyResponse;
      const adItem: IHit = {
        isAD: true,
        id: 0,
        adId: adID[Math.floor(Math.random() * adID.length)],
        pageURL: '',
        type: '',
        tags: '',
        tagList: [],
        previewURL: '',
        previewWidth: 0,
        previewHeight: 0,
        webformatURL: '',
        webformatWidth: 104,
        webformatHeight: 60,
        largeImageURL: '',
        imageWidth: 0,
        imageHeight: 0,
        imageSize: 0,
        views: 0,
        downloads: 0,
        collections: 0,
        likes: 0,
        comments: 0,
        user_id: 0,
        user: '',
        userImageURL: '',
        top: 0,
        left: 0,
        masonryHeight: 0,
        masonryWidth: 0,
        contentLines: 1
      }

      const isClearList = params.page === 1;
      if (isClearList) columnHeightList = new Array(MASONRY_COLUMN).fill(0);

      this.setState(state => {
        if (hits.length && (params?.page ?? 1) % 2 === 1) {
          state.total = total + 1;
          state.totalHits = totalHits + 1;
          hits.push(adItem);
        } else {
          state.total = total;
          state.totalHits = totalHits;
        }

        hits.forEach(item => {
          item.previewURL = item.previewURL.replace('_150', '__340');
          item.tagList = item.tags.split(',').map(tag => tag.trim());
          item.masonryWidth = Number(((windowWidth - PADDING_HORIZONTAL * 3) / MASONRY_COLUMN).toFixed(2));
          const scale = item.webformatHeight / item.webformatWidth;
          item.masonryHeight = Number((item.masonryWidth * scale).toFixed(2));

          item.contentLines = Math.ceil(
            (String(item.tagList).length * CONTENT_FONT_SIZE) / (item.masonryWidth - 2 * TAG_PADDING_LEFT)
          );
          const minHeightIndex = columnHeightList.findIndex(el => el === Math.min(...columnHeightList));
          item.top = columnHeightList[minHeightIndex];
          item.left = item.masonryWidth * minHeightIndex + PADDING_HORIZONTAL * (minHeightIndex + 1);

          const increasedHeightVal = Number(
            (
              columnHeightList[minHeightIndex] +
              item.masonryHeight +
              LINE_HEIGHT * item.contentLines +
              PADDING_VERTICAL
            ).toFixed(2)
          );
          columnHeightList[minHeightIndex] = increasedHeightVal;
        });

        state.hits = isClearList ? hits : [...state.hits, ...hits];
        state.parentHeight = Math.max(...columnHeightList);
      });
    },
  },
});
