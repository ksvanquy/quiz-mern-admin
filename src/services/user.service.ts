import { userApi, type UsersQuery } from "../api/user.api";
import type { User } from "../interfaces/User";

export const userService = {
	fetchUsers(query?: UsersQuery) {
		return userApi.list(query);
	},
	createUser(payload: Omit<User, "_id" | "createdAt">) {
		return userApi.create(payload);
	},
	updateUser(id: string, payload: Partial<Omit<User, "_id" | "createdAt">>) {
		return userApi.update(id, payload);
	},
	deleteUser(id: string) {
		return userApi.remove(id);
	},
};

