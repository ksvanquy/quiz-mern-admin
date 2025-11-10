import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/formatDate";
import type { Assessment } from "../../interfaces/Assessment";
import { assessmentApi } from "../../api/assessment.api";

type SortKey = "title" | "type" | "createdAt";

export default function AssessmentsList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const query = useMemo(
    () => ({ page, limit, search, sort, order }),
    [page, limit, search, sort, order]
  );

  const { data, loading, error, refetch, setData } = useFetch<{ items: Assessment[]; total: number }>("/assessments", { query });
  const totalPages = useMemo(() => Math.max(1, Math.ceil((data?.total || 0) / limit)), [data?.total, limit]);

  const onSort = (key: SortKey) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(key);
      setOrder("asc");
    }
  };

  const openCreate = () => {
    const title = prompt("Title:");
    if (!title) return;
    const type = prompt("Type (quiz|exam|test):", "quiz") as Assessment["type"];
    const nodeId = prompt("NodeId:") || "";
    if (!nodeId) return;
    assessmentApi.create({ title, type, nodeId }).then(() => refetch());
  };

  const openEdit = (entity: Assessment) => {
    const title = prompt("Title:", entity.title) || entity.title;
    const type = (prompt("Type (quiz|exam|test):", entity.type) as Assessment["type"]) || entity.type;
    const nodeId = prompt("NodeId:", entity.nodeId) || entity.nodeId;
    assessmentApi.update(entity._id!, { title, type, nodeId }).then(() => refetch());
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this assessment?")) return;
    assessmentApi.remove(id).then(() => {
      setData((prev) => prev ? ({ ...prev, items: prev.items.filter(i => i._id !== id), total: Math.max(0, (prev.total||1)-1) }) : prev);
      void refetch();
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Assessments</h1>
        <div className="flex gap-2">
          <input
            placeholder="Search title..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="border p-2 rounded"
          />
          <button onClick={refetch} className="border px-3 py-1 rounded">Refresh</button>
          <button onClick={openCreate} className="bg-blue-600 text-white px-3 py-1 rounded">Add</button>
        </div>
      </div>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-600">{error}</p>}

      <div className="overflow-x-auto bg-white shadow rounded-lg">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {["title", "type", "createdAt"].map((key) => (
                <th
                  key={key}
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer select-none"
                  onClick={() => onSort(key as SortKey)}
                >
                  {key.toUpperCase()} {sort === key ? (order === "asc" ? "▲" : "▼") : ""}
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {(data?.items || []).map((a) => (
              <tr key={a._id}>
                <td className="px-6 py-4 whitespace-nowrap">{a.title}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{a.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{a.createdAt ? formatDate(a.createdAt) : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                  <button onClick={() => openEdit(a)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => onDelete(a._id!)} className="text-red-600 hover:text-red-900">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-4">
        <span>Page {page} of {totalPages}</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => setPage(page - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Prev</button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button key={i} onClick={() => setPage(i + 1)} className={`px-3 py-1 border rounded ${page === i + 1 ? "bg-blue-600 text-white" : ""}`}>
              {i + 1}
            </button>
          ))}
          <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
        </div>
      </div>
    </div>
  );
}


