import { useEffect, useRef, useState } from "react";
import { API_URL } from "~/config";

interface Section {
  _id: string;
  name: string;
  vocabulary: {
    _id: string;
    name: string;
    type: string;
  };
  image?: string;
  created_at: string;
  updated_at: string;
}

interface SectionSelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  includeAllOption?: boolean;
  vocabularyId?: string; // YANGI: faqat shu vocabulary bo‘yicha filterlash
}

function SectionSelect({
  value,
  onChange,
  className = "",
  includeAllOption = true,
  vocabularyId,
}: SectionSelectProps) {
  const [options, setOptions] = useState<Section[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Section[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchSections = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (vocabularyId) params.append("vocabulary", vocabularyId);

        const res = await fetch(
          `${API_URL}/section/get-all?${params.toString()}`
        );
        const json = await res.json();

        if (json.success) {
          setOptions(json.data);
          setFilteredOptions(json.data);
        } else {
          setError(json.message || "Failed to fetch sections.");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, [vocabularyId]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredOptions(
        options.filter(
          (section) =>
            section.name.toLowerCase().includes(lower) ||
            section.vocabulary.name.toLowerCase().includes(lower) ||
            section.vocabulary.type.toLowerCase().includes(lower)
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
    if (includeAllOption && value === "") return "All sections";
    const selected = options.find((opt) => opt._id === value);
    return selected
      ? `${selected.name} [${selected.vocabulary.name} - ${selected.vocabulary.type}]`
      : "Select section";
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
            type="text"
            placeholder="Search sections..."
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
              All sections
            </div>
          )}

          {loading ? (
            <div className="px-3 py-2 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-3 py-2 text-red-600">{error}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-400">No results found</div>
          ) : (
            filteredOptions.map((section) => (
              <div
                key={section._id}
                onClick={() => {
                  onChange(section._id);
                  setShowDropdown(false);
                  setSearchTerm("");
                }}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === section._id ? "bg-blue-100" : ""
                }`}
              >
                {section.name} [<i>{section.vocabulary.name}</i> -{" "}
                {section.vocabulary.type}]
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default SectionSelect;
