import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "~/config";
import UploadFile from "~/components/uploadFile";

interface SectionForm {
  name: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function UpdateSection() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SectionForm>({
    name: "",
    image: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  // Ma'lumotlarni olish
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/section/get-one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        // Backend formatiga qarab o'zgartiring:
        // Misol uchun: res.data.data = { name, image }
        setFormData(res.data.data);
      } catch (err) {
        console.error("Failed to fetch section data");
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

      // Faqat mavjud maydonlar yuboriladi
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v)
      );

      const res = await axios.put<ApiResponse>(
        `${API_URL}/section/update/${id}`,
        filteredData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      navigate("/section");
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to update section.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Update Section</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Section Name"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.name}
          onChange={handleChange}
          required
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
          onClick={handleUpdate}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Updating..." : "Update Section"}
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

export default UpdateSection;
