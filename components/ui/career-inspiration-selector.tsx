"use client"

import { Label } from "@/components/ui/label"

const CAREER_OPTIONS = [
  "Software Engineer",
  "Doctor",
  "Lawyer",
  "Teacher",
  "Entrepreneur",
  "Scientist",
  "Artist",
  "Writer",
  "Engineer",
  "Nurse",
  "Architect",
  "Designer",
  "Consultant",
  "Researcher",
  "Analyst",
  "Manager",
  "Marketing Specialist",
  "Financial Advisor",
  "Therapist",
  "Social Worker",
  "Journalist",
  "Photographer",
  "Chef",
  "Musician",
  "Actor",
  "Pilot",
  "Veterinarian",
  "Pharmacist",
  "Dentist",
  "Physical Therapist",
]

interface CareerInspirationSelectorProps {
  value: string[]
  onChange: (value: string[]) => void
}

export function CareerInspirationSelector({ value, onChange }: CareerInspirationSelectorProps) {
  const toggleCareer = (career: string) => {
    if (value.includes(career)) {
      onChange(value.filter((c) => c !== career))
    } else {
      onChange([...value, career])
    }
  }

  return (
    <div className="space-y-4">
      <Label className="label-style">Career Inspiration (Select all that interest you)</Label>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {CAREER_OPTIONS.map((career) => (
          <div
            key={career}
            onClick={() => toggleCareer(career)}
            className={`
              cursor-pointer p-3 rounded-lg border-2 text-center text-sm font-medium transition-all
              ${
                value.includes(career)
                  ? "border-green-500 bg-green-50 text-green-700"
                  : "border-gray-200 bg-white text-gray-700 hover:border-green-300 hover:bg-green-25"
              }
            `}
          >
            {career}
          </div>
        ))}
      </div>

      {value.length > 0 && (
        <div className="mt-4">
          <Label className="label-style">Selected Careers:</Label>
          <div className="flex flex-wrap gap-2 mt-2">
            {value.map((career) => (
              <span key={career} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                {career}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
