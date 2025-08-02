import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "~/config";
import UploadFile from "~/components/uploadFile";

interface VocabularyForm {
  name: string;
  type: string;
  description: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function UpdateVocabulary() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<VocabularyForm>({
    name: "",
    type: "",
    description: "",
    image: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // oldingi ma'lumotni olish (ixtiyoriy, backend get-one endpointi bo‘lsa)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/vocabulary/get-one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFormData(res.data.data); // res.data.data — sizning backend formatiga qarab
      } catch (err) {
        console.error("Failed to fetch vocabulary data");
      }
    };

    if (id) fetchData();
  }, [id]);

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

  const handleUpdate = async () => {
    if (!id) return;

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const res = await axios.put<ApiResponse>(
        `${API_URL}/vocabulary/update/${id}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      navigate("/vocabulary"); // update'dan so'ng vocabulary sahifasiga qaytish
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to update vocabulary.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Vocabulary</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Name"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.name}
          onChange={handleChange}
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

        {/* Upload componentni shu yerga qo‘shamiz */}
        <UploadFile
          onUploadSuccess={(url) =>
            setFormData((prev) => ({ ...prev, image: url }))
          }
        />
        <button
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Vocabulary"}
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

export default UpdateVocabulary;
