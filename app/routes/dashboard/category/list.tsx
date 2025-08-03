import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { API_URL } from "~/config";
import VocabularySelect from "~/components/vocabularySelect";
import SectionSelect from "~/components/sectionSelect";

interface CategoryItem {
  _id: string;
  name: string;
  vocabulary: {
    _id: string;
    name: string;
    type: string;
  };
  section: {
    _id: string;
    name: string;
  };
  created_at: string;
  updated_at: string;
}

interface ApiResponse {
  success: boolean;
  data: CategoryItem[];
  pagination: {
    page: number | null;
    limit: number | null;
    totalPage: number | null;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  message?: string;
}

const LIMIT = 10;

function CategoryPage() {
  const [search, setSearch] = useState("");
  const [vocabularyId, setVocabularyId] = useState("");
  const [sectionId, setSectionId] = useState("");
  const [page, setPage] = useState(1);

  const [data, setData] = useState<CategoryItem[]>([]);
  const [pagination, setPagination] = useState<ApiResponse["pagination"]>({
    page: 1,
    limit: LIMIT,
    totalPage: null,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const searchTimeout = useRef<NodeJS.Timeout | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError("");

    try {
      const params = new URLSearchParams();
      if (search) params.append("search", search);
      if (vocabularyId) params.append("vocabulary", vocabularyId);
      if (sectionId) params.append("section", sectionId);
      params.append("page", page.toString());
      params.append("limit", LIMIT.toString());

      const res = await fetch(
        API_URL + `/category/get-all?` + params.toString()
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
        setError(json.message || "Failed to load data.");
      }
    } catch {
      setError("Network error.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [vocabularyId, sectionId, page]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    searchTimeout.current = setTimeout(() => {
      setPage(1);
      fetchData();
    }, 700);
    return () => {
      if (searchTimeout.current) clearTimeout(searchTimeout.current);
    };
  }, [search]);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this category?"))
      return;

    try {
      const res = await fetch(API_URL + `/category/delete/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const json = await res.json();
      if (json.success) {
        fetchData();
      } else {
        alert(json.message || "Failed to delete category.");
      }
    } catch {
      alert("Network error");
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-3xl font-bold mb-6">Categories</h1>

      {/* Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <VocabularySelect
          value={vocabularyId}
          onChange={(val) => {
            setVocabularyId(val);
            setPage(1);
          }}
        />

        <SectionSelect
          value={sectionId}
          onChange={(val) => {
            setSectionId(val);
            setPage(1);
          }}
          vocabularyId={vocabularyId}
        />

        <input
          type="text"
          placeholder="Search..."
          className="border rounded-md px-3 py-2 flex-grow"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Link
          to="/category/create"
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition"
        >
          Create New
        </Link>
      </div>

      {/* Table */}
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
              <th className="border px-4 py-2 text-left">Name</th>
              <th className="border px-4 py-2 text-left">Vocabulary</th>
              <th className="border px-4 py-2 text-left">Section</th>
              <th className="border px-4 py-2 text-left">Created</th>
              <th className="border px-4 py-2 text-left">Updated</th>
              <th className="border px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item._id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{item.name}</td>
                <td className="border px-4 py-2">
                  {item.vocabulary.name} ({item.vocabulary.type})
                </td>
                <td className="border px-4 py-2">{item.section.name}</td>
                <td className="border px-4 py-2">
                  {new Date(item.created_at).toLocaleDateString()} <br />
                  {new Date(item.created_at).toLocaleTimeString()}
                </td>
                <td className="border px-4 py-2">
                  {new Date(item.updated_at).toLocaleDateString()} <br />
                  {new Date(item.updated_at).toLocaleTimeString()}
                </td>
                <td className="border flex flex-col gap-1 border-gray-300 px-4 py-2 text-center">
                  <Link
                    to={`/category/update/${item._id}`}
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

      {/* Pagination */}
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

export default CategoryPage;
