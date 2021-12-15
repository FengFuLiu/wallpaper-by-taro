import './redux/store'
import './app.scss'

import Taro from '@tarojs/taro'
import { Component } from 'react'
import { FocaProvider } from 'foca'

import { deviceInfoModel } from './redux/models/device/deviceInfoModel'

class App extends Component {
  componentDidMount() {
    try {
      const { windowHeight, windowWidth } = Taro.getSystemInfoSync();
      deviceInfoModel.setDeviceInfo({ windowWidth, windowHeight });
    } catch (e) {
      console.log('err--', e);
    }
    if (process.env.TARO_ENV === 'weapp') {
      Taro.cloud.init();
    }
  }
  // this.props.children 是将要会渲染的页面
  render() {
    return <FocaProvider>{this.props.children}</FocaProvider>;
  }
}

export default App;
