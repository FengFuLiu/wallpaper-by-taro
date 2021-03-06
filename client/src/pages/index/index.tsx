import './index.scss';

import Taro, { pxTransform, usePageScroll, useReady, useShareAppMessage } from '@tarojs/taro';
import { Button, View } from '@tarojs/components';
import { Image, List, Loading, NoticeBar, Search, Skeleton, Sticky, Tag, WhiteSpace } from '@taroify/core';
import { useLoading, useModel } from 'foca';
import { useCallback, useEffect, useState } from 'react';
import FloatTool from '../../components/float-tool';
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
//生成从minNum到maxNum的随机数
function randomNum(minNum: number, maxNum: number) {
  switch (arguments.length) {
    case 1:
      return parseInt(String(Math.random() * minNum + 1), 10);
      break;
    case 2:
      return parseInt(String(Math.random() * (maxNum - minNum + 1) + minNum), 10);
      break;
    default:
      return 0;
      break;
  }
}

const recommendSearch = [
  '风景',
  '星空',
  '女孩',
  '天空',
  '可爱',
  '动物',
  '美食',
  '日落',
  '山',
  '天空',
  '景观',
  '森林',
  '海',
  '阿尔卑斯山',
  '自然',
  '农村',
  '法罗群岛',
];

export default function Index() {
  const data = useModel(pixabeyModel);
  const { hits, totalHits } = data;
  const loading = useLoading(pixabeyModel.getListInfo);
  const [isFirstRequest, setIsFirstRequest] = useState(true);
  const [hasMore, setHasMoreTrue, setHasMoreFalse] = useBoolean(true);
  const [searchValue, setSearchValue] = useState('');
  const [currentCardInfo, setCurrentCardInfo] = useState<IHit>();
  const [requestParams, setRequestParams] = useState<Partial<RequestProps>>({});
  const [scrollTop, setScrollTop] = useState(0);

  usePageScroll(({ scrollTop: aScrollTop }) => {
    setScrollTop(aScrollTop);
  });

  useReady(() => {
    updateSearchVal(recommendSearch[randomNum(0, recommendSearch.length - 1)]);
  });

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
      Taro.pageScrollTo({ scrollTop: 0, duration: 500 });
      setSearchValue(q);
      updateParams({
        q,
      });
    },
    [updateParams]
  );

  useEffect(() => {
    if ((requestParams?.page ?? 0) <= 1 || loading) return;
    hits.length >= totalHits ? setHasMoreFalse() : setHasMoreTrue();
  }, [hits, totalHits, requestParams.page, loading]);

  const handleCardClick = (item: IHit) => {
    setCurrentCardInfo(item);
  };
  const { run: handleScrollBottom } = useThrottleFn(
    () => !isFirstRequest && updateParams({ page: (requestParams.page ?? 0) + 1 }),
    { wait: 2000 }
  );
  useShareAppMessage(() => {
    return {
      title: ' 图库素材',
    };
  });

  const handleTagClick = useCallback((tag: string) => {
    updateSearchVal(tag);
  }, []);

  useEffect(() => {
    if (Object.keys(requestParams).length === 0) return;
    pixabeyModel.getListInfo(requestParams).then(() => {
      setIsFirstRequest(false);
    });
  }, [requestParams]);

  const handleRedirectMiniProgramClick = useCallback(() => {
    Taro.navigateToMiniProgram({
      appId: 'wxe3a0fd96c549b0fa',
    });
  }, []);

  const previewImages = useCallback((url: string) => {
    Taro.previewImage({
      current: url,
      urls: [url],
    });
  }, []);

  return (
    <View className="basePage">
      <NoticeBar>
        <Button openType="contact" className="notice">
          需要更多筛选条件或功能？点击此处向我留言
        </Button>
      </NoticeBar>
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
      <FloatTool onClick={handleRedirectMiniProgramClick} title="一键拼图" />
      <List scrollTop={scrollTop} loading={loading} hasMore={hasMore} onLoad={handleScrollBottom}>
        <View className="masonry" style={{ height: data.parentHeight }}>
          {Boolean(data.hits.length) ? (
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
                {!item?.isAD ? (
                  <>
                    <Image
                      className="image"
                      onClick={() => {
                        previewImages(item.largeImageURL);
                      }}
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
                  </>
                ) : (
                  // @ts-expect-error
                  <ad test={'adunit-922fa483c377b63c'} />
                )}
              </View>
            ))
          ) : (
            <View className="skeleton">
              <Skeleton animation="wave" />
              <WhiteSpace />
              <Skeleton animation="wave" />
              <WhiteSpace />
              <Skeleton animation="wave" />
              <WhiteSpace />
              <Skeleton animation="wave" />
              <WhiteSpace />
            </View>
          )}
        </View>
        <List.Placeholder>
          {loading && <Loading>加载中...</Loading>}
          {!hasMore && '没有更多了'}
        </List.Placeholder>
      </List>
    </View>
  );
}
