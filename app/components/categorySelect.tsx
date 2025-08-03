import { useEffect, useRef, useState } from "react";
import { API_URL } from "~/config";

interface Category {
  _id: string;
  name: string;
  section: {
    _id: string;
    name: string;
  };
  vocabulary: {
    _id: string;
    name: string;
    type: string;
  };
}

interface CategorySelectProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  includeAllOption?: boolean;
  sectionId?: string;
}

function CategorySelect({
  value,
  onChange,
  className = "",
  includeAllOption = true,
  sectionId,
}: CategorySelectProps) {
  const [options, setOptions] = useState<Category[]>([]);
  const [filteredOptions, setFilteredOptions] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (sectionId) params.append("section", sectionId);

        const res = await fetch(
          `${API_URL}/category/get-all?${params.toString()}`
        );
        const json = await res.json();

        if (json.success) {
          setOptions(json.data);
          setFilteredOptions(json.data);
        } else {
          setError(json.message || "Failed to fetch categories.");
        }
      } catch {
        setError("Network error");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, [sectionId]);

  useEffect(() => {
    if (searchTerm === "") {
      setFilteredOptions(options);
    } else {
      const lower = searchTerm.toLowerCase();
      setFilteredOptions(
        options.filter((category) =>
          category.name.toLowerCase().includes(lower)
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
    if (includeAllOption && value === "") return "All categories";
    const selected = options.find((opt) => opt._id === value);
    return selected
      ? `${selected.name} [${selected.section.name}]`
      : "Select category";
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
            placeholder="Search categories..."
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
              All categories
            </div>
          )}

          {loading ? (
            <div className="px-3 py-2 text-gray-500">Loading...</div>
          ) : error ? (
            <div className="px-3 py-2 text-red-600">{error}</div>
          ) : filteredOptions.length === 0 ? (
            <div className="px-3 py-2 text-gray-400">No results found</div>
          ) : (
            filteredOptions.map((category) => (
              <div
                key={category._id}
                onClick={() => {
                  onChange(category._id);
                  setShowDropdown(false);
                  setSearchTerm("");
                }}
                className={`px-3 py-2 hover:bg-gray-100 cursor-pointer ${
                  value === category._id ? "bg-blue-100" : ""
                }`}
              >
                {category.name} [<i>{category.section.name}</i>]
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default CategorySelect;
