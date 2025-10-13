import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User, Check, X } from "lucide-react";

export default function MatriculeAutocomplete({
  value,
  onChange,
  users = [],
  disabled = false,
  label = "Assigned To",
  placeholder = "Enter matricule...",
  required = false,
}) {
  const [inputValue, setInputValue] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Initialize component with existing value
  useEffect(() => {
    console.log("MatriculeAutocomplete - value changed:", value);
    console.log("MatriculeAutocomplete - users:", users);
    
    if (value && users.length > 0) {
      const user = users.find((u) => u.id === value);
      if (user) {
        console.log("MatriculeAutocomplete - found user:", user);
        setSelectedUser(user);
        setInputValue(user.matricule);
      }
    } else if (!value) {
      // Clear selection when value is empty
      console.log("MatriculeAutocomplete - clearing selection");
      setSelectedUser(null);
      setInputValue("");
    }
  }, [value, users]);

  // Filter users based on matricule input
  useEffect(() => {
    if (!inputValue.trim()) {
      setFilteredUsers([]);
      setShowDropdown(false);
      return;
    }

    const filtered = users.filter((user) =>
      (user.matricule || "").toLowerCase().includes(inputValue.toLowerCase())
    );

    setFilteredUsers(filtered);
    setShowDropdown(filtered.length > 0 && inputValue.length > 0);
  }, [inputValue, users]);

  // Handle input change
  const handleInputChange = (e) => {
    const newValue = e.target.value;
    console.log("MatriculeAutocomplete - input changed:", newValue);
    setInputValue(newValue);

    if (!newValue.trim()) {
      setSelectedUser(null);
      onChange("");
    }
  };

  // Handle user selection
  const handleUserSelect = (user) => {
    console.log("MatriculeAutocomplete - user selected:", user);
    setSelectedUser(user);
    setInputValue(user.matricule);
    setShowDropdown(false);
    onChange(user.id);
    inputRef.current?.blur();
  };

  // Handle manual matricule entry (exact match)
  const handleInputBlur = () => {
    // Use a longer timeout to allow dropdown clicks to register
    setTimeout(() => {
      // Only process blur if dropdown is not being interacted with
      if (!dropdownRef.current?.contains(document.activeElement)) {
        if (inputValue.trim()) {
          const exactMatch = users.find(
            (user) =>
              (user.matricule || "").toLowerCase() ===
              inputValue.toLowerCase()
          );

          if (exactMatch && (!selectedUser || selectedUser.id !== exactMatch.id)) {
            console.log("MatriculeAutocomplete - exact match found:", exactMatch);
            setSelectedUser(exactMatch);
            setInputValue(exactMatch.matricule);
            onChange(exactMatch.id);
          } else if (!exactMatch && !selectedUser) {
            // Only clear if no user is selected and no exact match
            console.log("MatriculeAutocomplete - no match, clearing");
            setSelectedUser(null);
            onChange("");
          }
        }
        setShowDropdown(false);
      }
    }, 200);
  };

  // Clear selection
  const handleClear = () => {
    console.log("MatriculeAutocomplete - clearing selection");
    setInputValue("");
    setSelectedUser(null);
    setShowDropdown(false);
    onChange("");
    inputRef.current?.focus();
  };

  // Keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setShowDropdown(false);
      inputRef.current?.blur();
    } else if (e.key === "Enter" && filteredUsers.length === 1) {
      e.preventDefault();
      handleUserSelect(filteredUsers[0]);
    }
  };

  // Handle dropdown item click - prevent blur event
  const handleDropdownItemClick = (user) => {
    console.log("MatriculeAutocomplete - dropdown item clicked:", user);
    // Don't prevent default here, just handle the selection immediately
    setSelectedUser(user);
    setInputValue(user.matricule);
    setShowDropdown(false);
    onChange(user.id);
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
              inputValue && setShowDropdown(filteredUsers.length > 0)
            }
            placeholder={placeholder}
            disabled={disabled}
            className={`pr-20 ${selectedUser ? "border-green-500" : ""}`}
          />

          <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
            {selectedUser && (
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

        {/* Selected user info */}
        {selectedUser && (
          <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded text-sm">
            <div className="flex items-center space-x-2">
              <User className="h-4 w-4 text-green-600" />
              <span className="font-medium">
                {selectedUser.firstName} {selectedUser.lastName}
              </span>
              <span className="text-green-600">
                ({selectedUser.matricule})
              </span>
            </div>
            {selectedUser.email && (
              <div className="text-xs text-gray-600 mt-1">
                {selectedUser.email}
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
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="w-full px-3 py-2 text-left hover:bg-gray-100 cursor-pointer first:rounded-t-md last:rounded-b-md"
                onMouseDown={() => handleDropdownItemClick(user)}
              >
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-400" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="text-xs text-gray-500 truncate">
                      Matricule: {user.matricule} • {user.email}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && inputValue.trim() && (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                No users found with matricule "{inputValue}"
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}