import axiosClient from "./axiosClient";
import type { NodeEntity } from "../interfaces/Node";
import type { ListQuery, PagedResponse } from "../interfaces/Pagination";

export const nodeApi = {
  list(query?: ListQuery) {
    return axiosClient.get<PagedResponse<NodeEntity>>("/nodes", { query: query as any });
  },
  create(payload: Omit<NodeEntity, "_id" | "createdAt" | "updatedAt">) {
    return axiosClient.post<NodeEntity>("/nodes", payload);
  },
  update(id: string, payload: Partial<Omit<NodeEntity, "_id">>) {
    return axiosClient.put<NodeEntity>(`/nodes/${id}`, payload);
  },
  remove(id: string) {
    return axiosClient.delete<{ success: boolean }>(`/nodes/${id}`);
  },
};


