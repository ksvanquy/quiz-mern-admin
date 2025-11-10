import axiosClient from "./axiosClient";
import type { Attempt } from "../interfaces/Attempt";
import type { ListQuery, PagedResponse } from "../interfaces/Pagination";

export const attemptApi = {
  list(query?: ListQuery) {
    return axiosClient.get<PagedResponse<Attempt>>("/attempts", { query: query as any });
  },
  // Usually attempts are created by taking an assessment; admin may only list/delete
  remove(id: string) {
    return axiosClient.delete<{ success: boolean }>(`/attempts/${id}`);
  },
};


