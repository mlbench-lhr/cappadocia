// MobileNavigation component
'use client'

import Image from 'next/image';

type MobileView = 'navigation' | 'edit-profile' | 'change-password';

interface MobileNavigationProps {
  onNavigate: (view: MobileView) => void;
}

export default function MobileNavigation({ onNavigate }: MobileNavigationProps) {
  return (
    <div className="lg:hidden">
      <Image className="mx-auto" src="/images/stelomicLogo.svg" alt="Logo" width={110} height={28} />

      <div className="py-2 bg-white">
        <button
          onClick={() => onNavigate('edit-profile')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Image src="/images/settings/Edit.svg" alt="Edit Profile" width={24} height={24} />
            <span className="font-medium text-gray-900">Edit Profile</span>
          </div>
          <span className="text-primary">›</span>
        </button>

        <button
          onClick={() => onNavigate('change-password')}
          className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center space-x-3">
            <Image src="/images/settings/Lock.svg" alt="Change Password" width={24} height={24} />
            <span className="font-medium text-gray-900">Change Password</span>
          </div>
          <span className="text-primary">›</span>
        </button>
      </div>
    </div>
  );
}