// ProfileForm component (stub)
'use client'

interface ProfileFormProps {
  onBack?: () => void;
  isMobileView?: boolean;
}

export default function ProfileForm({ onBack, isMobileView }: ProfileFormProps) {
  return (
    <div className="p-4">
      {isMobileView && onBack && (
        <button onClick={onBack} className="mb-4 px-3 py-2 rounded bg-gray-100">
          Back
        </button>
      )}
      <h4 className="h4 mb-2">Edit Profile</h4>
      <p className="text-sm text-secondary/70">Profile form is temporarily stubbed.</p>
    </div>
  );
}
