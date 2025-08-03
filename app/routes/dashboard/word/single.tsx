import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";
import { API_URL } from "~/config";

interface WordDetailsData {
  _id: string;
  name: string;
  description: string;
  image?: string;
  vocabulary: {
    _id: string;
    name: string;
    type: string;
  };
  section: {
    _id: string;
    name: string;
  };
  category: {
    _id: string;
    name: string;
  } | null;
  created_at: string;
  updated_at: string;
}

function WordDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [word, setWord] = useState<WordDetailsData | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchWord = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        const res = await axios.get(`${API_URL}/word/get-one/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.data.success) {
          setWord(res.data.data);
        } else {
          setError(res.data.message || "Failed to fetch word.");
        }
      } catch {
        setError("Network error.");
      } finally {
        setLoading(false);
      }
    };

    fetchWord();
  }, [id]);

  if (loading) {
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">Loading...</p>
    );
  }

  if (error) {
    return <p className="text-center text-red-600 mt-10 text-lg">{error}</p>;
  }

  if (!word) {
    return (
      <p className="text-center mt-10 text-gray-600 text-lg">
        No word data found.
      </p>
    );
  }

  return (
    <div className="mx-auto px-6 py-10 space-y-6">
      {word.image && (
        <div className="flex justify-start">
          <img
            src={word.image}
            alt={word.name}
            className="max-h-96 rounded-md border object-contain"
          />
        </div>
      )}

      <h1 className="text-4xl font-bold text-gray-800">{word.name}</h1>

      <div className="space-y-2 text-gray-700 text-lg">
        <p>
          <span className="font-semibold">Vocabulary:</span>{" "}
          {word.vocabulary.name}{" "}
          <span className="text-sm text-gray-500">
            ({word.vocabulary.type})
          </span>
        </p>
        <p>
          <span className="font-semibold">Section:</span> {word.section.name}
        </p>
        <p>
          <span className="font-semibold">Category:</span>{" "}
          {word.category ? word.category.name : "—"}
        </p>
      </div>

      <div className="text-gray-800">
        <h2 className="text-2xl font-semibold mb-2">Description</h2>
        <p className="text-lg">{word.description}</p>
      </div>

      <div className="text-sm text-gray-500 mt-4">
        <p>
          <span className="font-medium">Created:</span>{" "}
          {new Date(word.created_at).toLocaleString()}
        </p>
        <p>
          <span className="font-medium">Updated:</span>{" "}
          {new Date(word.updated_at).toLocaleString()}
        </p>
      </div>

      <div className="mt-6">
        <button
          onClick={() => navigate(-1)}
          className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
        >
          ← Back
        </button>
      </div>
    </div>
  );
}

export default WordDetails;
