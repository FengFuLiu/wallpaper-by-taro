import { defineModel } from "foca";

const initialState = {
  access_token: "",
  refresh_token: ""
};

export const tokenModel = defineModel("token", {
  initialState,
  actions: {
    setTokenInfo() { }
  },
  effects: {
    async getToken() {
      return this.state.access_token;
    }
  }
});
