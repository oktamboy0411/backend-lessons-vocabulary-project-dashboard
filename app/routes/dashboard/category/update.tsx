import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "~/config";

interface CategoryForm {
  name: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function UpdateCategory() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/category/get-one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // name maydonini set qilamiz
        setFormData({ name: res.data.data.name });
      } catch (err) {
        console.error("Failed to fetch category data");
      }
    };

    if (id) fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdate = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.put<ApiResponse>(
        `${API_URL}/category/update/${id}`,
        { name: formData.name },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      navigate("/category");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to update category.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Category</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Category Name"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Category"}
        </button>

        {message && (
          <p
            className={`text-center font-medium mt-2 ${
              message.toLowerCase().includes("failed")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default UpdateCategory;
