import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Monitor, Check, X } from "lucide-react";

export default function InterfaceAutocomplete({
  value,
  onChange,
  interfaces = [],
  disabled = false,
  label = "Interface",
  placeholder = "Enter interface name...",
  required = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredInterfaces, setFilteredInterfaces] = useState([]);
  const [selectedInterface, setSelectedInterface] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initialize component with existing value
  useEffect(() => {
    console.log("InterfaceAutocomplete - value changed:", value);
    console.log("InterfaceAutocomplete - interfaces:", interfaces);
    
    if (value && interfaces.length > 0) {
      const interfaceItem = interfaces.find((i) => i.value === value || i.id === value);
      if (interfaceItem) {
        console.log("InterfaceAutocomplete - found interface:", interfaceItem);
        setSelectedInterface(interfaceItem);
        setInputValue(interfaceItem.name || interfaceItem.label || interfaceItem.title || "");
      }
    } else if (!value) {
      // Clear selection when value is empty
      console.log("InterfaceAutocomplete - clearing selection");
      setSelectedInterface(null);
      setInputValue("");
    }
  }, [value, interfaces]);

  // Filter interfaces based on name input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredInterfaces([]);
      setShowDropdown(false);
      return;
    }

    const filtered = interfaces.filter((interfaceItem) => {
      const searchTerm = inputValue.toLowerCase();
      const name = (interfaceItem.name || interfaceItem.label || interfaceItem.title || "").toLowerCase();
      const description = (interfaceItem.description || "").toLowerCase();
      
      return name.includes(searchTerm) || description.includes(searchTerm);
    });

    setFilteredInterfaces(filtered);
    setShowDropdown(filtered.length > 0 && inputValue.length > 0);
  }, [inputValue, interfaces]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log("InterfaceAutocomplete - input changed:", newValue);
    setInputValue(newValue);

    if (!newValue.trim()) {
      setSelectedInterface(null);
      onChange("");
    }
  };

  // Handle interface selection
  const handleInterfaceSelect = (interfaceItem) => {
    console.log("InterfaceAutocomplete - interface selected:", interfaceItem);
    setSelectedInterface(interfaceItem);
    setInputValue(interfaceItem.name || interfaceItem.label || interfaceItem.title || "");
    setShowDropdown(false);
    onChange(interfaceItem.value || interfaceItem.id);
    inputRef.current?.blur();
  };

  // Handle manual interface entry (exact match)
  const handleInputBlur = () => {
    // Use a longer timeout to allow dropdown clicks to register
    setTimeout(() => {
      // Only process blur if dropdown is not being interacted with
      if (!dropdownRef.current?.contains(document.activeElement)) {
        if (inputValue.trim()) {
          const exactMatch = interfaces.find(
            (interfaceItem) => {
              const name = (interfaceItem.name || interfaceItem.label || interfaceItem.title || "").toLowerCase();
              return name === inputValue.toLowerCase();
            }
          );

          if (exactMatch && (!selectedInterface || (selectedInterface.value || selectedInterface.id) !== (exactMatch.value || exactMatch.id))) {
            console.log("InterfaceAutocomplete - exact match found:", exactMatch);
            setSelectedInterface(exactMatch);
            setInputValue(exactMatch.name || exactMatch.label || exactMatch.title || "");
            onChange(exactMatch.value || exactMatch.id);
          } else if (!exactMatch && !selectedInterface) {
            // Only clear if no interface is selected and no exact match
            console.log("InterfaceAutocomplete - no match, clearing");
            setSelectedInterface(null);
            onChange("");
          }
        }
        setShowDropdown(false);
      }
    }, 200);
  };

  // Clear selection
  const handleClear = () => {
    console.log("InterfaceAutocomplete - clearing selection");
    setInputValue("");
    setSelectedInterface(null);
    setShowDropdown(false);
    onChange("");
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && filteredInterfaces.length === 1) {
      e.preventDefault();
      handleInterfaceSelect(filteredInterfaces[0]);
    }
  };

  // Handle dropdown item click - prevent blur event
  const handleDropdownItemClick = (interfaceItem) => {
    console.log("InterfaceAutocomplete - dropdown item clicked:", interfaceItem);
    // Don't prevent default here, just handle the selection immediately
    setSelectedInterface(interfaceItem);
    setInputValue(interfaceItem.name || interfaceItem.label || interfaceItem.title || "");
    setShowDropdown(false);
    onChange(interfaceItem.value || interfaceItem.id);
    // Don't blur the input to avoid triggering the blur handler
  };

  return (
    <div className="space-y-2 relative">
      <Label className={required ? "required" : ""}>
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <div className="relative">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputBlur}
            onKeyDown={handleKeyDown}
            onFocus={() =>
              inputValue && setShowDropdown(filteredInterfaces.length > 0)
            }
            placeholder={placeholder}
            disabled={disabled}
            className={`pr-20 ${selectedInterface ? "border-green-500" : ""}`}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {selectedInterface && (
              <>
                <Check className="h-4 w-4 text-green-500" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleClear}
                  disabled={disabled}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-3 w-3" />
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Selected interface info */}
        {selectedInterface && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
            <div className="flex items-center space-x-2">
              <Monitor className="h-4 w-4 text-green-600" />
              <span className="font-medium">
                {selectedInterface.name || selectedInterface.label || selectedInterface.title}
              </span>
            </div>
            {selectedInterface.description && (
              <div className="text-xs text-gray-600 mt-1">
                {selectedInterface.description}
              </div>
            )}
          </div>
        )}

        {/* Dropdown */}
        {showDropdown && (
          <div
            ref={dropdownRef}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto"
          >
            {filteredInterfaces.map((interfaceItem) => (
              <div
                key={interfaceItem.value || interfaceItem.id}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 cursor-pointer first:rounded-t-md last:rounded-b-md"
                onMouseDown={() => handleDropdownItemClick(interfaceItem)}
              >
                <div className="flex items-center space-x-2">
                  <Monitor className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {interfaceItem.name || interfaceItem.label || interfaceItem.title}
                    </div>
                    {interfaceItem.description && (
                      <div className="text-xs text-gray-500 truncate">
                        {interfaceItem.description}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredInterfaces.length === 0 && inputValue.trim() && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No interfaces found matching "{inputValue}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}