export const storage = {
	get<T = string>(key: string, fallback?: T): T | undefined {
		try {
			const value = localStorage.getItem(key);
			if (value === null) return fallback;
			try {
				return JSON.parse(value) as T;
			} catch {
				return value as unknown as T;
			}
		} catch {
			return fallback;
		}
	},
	set(key: string, value: unknown) {
		try {
			const toStore =
				typeof value === "string" ? value : JSON.stringify(value);
			localStorage.setItem(key, toStore);
		} catch {
			/* ignore */
		}
	},
	remove(key: string) {
		try {
			localStorage.removeItem(key);
		} catch {
			/* ignore */
		}
	},
	clear() {
		try {
			localStorage.clear();
		} catch {
			/* ignore */
		}
	},
};

export const AUTH_TOKEN_KEY = "auth_token";
export const AUTH_USER_KEY = "auth_user";

