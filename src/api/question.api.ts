import axiosClient from "./axiosClient";
import type { Question } from "../interfaces/Question";
import type { ListQuery, PagedResponse } from "../interfaces/Pagination";

export const questionApi = {
  list(query?: ListQuery) {
    return axiosClient.get<PagedResponse<Question>>("/questions", { query: query as any });
  },
  create(payload: Omit<Question, "_id" | "createdAt" | "updatedAt">) {
    return axiosClient.post<Question>("/questions", payload);
  },
  update(id: string, payload: Partial<Omit<Question, "_id">>) {
    return axiosClient.put<Question>(`/questions/${id}`, payload);
  },
  remove(id: string) {
    return axiosClient.delete<{ success: boolean }>(`/questions/${id}`);
  },
};


