"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, Search, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SearchableAreaDropdownProps {
  options: string[]
  value: string
  onChange: (value: string) => void
  placeholder: string
  label: string
  required?: boolean
}

export default function SearchableAreaDropdown({
  options,
  value,
  onChange,
  placeholder,
  label,
  required = false,
}: SearchableAreaDropdownProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  const filteredOptions = options.filter((option) => option.toLowerCase().includes(searchTerm.toLowerCase()))

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
        setSearchTerm("")
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus()
    }
  }, [isOpen])

  const handleSelect = (option: string) => {
    onChange(option)
    setIsOpen(false)
    setSearchTerm("")
  }

  const clearSelection = () => {
    onChange("")
    setSearchTerm("")
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <Label className="block text-sm font-medium text-gray-700 mb-2">
        {label} {required && <span className="text-red-500">*</span>}
      </Label>

      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`w-full p-3 text-left border-2 rounded-lg bg-white hover:border-pink-300 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 transition-colors ${
            isOpen ? "border-pink-500 ring-2 ring-pink-200" : "border-gray-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={value ? "text-gray-900" : "text-gray-500"}>{value || placeholder}</span>
            <div className="flex items-center space-x-2">
              {value && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    clearSelection()
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              )}
              <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
            </div>
          </div>
        </button>

        {isOpen && (
          <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-lg shadow-lg overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100 bg-gray-50">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  placeholder={`Search ${label.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 border-gray-200 focus:border-pink-500 focus:ring-pink-200 bg-white"
                />
              </div>
            </div>

            {/* Scrollable Options List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    onClick={() => handleSelect(option)}
                    className={`w-full px-4 py-3 text-left hover:bg-pink-50 transition-colors border-b border-gray-50 last:border-b-0 ${
                      value === option ? "bg-pink-100 text-pink-700 font-medium" : "text-gray-900"
                    }`}
                  >
                    {option}
                  </button>
                ))
              ) : (
                <div className="px-4 py-6 text-gray-500 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p>No results found for "{searchTerm}"</p>
                  <p className="text-sm mt-1">Try a different search term</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
