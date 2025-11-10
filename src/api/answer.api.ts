import axiosClient from "./axiosClient";
import type { Answer } from "../interfaces/Answer";
import type { ListQuery, PagedResponse } from "../interfaces/Pagination";

export const answerApi = {
  list(query?: ListQuery) {
    return axiosClient.get<PagedResponse<Answer>>("/answers", { query: query as any });
  },
  create(payload: Omit<Answer, "_id" | "createdAt" | "updatedAt">) {
    return axiosClient.post<Answer>("/answers", payload);
  },
  update(id: string, payload: Partial<Omit<Answer, "_id">>) {
    return axiosClient.put<Answer>(`/answers/${id}`, payload);
  },
  remove(id: string) {
    return axiosClient.delete<{ success: boolean }>(`/answers/${id}`);
  },
};


