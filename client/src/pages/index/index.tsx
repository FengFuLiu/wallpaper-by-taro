import { useState } from 'react';
import { View } from '@tarojs/components';
import Login from '../../components/login/index.weapp';

export default function Index() {
  const [count, setCount] = useState(0);

  return (
    <View>
      <View>sddsssss</View>
      <Login />
    </View>
  );
}
