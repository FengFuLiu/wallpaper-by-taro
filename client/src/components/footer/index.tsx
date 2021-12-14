import Divider from '@taroify/core/divider'
import React from 'react'
import { Image, View } from '@tarojs/components'

import logo from '../../images/logo.png'

type Props = {};

const Footer: React.FC<Props> = () => {
  return (
    <View>
      <Divider>
        文本
        <Image style={{ width: '20px', height: 'auto' }} mode="widthFix" src={logo} />
      </Divider>
    </View>
  );
};

export default React.memo(Footer);
