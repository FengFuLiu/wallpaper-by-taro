import { useState } from 'react';
import { View } from '@tarojs/components';
import Login from '../../components/login/index.weapp';
import { Button } from '@taroify/core';

export default function Index() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <Button>sddsssss</Button>
      <Login />
    </View>
  );
}
