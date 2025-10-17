"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const DREAM_SCHOOLS = [
  { name: "Harvard University", icon: "🏛️" },
  { name: "Stanford University", icon: "🌲" },
  { name: "MIT", icon: "🔬" },
  { name: "Yale University", icon: "🦬" },
  { name: "Princeton University", icon: "🐅" },
  { name: "Columbia University", icon: "🦁" },
  { name: "University of Chicago", icon: "🏛️" },
  { name: "University of Pennsylvania", icon: "🔴" },
  { name: "California Institute of Technology", icon: "🚀" },
  { name: "Duke University", icon: "😈" },
  { name: "Northwestern University", icon: "💜" },
  { name: "Dartmouth College", icon: "🌲" },
  { name: "Brown University", icon: "🐻" },
  { name: "Vanderbilt University", icon: "⚓" },
  { name: "Rice University", icon: "🦉" },
  { name: "Washington University in St. Louis", icon: "🐻" },
  { name: "Cornell University", icon: "🔴" },
  { name: "University of Notre Dame", icon: "☘️" },
  { name: "UCLA", icon: "🐻" },
  { name: "Emory University", icon: "🦅" },
]

interface DreamSchoolSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function DreamSchoolSelector({ value, onChange }: DreamSchoolSelectorProps) {
  const [customSchool, setCustomSchool] = useState("")

  const handleSchoolSelect = (schoolName: string) => {
    if (!value.includes(schoolName)) {
      onChange([...value, schoolName])
    }
  }

  const handleCustomSchoolAdd = () => {
    if (customSchool.trim() && !value.includes(customSchool.trim())) {
      onChange([...value, customSchool.trim()])
      setCustomSchool("")
    }
  }

  const removeSchool = (schoolToRemove: string) => {
    onChange(value.filter((school) => school !== schoolToRemove))
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2">
        <Label className="label-style">Select Dream Schools</Label>
        <Select onValueChange={handleSchoolSelect}>
          <SelectTrigger className="input-style">
            <SelectValue placeholder="Choose from popular schools" />
          </SelectTrigger>
          <SelectContent>
            {DREAM_SCHOOLS.map((school) => (
              <SelectItem key={school.name} value={school.name}>
                <div className="flex items-center gap-2">
                  <span>{school.icon}</span>
                  <span>{school.name}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-col gap-2">
        <Label className="label-style">Or Add Custom School</Label>
        <div className="flex gap-2">
          <Input
            className="input-style flex-1"
            placeholder="Enter school name"
            value={customSchool}
            onChange={(e) => setCustomSchool(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCustomSchoolAdd()}
          />
          <button
            type="button"
            onClick={handleCustomSchoolAdd}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Add
          </button>
        </div>
      </div>

      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="label-style">Selected Schools:</Label>
          <div className="flex flex-wrap gap-2">
            {value.map((school) => (
              <div
                key={school}
                className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
              >
                <span>{school}</span>
                <button
                  type="button"
                  onClick={() => removeSchool(school)}
                  className="text-green-600 hover:text-green-800"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
