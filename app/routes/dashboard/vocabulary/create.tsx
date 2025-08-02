import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_URL } from "~/config";
import UploadFile from "~/components/uploadFile";

interface VocabularyForm {
  name: string;
  type: string;
  description?: string;
  image?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function CreateVocabulary() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VocabularyForm>({
    name: "",
    type: "",
    description: "",
    image: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      // Faqat mavjud (truthy) maydonlarni yuborish
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v)
      );

      const res = await axios.post<ApiResponse>(
        `${API_URL}/vocabulary/create`,
        filteredData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      navigate("/vocabulary");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to create vocabulary.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Vocabulary</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option disabled value={""}>
            select type
          </option>
          <option value="modern">Modern</option>
          <option value="history">History</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          rows={3}
          className="w-full border px-4 py-2 rounded-md"
          value={formData.description}
          onChange={handleChange}
        />

        {formData.image && (
          <img
            src={formData.image}
            alt="Uploaded"
            className="max-h-48 object-contain rounded-md border"
          />
        )}

        <UploadFile
          onUploadSuccess={(url) =>
            setFormData((prev) => ({ ...prev, image: url }))
          }
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Vocabulary"}
        </button>

        {message && (
          <p className="text-center font-medium text-green-600 mt-2">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default CreateVocabulary;
