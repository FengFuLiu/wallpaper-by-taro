import { View } from '@tarojs/components';
import { Button, Search, Image, List, Loading } from '@taroify/core';
import { useLoading, useModel } from 'foca';
import { pixabeyModel, RequestProps } from '../../redux/models/wallpaper/pixabeyModel';
import { useCallback, useEffect, useState } from 'react';
import './index.scss';
import { useBoolean } from '../../utils/hooks';
import Taro, { usePageScroll } from '@tarojs/taro';

const isEven = (num: number) => num % 2 == 0;

export default function Index() {
  const data = useModel(pixabeyModel, ({ hits }) => hits);
  const loading = useLoading(pixabeyModel.getListInfo);
  const [hasMore, setHasMoreTrue, setHasMoreFalse] = useBoolean(true);
  const [searchValue, setSearchValue] = useState('');
  const [requestParams, setRequestParams] = useState<Partial<RequestProps>>({
    page: 1,
  });
  const [scrollTop, setScrollTop] = useState(0);
  usePageScroll(({ scrollTop: aScrollTop }) => setScrollTop(aScrollTop));
  console.log(data);
  const updateParams = useCallback((params: Partial<RequestProps>) => {
    const newParam = { page: 1, ...params };
    setRequestParams(oldParam => ({ ...oldParam, ...newParam }));
  }, []);

  const updateSearchVal = useCallback(
    (q: string) => {
      setSearchValue(q);
      updateParams({ q });
    },
    [updateParams],
  );

  const handleScrollBottom = useCallback(() => {
    updateParams({ page: (requestParams.page ?? 0) + 1 });
  }, []);

  useEffect(() => {
    pixabeyModel.getListInfo(requestParams);
  }, [requestParams]);

  return (
    <View>
      <Search
        value={searchValue}
        placeholder="输入想搜索的关键词"
        onChange={e => setSearchValue(e.detail.value)}
        onSearch={e => updateSearchVal(e.detail.value)}
        onClear={() => {
          updateSearchVal('');
        }}
      />
      <List
        scrollTop={scrollTop}
        // immediateCheck={false}
        loading={loading}
        hasMore={hasMore}
        onLoad={handleScrollBottom}
      >
        <View className="masonry">
          <View className="column">
            {Boolean(data.length) &&
              data
                .filter((_, index) => isEven(index))
                .map(({ webformatURL, id }) => (
                  <Image
                    className="item"
                    mode="widthFix"
                    key={id}
                    lazyLoad
                    src={webformatURL}
                  />
                ))}
          </View>
          <View className="column">
            {Boolean(data.length) &&
              data
                .filter((_, index) => !isEven(index))
                .map(({ webformatURL, id }) => (
                  <Image
                    className="item"
                    mode="widthFix"
                    key={id}
                    lazyLoad
                    src={webformatURL}
                  />
                ))}
          </View>
        </View>
        <List.Placeholder>
          {loading && <Loading>加载中...</Loading>}
          {!hasMore && '没有更多了'}
        </List.Placeholder>
      </List>
    </View>
  );
}
