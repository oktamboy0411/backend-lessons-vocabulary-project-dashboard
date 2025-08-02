import { useState } from "react";
import axios from "axios";
import { API_URL } from "~/config";

type UploadFileProps = {
  onUploadSuccess: (url: string) => void;
};

function UploadFile({ onUploadSuccess }: UploadFileProps) {
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      setMessage("");

      const res = await axios.post(`${API_URL}/upload`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });

      const { success, file_path } = res.data;

      if (success && file_path) {
        onUploadSuccess(file_path); // Rasm linkini parentga yuborish
        setMessage("Upload successful!");
      } else {
        onUploadSuccess("");
        setMessage("Upload failed.");
      }
    } catch {
      onUploadSuccess("");
      setMessage("Error uploading file.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleChange}
        className="w-full mb-2 border px-3 py-2 rounded-md"
      />
      {uploading && <p className="text-sm text-gray-500">Uploading...</p>}
      {message && <p className="text-sm text-blue-600">{message}</p>}
    </div>
  );
}

export default UploadFile;
