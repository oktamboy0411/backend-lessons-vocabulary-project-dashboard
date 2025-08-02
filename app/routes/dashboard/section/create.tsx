import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_URL } from "~/config";
import UploadFile from "~/components/uploadFile";
import VocabularySelect from "~/components/vocabularySelect";

interface SectionForm {
  name: string;
  vocabulary: string; // vocabulary id
  image?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function CreateSection() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<SectionForm>({
    name: "",
    vocabulary: "",
    image: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
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
    }));
  };

  const handleSubmit = async () => {
    if (!formData.name.trim() || !formData.vocabulary) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      // Yuboriladigan ma'lumot (faqat mavjud maydonlar)
      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v)
      );

      const res = await axios.post<ApiResponse>(
        `${API_URL}/section/create`,
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
        setMessage("Failed to create section.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Section</h1>

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

        <VocabularySelect
          value={formData.vocabulary}
          onChange={handleVocabularyChange}
          className="w-full"
          includeAllOption={false}
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
          {loading ? "Creating..." : "Create Section"}
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

export default CreateSection;
