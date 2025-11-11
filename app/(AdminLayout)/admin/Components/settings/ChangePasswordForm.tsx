// ChangePasswordForm component (stub)
'use client'

interface ChangePasswordFormProps {
  onBack?: () => void;
  isMobileView?: boolean;
}

export default function ChangePasswordForm({ onBack, isMobileView }: ChangePasswordFormProps) {
  return (
    <div className="p-4">
      {isMobileView && onBack && (
        <button onClick={onBack} className="mb-4 px-3 py-2 rounded bg-gray-100">
          Back
        </button>
      )}
      <h4 className="h4 mb-2">Change Password</h4>
      <p className="text-sm text-secondary/70">Change password form is temporarily stubbed.</p>
    </div>
  );
}
