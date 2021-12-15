import { defineModel } from 'foca'

const initialState = {
  windowHeight: 0,
  windowWidth: 0
};

export const deviceInfoModel = defineModel("token", {
  initialState,
  actions: {
    setDeviceInfo(state, { windowHeight, windowWidth }) {
      state.windowHeight = windowHeight;
      state.windowWidth = windowWidth;
    },
    getDeviceInfo(state) {
      return state
    }
  },
});
