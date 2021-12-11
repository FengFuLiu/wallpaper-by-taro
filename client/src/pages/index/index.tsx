import { View } from '@tarojs/components';
import Login from '../../components/login/index.weapp';
import { useModel } from 'foca';
import { counterModel } from 'src/redux/models/counter/counterModel';

export default function Index() {
  const count = useModel(counterModel, state => state.count);
  console.log(count, 'count');
  return (
    <View>
      <Login />
    </View>
  );
}
