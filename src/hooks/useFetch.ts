import { useCallback, useEffect, useMemo, useState } from "react";
import axiosClient from "../api/axiosClient";

type UseFetchOptions<T> = {
	enabled?: boolean;
	initialData?: T;
	query?: Record<string, string | number | boolean | undefined | null>;
};

export default function useFetch<T = unknown>(
	url: string,
	{ enabled = true, initialData, query }: UseFetchOptions<T> = {}
) {
	const [data, setData] = useState<T | undefined>(initialData);
	const [loading, setLoading] = useState<boolean>(enabled);
	const [error, setError] = useState<string | null>(null);

	const doFetch = useCallback(async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await axiosClient.get<T>(url, { query });
			setData(res);
		} catch (e: any) {
			setError(e?.message || "Unknown error");
		} finally {
			setLoading(false);
		}
	}, [url, JSON.stringify(query)]);

	useEffect(() => {
		if (enabled) void doFetch();
	}, [enabled, doFetch]);

	return useMemo(
		() => ({ data, loading, error, refetch: doFetch, setData }),
		[data, loading, error, doFetch]
	);
}

