import React, { useEffect, useRef, useState } from "react";
import { HiChevronUpDown, HiCheck } from "react-icons/hi2/index.js";

interface ComboboxOption {
  id: string;
  name: string;
}

export interface ComboboxProps {
  query: string;
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  className: string;
  placeholder: string;
  options: ComboboxOption[];
  required?: boolean;
  disabled?: boolean;
}

export const Combobox = ({
  query,
  setQuery,
  className,
  placeholder,
  options,
  required = false,
  disabled = false,
}: ComboboxProps) => {
  const [selected, setSelected] = useState<ComboboxOption | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const comboboxRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        comboboxRef.current &&
        !comboboxRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    if (!options.some((option) => option.name === query)) {
      setSelectedId(null);
      setSelected(null);
    } else {
      const selection = options.find((option) => option.name === query);
      if (selection) {
        setSelectedId(selection.id);
        setSelected(selection);
      }
    }
  }, [query]);

  const handleOptionClick = (option: ComboboxOption) => {
    setQuery(option.name);
    setSelectedId(option.id);
    setSelected(option);
    setIsOpen(false);
  };

  useEffect(() => {
    if (selected) {
      setQuery(selected.name);
    }
  }, [selected]);

  const filteredOptions =
    query === ""
      ? options
      : options.some((option) => option.name === query)
      ? options
      : options.filter((option) =>
          option.name.toLowerCase().includes(query.toLowerCase()),
        );

  const toggleCombobox = () => {
    setIsOpen(!isOpen);
  };

  const handleInputChange = () => {
    setQuery(inputRef.current?.value || "");
  };

  const handleInputBlur = () => {
    if (query === "") {
      setSelected(null);
    }
  };

  return (
    <div className="combobox" ref={comboboxRef}>
      <input
        ref={inputRef}
        className={className}
        onChange={handleInputChange}
        onBlur={handleInputBlur}
        value={query}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
      />
      <button type="button" className="button" onClick={toggleCombobox}>
        <HiChevronUpDown className="icon" />
      </button>

      {filteredOptions.length > 0 && isOpen && (
        <div className="dropdown">
          {filteredOptions.map((option) => (
            <div
              key={option.id}
              className={`option ${selectedId === option.id ? "selected" : ""}`}
              onClick={() => handleOptionClick(option)}
            >
              <span>{option.name}</span>
              {selected?.id === option.id && (
                <span className="circle">
                  <HiCheck className="check" />
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
