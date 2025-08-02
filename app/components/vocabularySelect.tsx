import { useEffect, useRef, useState } from "react";
import { API_URL } from "~/config";

interface Vocabulary {
  _id: string;
  name: string;
  type: string;
}

interface VocabularySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  includeAllOption?: boolean;
}

function VocabularySelect({
  value,
  onChange,
  className = "",
  includeAllOption = true,
}: VocabularySelectProps) {
  const [options, setOptions] = useState<Vocabulary[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Vocabulary[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchVocabularies = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/vocabulary/get-all`);
        const json = await res.json();

        if (json.success) {
          setOptions(json.data);
          setFilteredOptions(json.data);
        } else {
          setError(json.message || "Failed to fetch vocabularies.");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchVocabularies();
  }, []);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(
        options.filter((vocab) =>
          vocab.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  }, [searchTerm, options]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedLabel = () => {
    if (includeAllOption && value === "") return "All vocabularies";
    const selected = options.find((opt) => opt._id === value);
    return selected
      ? `${selected.name} (${selected.type})`
      : "Select vocabulary";
  };

  return (
    <div className={`relative w-3xs ${className}`} ref={dropdownRef}>
      <div
        onClick={() => setShowDropdown((prev) => !prev)}
        className="border px-3 py-2 rounded-md cursor-pointer bg-white"
      >
        {selectedLabel()}
      </div>

      {showDropdown && (
        <div className="absolute z-10 mt-1 w-full bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border-b outline-none"
          />

          {includeAllOption && (
            <div
              onClick={() => {
                onChange("");
                setShowDropdown(false);
              }}
              className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                value === "" ? "bg-blue-100" : ""
              }`}
            >
              All vocabularies
            </div>
          )}

          {loading ? (
            <div className="px-3 py-2 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-3 py-2 text-red-600">{error}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-400">No results found</div>
          ) : (
            filteredOptions.map((vocab) => (
              <div
                key={vocab._id}
                onClick={() => {
                  onChange(vocab._id);
                  setShowDropdown(false);
                  setSearchTerm("");
                }}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === vocab._id ? "bg-blue-100" : ""
                }`}
              >
                {vocab.name} ({vocab.type})
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default VocabularySelect;
