// InterfacesAutocomplete.jsx
import { useState, useEffect } from "react";

const InterfacesAutocomplete = ({ interfaces, value, onChange }) => {
  const [inputValue, setInputValue] = useState("");
  const [filteredInterfaces, setFilteredInterfaces] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredInterfaces([]);
      setShowDropdown(false);
      return;
    }

    const filtered = interfaces.filter((item) =>
      `${item.label || ""} ${item.serial || ""}`.toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredInterfaces(filtered);
    setShowDropdown(filtered.length > 0);
  }, [inputValue, interfaces]);

  return (
    <div className="relative w-full">
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="border p-2 w-full"
        placeholder="Search interface..."
      />
      {showDropdown && (
        <ul className="absolute z-10 w-full bg-white border max-h-60 overflow-auto">
          {filteredInterfaces.map((item) => (
            <li
              key={item.id}
              onClick={() => {
                onChange(item);
                setInputValue(item.label);
                setShowDropdown(false);
              }}
              className="p-2 cursor-pointer hover:bg-gray-200"
            >
              {item.label} ({item.serial})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default InterfacesAutocomplete;
