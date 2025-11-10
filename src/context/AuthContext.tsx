import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { authApi, type LoginPayload } from "../api/auth.api";
import { AUTH_TOKEN_KEY, AUTH_USER_KEY, storage } from "../utils/storage";
import type { User } from "../interfaces/User";

type AuthState = {
	user: User | null;
	token: string | null;
	loading: boolean;
	login: (payload: LoginPayload) => Promise<void>;
	logout: () => void;
};

export const AuthContext = createContext<AuthState>({
	user: null,
	token: null,
	loading: true,
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	login: async () => {},
	// eslint-disable-next-line @typescript-eslint/no-empty-function
	logout: () => {},
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState(true);

	// Hydrate from storage
	useEffect(() => {
		const savedToken = storage.get<string>(AUTH_TOKEN_KEY) || null;
		const savedUser = storage.get<User>(AUTH_USER_KEY) || null;
		setToken(savedToken);
		setUser(savedUser);
		setLoading(false);
	}, []);

	const login = useCallback(async (payload: LoginPayload) => {
		// Expect backend returns { token, user }
		const res = await authApi.login(payload);
		const receivedToken = (res as any)?.token as string;
		const receivedUser = (res as any)?.user as User;
		if (!receivedToken) {
			throw new Error("Missing token from login response");
		}
		setToken(receivedToken);
		setUser(receivedUser || null);
		storage.set(AUTH_TOKEN_KEY, receivedToken);
		if (receivedUser) storage.set(AUTH_USER_KEY, receivedUser);
	}, []);

	const logout = useCallback(() => {
		setToken(null);
		setUser(null);
		storage.remove(AUTH_TOKEN_KEY);
		storage.remove(AUTH_USER_KEY);
	}, []);

	const value = useMemo(
		() => ({ user, token, loading, login, logout }),
		[user, token, loading, login, logout]
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

