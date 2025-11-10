import axiosClient from "./axiosClient";
import type { Assessment } from "../interfaces/Assessment";
import type { ListQuery, PagedResponse } from "../interfaces/Pagination";

export const assessmentApi = {
  list(query?: ListQuery) {
    return axiosClient.get<PagedResponse<Assessment>>("/assessments", { query: query as any });
  },
  create(payload: Omit<Assessment, "_id" | "createdAt" | "updatedAt">) {
    return axiosClient.post<Assessment>("/assessments", payload);
  },
  update(id: string, payload: Partial<Omit<Assessment, "_id">>) {
    return axiosClient.put<Assessment>(`/assessments/${id}`, payload);
  },
  remove(id: string) {
    return axiosClient.delete<{ success: boolean }>(`/assessments/${id}`);
  },
};


