import './index.scss'

import Taro, { usePageScroll } from '@tarojs/taro'
import { View } from '@tarojs/components'
import { InfoOutlined, LikeOutlined } from '@taroify/icons'
import { Button, Image, List, Loading, Popup, Search, Tag } from '@taroify/core'
import { useLoading, useModel } from 'foca'
import { useCallback, useEffect, useState } from 'react'

import { IHit, pixabeyModel, RequestProps } from '../../redux/models/wallpaper/pixabeyModel'
import { useBoolean } from '../../utils/hooks'

export default function Index() {
  const data = useModel(pixabeyModel, ({ hits }) => hits);
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
    setRequestParams((oldParam) => ({
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

  const handleScrollBottom = useCallback(() => {
    !isFirstRequest && updateParams({ page: (requestParams.page ?? 0) + 1 });
  }, [isFirstRequest]);

  useEffect(() => {
    pixabeyModel.getListInfo(requestParams);
    setIsFirstRequest(false);
  }, [requestParams]);

  return (
    <View className="basePage">
      <Search
        value={searchValue}
        placeholder="输入想搜索的关键词"
        onChange={(e) => setSearchValue(e.detail.value)}
        onSearch={(e) => updateSearchVal(e.detail.value)}
        onClear={() => {
          updateSearchVal('');
        }}
      />
      <List scrollTop={scrollTop} loading={loading} hasMore={hasMore} onLoad={handleScrollBottom}>
        <View className="masonry">
          {Boolean(data.length) &&
            data.map((item) => (
              <View
                className="item"
                key={item.id}
                onClick={() => {
                  handleCardClick(item);
                }}
              >
                <Image className="image" mode="widthFix" lazyLoad src={item.webformatURL} />
                <View className="content">
                  <LikeOutlined />
                  <InfoOutlined />
                  {[...item.tags].map((tag) => (
                    <Tag>{tag}</Tag>
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
