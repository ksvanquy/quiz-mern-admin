import { authApi, type LoginPayload } from "../api/auth.api";
import type { User } from "../interfaces/User";

export type LoginResponse = {
	token: string;
	user: User;
};

export const authService = {
	async login(payload: LoginPayload): Promise<LoginResponse> {
		const res = await authApi.login(payload);
		return res as unknown as LoginResponse;
	},
};

