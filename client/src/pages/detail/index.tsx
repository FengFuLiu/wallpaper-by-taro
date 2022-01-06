import './index.scss';

import Taro, { pxTransform, usePageScroll } from '@tarojs/taro';
import { View } from '@tarojs/components';
import { InfoOutlined, LikeOutlined } from '@taroify/icons';
import { Button, Image, List, Loading, Popup, Search, Sticky, Tag, Transition } from '@taroify/core';
import { useLoading, useModel } from 'foca';
import { useCallback, useEffect, useState } from 'react';
import { useThrottleFn } from 'ahooks';
import LOGO from '../../images/logo.png';

import {
  CONTENT_FONT_SIZE,
  IHit,
  LINE_HEIGHT,
  pixabeyModel,
  RequestProps,
} from '../../redux/models/wallpaper/pixabeyModel';
import { useBoolean } from '../../utils/hooks';

export default function Detail() {
  const data = useModel(pixabeyModel);
  const loading = useLoading(pixabeyModel.getListInfo);
  const [isFirstRequest, setIsFirstRequest] = useState(true);
  const [hasMore, setHasMoreTrue, setHasMoreFalse] = useBoolean(true);
  const [isShowPopup, showPopup, hidePopup] = useBoolean(false);
  const [searchValue, setSearchValue] = useState('');
  const [currentCardInfo, setCurrentCardInfo] = useState<IHit>();
  const [requestParams, setRequestParams] = useState<Partial<RequestProps>>({
    page: 1,
  });
  const [scrollTop, setScrollTop] = useState(0);
  usePageScroll(({ scrollTop: aScrollTop }) => setScrollTop(aScrollTop));

  const updateParams = useCallback((params: Partial<RequestProps>) => {
    const newParam = {
      page: 1,
      ...params,
    };
    setRequestParams(oldParam => ({
      ...oldParam,
      ...newParam,
    }));
  }, []);

  const updateSearchVal = useCallback(
    (q: string) => {
      setSearchValue(q);
      updateParams({
        q,
      });
    },
    [updateParams]
  );

  const handleCardClick = (item: IHit) => {
    setCurrentCardInfo(item);
  };
  const { run: handleScrollBottom } = useThrottleFn(
    () => !isFirstRequest && updateParams({ page: (requestParams.page ?? 0) + 1 }),
    { wait: 2000 }
  );

  const handleTagClick = useCallback((tag: string) => {
    updateSearchVal(tag);
  }, []);

  useEffect(() => {
    pixabeyModel.getListInfo(requestParams);
    setIsFirstRequest(false);
  }, [requestParams]);

  return (
    <View className="basePage">
      <Sticky>
        <Search
          value={searchValue}
          placeholder="输入想搜索的关键词"
          onChange={e => setSearchValue(e.detail.value)}
          onSearch={e => updateSearchVal(e.detail.value)}
          onClear={() => {
            updateSearchVal('');
          }}
        />
      </Sticky>
      <List scrollTop={scrollTop} loading={loading} hasMore={hasMore} onLoad={handleScrollBottom}>
        <View className="masonry" style={{ height: data.parentHeight }}>
          {Boolean(data.hits.length) &&
            data.hits.map(item => (
              <View
                style={{
                  left: item.left,
                  top: item.top,
                  width: item.masonryWidth,
                  minHeight: item.masonryHeight + item.contentLines * LINE_HEIGHT,
                }}
                className="item"
                key={item.id}
                onClick={() => {
                  handleCardClick(item);
                }}
              >
                <Image
                  className="image"
                  mode="widthFix"
                  style={{ minHeight: item.masonryHeight }}
                  placeholder={
                    <View className="placeholder-logo" style={{ height: item.masonryHeight }}>
                      <Image style={{ height: item.masonryHeight }} mode="aspectFit" src={LOGO} />
                    </View>
                  }
                  src={item.previewURL}
                />
                <View
                  className="content"
                  style={{
                    fontSize: CONTENT_FONT_SIZE,
                    height: item.contentLines * LINE_HEIGHT,
                  }}
                >
                  {item.tagList.map(tag => (
                    <Tag
                      className="tag"
                      onClick={() => {
                        handleTagClick(tag);
                      }}
                      style={{ marginBottom: item.contentLines > 1 ? pxTransform(8) : 0 }}
                    >
                      {tag}
                    </Tag>
                  ))}
                </View>
              </View>
            ))}
        </View>
        <List.Placeholder>
          {loading && <Loading>加载中...</Loading>}
          {!hasMore && '没有更多了'}
        </List.Placeholder>
      </List>
      <Popup open={isShowPopup} rounded placement="bottom" style={{ height: '30%' }}></Popup>
    </View>
  );
}
