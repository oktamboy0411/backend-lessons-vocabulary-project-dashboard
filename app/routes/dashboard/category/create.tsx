import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_URL } from "~/config";
import VocabularySelect from "~/components/vocabularySelect";
import SectionSelect from "~/components/sectionSelect";

interface CategoryForm {
  name: string;
  vocabulary: string;
  section: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function CreateCategory() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<CategoryForm>({
    name: "",
    vocabulary: "",
    section: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleVocabularyChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      vocabulary: value,
      section: "", // vocabulary o‘zgarganda sectionni tozalaymiz
    }));
  };

  const handleSectionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      section: value,
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.vocabulary || !formData.section) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v)
      );

      const res = await axios.post<ApiResponse>(
        `${API_URL}/category/create`,
        filteredData,
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
        setMessage("Failed to create category.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Category</h1>

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

        <VocabularySelect
          value={formData.vocabulary}
          onChange={handleVocabularyChange}
          className="w-full"
          includeAllOption={false}
        />

        {formData.vocabulary && (
          <SectionSelect
            value={formData.section}
            onChange={handleSectionChange}
            vocabularyId={formData.vocabulary}
            className="w-full"
            includeAllOption={false}
          />
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Category"}
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

export default CreateCategory;
