import React, { useState, useRef, useEffect } from 'react';
import { studentData } from '../data/students';

type AutocompleteInputProps = {
  value: string;
  onChange: (value: string) => void;
  onSelectStudent: (student: { name: string; class: string }) => void;
};

export function AutocompleteInput({ value, onChange, onSelectStudent }: AutocompleteInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<typeof studentData>([]);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    onChange(inputValue);

    if (inputValue.length > 0) {
      const filtered = studentData.filter(student =>
        student.name.toLowerCase().includes(inputValue.toLowerCase())
      );
      setSuggestions(filtered);
      setIsOpen(true);
    } else {
      setSuggestions([]);
      setIsOpen(false);
    }
  };

  const handleSelectSuggestion = (student: typeof studentData[0]) => {
    onChange(student.name);
    onSelectStudent(student);
    setIsOpen(false);
  };

  return (
    <div ref={wrapperRef} className="relative">
      <input
        type="text"
        value={value}
        onChange={handleInputChange}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
        placeholder="Start typing student name..."
      />
      
      {isOpen && suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto border border-gray-200">
          {suggestions.map((student, index) => (
            <li
              key={index}
              onClick={() => handleSelectSuggestion(student)}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex justify-between items-center"
            >
              <span className="font-medium">{student.name}</span>
              <span className="text-sm text-gray-500">{student.class}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}