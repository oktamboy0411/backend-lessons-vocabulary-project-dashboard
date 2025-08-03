import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";
import { API_URL } from "~/config";
import VocabularySelect from "~/components/vocabularySelect";
import SectionSelect from "~/components/sectionSelect";
import CategorySelect from "~/components/categorySelect";
import UploadFile from "~/components/uploadFile";

interface WordForm {
  name: string;
  description: string;
  vocabulary: string;
  section: string;
  category: string;
  image: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
}

function CreateWord() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<WordForm>({
    name: "",
    description: "",
    vocabulary: "",
    section: "",
    category: "",
    image: "",
  });

  const [message, setMessage] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
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
      section: "",
      category: "",
    }));
  };

  const handleSectionChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      section: value,
      category: "",
    }));
  };

  const handleCategoryChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !formData.name.trim() ||
      !formData.description.trim() ||
      !formData.vocabulary ||
      !formData.section
    ) {
      setMessage("Please fill all required fields.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const token = localStorage.getItem("token");

      const filteredData = Object.fromEntries(
        Object.entries(formData).filter(([_, v]) => v !== "")
      );

      const res = await axios.post<ApiResponse>(
        `${API_URL}/word/create`,
        filteredData,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage(res.data.message);
      if (res.data.success) {
        navigate("/word");
      }
    } catch (err: any) {
      if (axios.isAxiosError(err) && err.response?.data?.message) {
        setMessage(err.response.data.message);
      } else {
        setMessage("Failed to create word.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6 text-center">Create Word</h1>

      <div className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Word Name"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.name}
          onChange={handleChange}
        />

        <textarea
          name="description"
          placeholder="Description"
          className="w-full border px-4 py-2 rounded-md"
          value={formData.description}
          onChange={handleChange}
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

        {formData.section && (
          <CategorySelect
            value={formData.category}
            onChange={handleCategoryChange}
            sectionId={formData.section}
            className="w-full"
            includeAllOption={true}
          />
        )}

        {formData.image && (
          <div className="mt-2">
            <img
              src={formData.image}
              alt="Uploaded"
              className="max-h-64 rounded border object-contain"
            />
          </div>
        )}

        <UploadFile
          onUploadSuccess={(url) =>
            setFormData((prev) => ({ ...prev, image: url }))
          }
        />

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition disabled:opacity-50"
        >
          {loading ? "Creating..." : "Create Word"}
        </button>

        {message && (
          <p
            className={`text-center font-medium mt-2 ${
              message.toLowerCase().includes("failed") ||
              message.toLowerCase().includes("error")
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

export default CreateWord;
