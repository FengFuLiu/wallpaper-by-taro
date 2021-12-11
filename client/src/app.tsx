import { Component } from 'react';
import { FocaProvider } from 'foca';
import Taro from '@tarojs/taro';
import './redux/store';
import './app.scss';

class App extends Component {
  componentDidMount() {
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
