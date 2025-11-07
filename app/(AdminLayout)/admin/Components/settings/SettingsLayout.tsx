'use client'
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNavigation from './MobileNavigation';
import ProfileForm from './ProfileForm';
import ChangePasswordForm from './ChangePasswordForm';
import Image from 'next/image';

type MobileView = 'navigation' | 'edit-profile' | 'change-password';

const SettingsLayout = ({ children }: { children: React.ReactNode }) => {
  const [mobileView, setMobileView] = useState<MobileView>('navigation');

  const handleBackToNavigation = () => {
    setMobileView('navigation');
  };

  const renderMobileContent = () => {
    switch (mobileView) {
      case 'edit-profile':
        return <ProfileForm onBack={handleBackToNavigation} isMobileView={true} />;
      case 'change-password':
        return <ChangePasswordForm onBack={handleBackToNavigation} isMobileView={true} />;
      default:
        return <MobileNavigation onNavigate={setMobileView} />;
    }
  };

  return (
    <>
      {/* Mobile Layout */}
      <div className="lg:hidden">
        {mobileView === 'navigation' ? (
          <MobileNavigation onNavigate={setMobileView} />
        ) : (
          <>
            <Image className="mb-2 mx-auto" src={'/images/stelomicLogo.svg'} alt="Logo" width={110} height={28} />

            <div className="bg-white">
              {renderMobileContent()}
            </div>
          </>
        )}
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:flex rounded-2xl border border-gray-200 w-auto bg-white p-6">
        <div className='border-r border-gray-200'>
          <Sidebar />
        </div>
        <div className="flex-1 py-4">{children}</div>
      </div>
    </>
  );
};

export default SettingsLayout;
