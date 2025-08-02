import { useEffect, useState, useRef } from "react";
import { Link } from "react-router";
import { API_URL } from "~/config";

interface VocabularyItem {
  _id: string;
  type: string;
  name: string;
  description: string;
  image?: string;
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: VocabularyItem[];
  pagination: {
    page: number | null;
    limit: number | null;
    totalPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
}

const TYPE_OPTIONS = [
  { label: "All", value: "" },
  { label: "Modern", value: "modern" },
  { label: "History", value: "history" },
];

const LIMIT = 10;

function Vocabulary() {
  const [type, setType] = useState<string>("");
  const [search, setSearch] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const [data, setData] = useState<VocabularyItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
    page: 1,
    limit: LIMIT,
    totalPage: null,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (type) params.append("type", type);
      if (search) params.append("search", search);
      params.append("page", page.toString());
      params.append("limit", LIMIT.toString());

      const res = await fetch(
        API_URL + `/vocabulary/get-all?${params.toString()}`
      );
      const json: ApiResponse = await res.json();

      if (json.success) {
        setData(json.data);
        setPagination({
          page: json.pagination.page ?? page,
          limit: json.pagination.limit ?? LIMIT,
          totalPage: json.pagination.totalPage,
          hasNextPage: json.pagination.hasNextPage,
          hasPrevPage: json.pagination.hasPrevPage,
        });
      } else {
        setError(json.message || "Failed to load data");
      }
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  };

  // type yoki page o'zgarganda ma'lumot olish
  useEffect(() => {
    fetchData();
  }, [type, page]);

  // search debounce
  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1); // search o'zgarganda page 1 qilamiz
      fetchData();
    }, 1000);

    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;

    try {
      const res = await fetch(`/vocabulary/delete/${id}`, { method: "DELETE" });
      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        alert(json.message || "Failed to delete item");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Vocabulary</h1>

      {/* Filter va search */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <select
          className="border rounded-md px-3 py-2"
          value={type}
          onChange={(e) => {
            setType(e.target.value);
            setPage(1);
          }}
        >
          {TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <input
          type="text"
          className="border rounded-md px-3 py-2 flex-grow"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link
          to="/vocabulary/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Create New
        </Link>
      </div>

      {/* Jadval */}
      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : data.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <table className="w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2 text-left">
                Image
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Type
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Description
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Created At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left">
                Updated At
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border border-gray-300 px-4 py-2">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-12 w-12 object-cover rounded"
                    />
                  ) : (
                    <span className="text-gray-400 italic">No image</span>
                  )}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.name}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.type}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {item.description}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {new Date(item.updated_at).toLocaleDateString()}
                </td>
                <td className="border border-gray-300 px-4 py-2 text-center space-x-2">
                  <Link
                    to={`/vocabulary/update/${item._id}`}
                    className="bg-yellow-400 px-3 py-1 rounded hover:bg-yellow-500 text-white"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(item._id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* Pagination (agar totalPage ma'lum bo‘lsa) */}
      {pagination.totalPage && pagination.totalPage > 1 && (
        <div className="flex justify-center space-x-2 mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Prev
          </button>

          {Array.from({ length: pagination.totalPage }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                onClick={() => setPage(pageNum)}
                className={`px-3 py-1 border rounded ${
                  page === pageNum ? "bg-blue-600 text-white" : ""
                }`}
              >
                {pageNum}
              </button>
            )
          )}

          <button
            disabled={
              pagination.totalPage !== null && page === pagination.totalPage
            }
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1 border rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default Vocabulary;
