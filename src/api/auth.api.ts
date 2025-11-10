import axiosClient from "./axiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login(data: LoginPayload) {
    // Backend mounts under /api/users/login
    return axiosClient.post("/users/login", data, { skipAuth: true });
  },
};
