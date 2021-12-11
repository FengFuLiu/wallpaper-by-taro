import { defineModel } from "foca";
import { http } from "../../http";

export interface UserResponse {
  id: number;
  nickname: string;
  birthday: string;
  gender: number;
  headerSmall: string;
  headerLarge: string;
  shareFlag: string;
  level: number;
  vip: number;
  roleId: number;
  billingVersion: number;
  isNewUser: boolean;
  phonicsAllowed: number;
  phonicsLevel: number;
  registeredAt: number;
  mobile: string;
  survey: boolean;
  timestamp: number;
  isPasswordSet: boolean;
}

const initialState: Partial<UserResponse> = {};

export const pixabeyModel = defineModel("pixabey", {
  initialState,
  effects: {
    async getUserInfo() {
      const userInfo = await http.get<UserResponse>("/s/user");
      console.log("userInfo=", userInfo);
      this.dispatch(userInfo);
    }
  }
});
