import axiosClient from "./axiosClient";

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  login(data: LoginPayload) {
    // Backend mounts under /api/auth/login
    return axiosClient.post("/auth/login", data, { skipAuth: true });
  },
};
