import axiosClient from "./axiosClient";
import type { User } from "../interfaces/User";

export type UsersQuery = {
	page?: number;
	limit?: number;
	search?: string;
	sort?: string;
};

export const userApi = {
	list(_query?: UsersQuery) {
		// Backend returns plain array for GET /users
		return axiosClient.get<User[]>("/users");
	},
	getById(id: string) {
		return axiosClient.get<User>(`/users/${id}`);
	},
	register(data: Omit<User, "_id" | "createdAt">) {
		// POST /users/register -> { message, userId }
		return axiosClient.post<{ message: string; userId: string }>("/users/register", data);
	},
	update(id: string, data: Partial<Omit<User, "_id" | "createdAt">>) {
		return axiosClient.put<User>(`/users/${id}`, data);
	},
	remove(id: string) {
		return axiosClient.delete<{ message: string }>(`/users/${id}`);
	},
};

