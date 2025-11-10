import { useMemo, useState } from "react";
import useFetch from "../../hooks/useFetch";
import { formatDate } from "../../utils/formatDate";
import type { NodeEntity } from "../../interfaces/Node";
import { nodeApi } from "../../api/node.api";

type SortKey = "name" | "type" | "createdAt";

export default function NodesList() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  const query = useMemo(
    () => ({ page, limit, search, sort, order }),
    [page, limit, search, sort, order]
  );

  const { data, loading, error, refetch, setData } = useFetch<{ items: NodeEntity[]; total: number }>("/nodes", { query });

  const totalPages = useMemo(() => Math.max(1, Math.ceil((data?.total || 0) / limit)), [data?.total, limit]);

  const onSort = (key: SortKey) => {
    if (sort === key) setOrder(order === "asc" ? "desc" : "asc");
    else {
      setSort(key);
      setOrder("asc");
    }
  };

  const openCreate = () => {
    const name = prompt("Node name:");
    if (!name) return;
    const type = prompt("Type (category|subcategory|topic):", "category") as NodeEntity["type"];
    const parentId = prompt("ParentId (optional):") || null;
    nodeApi.create({ name, type, parentId }).then(() => refetch());
  };

  const openEdit = (entity: NodeEntity) => {
    const name = prompt("Node name:", entity.name) || entity.name;
    const type = (prompt("Type (category|subcategory|topic):", entity.type) as NodeEntity["type"]) || entity.type;
    const parentId = prompt("ParentId (optional):", entity.parentId || "") || null;
    nodeApi.update(entity._id!, { name, type, parentId }).then(() => refetch());
  };

  const onDelete = (id: string) => {
    if (!confirm("Delete this node?")) return;
    nodeApi.remove(id).then(() => {
      // optimistic: remove from current page
      setData((prev) => prev ? ({ ...prev, items: prev.items.filter(i => i._id !== id), total: Math.max(0, (prev.total||1)-1) }) : prev);
      void refetch();
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Nodes</h1>
        <div className="flex gap-2">
          <input
            placeholder="Search name..."
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
              {["name", "type", "createdAt"].map((key) => (
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
            {(data?.items || []).map((n) => (
              <tr key={n._id}>
                <td className="px-6 py-4 whitespace-nowrap">{n.name}</td>
                <td className="px-6 py-4 whitespace-nowrap capitalize">{n.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">{n.createdAt ? formatDate(n.createdAt) : "-"}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                  <button onClick={() => openEdit(n)} className="text-indigo-600 hover:text-indigo-900">Edit</button>
                  <button onClick={() => onDelete(n._id!)} className="text-red-600 hover:text-red-900">Delete</button>
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


