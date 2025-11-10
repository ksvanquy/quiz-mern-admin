// Lightweight axios-like client using fetch, with baseURL and auth header support
// Provides: get, post, put, delete returning parsed JSON or throwing on HTTP errors

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

type RequestOptions = {
	headers?: Record<string, string>;
	query?: Record<string, string | number | boolean | undefined | null>;
	body?: unknown;
	skipAuth?: boolean;
};

const DEFAULT_HEADERS: Record<string, string> = {
	"Content-Type": "application/json",
	Accept: "application/json",
};

const buildQueryString = (query?: RequestOptions["query"]) => {
	if (!query) return "";
	const params = new URLSearchParams();
	Object.entries(query).forEach(([key, value]) => {
		if (value === undefined || value === null) return;
		params.append(key, String(value));
	});
	const qs = params.toString();
	return qs ? `?${qs}` : "";
};

// Read token from localStorage when available
const getToken = () => {
	try {
		return localStorage.getItem("auth_token") || undefined;
	} catch {
		return undefined;
	}
};

const BASE_URL =
	// Prefer Vite env if set, fallback to default localhost (matches backend app.js default port 5000)
	(import.meta as any).env?.VITE_API_BASE_URL || "http://localhost:5000/api";

async function request<T>(
	method: HttpMethod,
	url: string,
	options: RequestOptions = {}
): Promise<T> {
	const qs = buildQueryString(options.query);
	const fullUrl = `${BASE_URL}${url}${qs}`;

	const headers: Record<string, string> = {
		...DEFAULT_HEADERS,
		...(options.headers || {}),
	};

	const token = options.skipAuth ? undefined : getToken();
	if (token) {
		headers.Authorization = `Bearer ${token}`;
	}

	const fetchOptions: RequestInit = {
		method,
		headers,
	};
	if (options.body !== undefined) {
		fetchOptions.body =
			headers["Content-Type"] === "application/json"
				? JSON.stringify(options.body)
				: (options.body as BodyInit);
	}

	const res = await fetch(fullUrl, fetchOptions);
	const isJson = res.headers.get("content-type")?.includes("application/json");
	const data = isJson ? await res.json() : (undefined as unknown as T);

	if (!res.ok) {
		const message =
			(data as any)?.message ||
			`HTTP ${res.status} ${res.statusText} for ${method} ${url}`;
		throw new Error(message);
	}
	return data as T;
}

const axiosClient = {
	get: <T = unknown>(url: string, options?: RequestOptions) =>
		request<T>("GET", url, options),
	post: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
		request<T>("POST", url, { ...(options || {}), body }),
	put: <T = unknown>(url: string, body?: unknown, options?: RequestOptions) =>
		request<T>("PUT", url, { ...(options || {}), body }),
	delete: <T = unknown>(url: string, options?: RequestOptions) =>
		request<T>("DELETE", url, options),
	baseURL: BASE_URL,
};

export default axiosClient;

