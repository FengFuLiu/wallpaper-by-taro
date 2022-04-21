import React, { useCallback } from 'react';

import { Button, Text, View } from '@tarojs/components';
import Taro from '@tarojs/taro';

import styles from './index.module.less';

type Props = {
  title: string;
  onClick?: () => void;
  className?: string;
  openType?: string;
  home?: boolean;
};

const FloatTool: React.FC<Props> = ({ title, onClick, className, openType, home }) => {
  const handleClick = useCallback(() => {
    if (home) {
      Taro.switchTab({
        url: '/pages/index/index',
      });
    } else {
      onClick?.();
    }
  }, [home, onClick]);
  return (
    <View onClick={handleClick} className={`${styles.container} ${className}`}>
      <Text>{title}</Text>
      {openType && <Button className={styles.opacityBtn} openType={openType} />}
    </View>
  );
};

export default React.memo(FloatTool);
