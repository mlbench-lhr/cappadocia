import React from 'react';

const AdminBlogDetailSkeleton = () => {
  return (
    <div className="flex flex-col gap-[16px] justify-start items-start w-full animate-pulse">
      {/* Header section */}
      <div className="w-full flex justify-between gap-[24px] items-center mb-[16px] flex-wrap">
        {/* Left side - Back button and title */}
        <div className="flex justify-start gap-1 md:gap-[24px] items-center">
          <div className="pl-2">
            <div className="w-8 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="h-9 w-48 bg-gray-200 rounded"></div>
        </div>
        
        {/* Right side - Action buttons */}
        <div className="flex justify-end gap-[10px] items-center">
          <div className="h-10 w-24 bg-gray-200 rounded"></div>
          <div className="h-10 w-32 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Cover image and title section */}
      <div className="py-[24px] px-[16px] flex justify-start flex-col md:flex-row items-center gap-4 w-full bg-[#F0F1F3] rounded">
        {/* Image skeleton */}
        <div className="h-[200px] md:h-[150px] w-full md:w-[200px] bg-gray-200 rounded-2xl"></div>
        
        {/* Title and metadata skeleton */}
        <div className="px-0 md:px-[16px] flex flex-col justify-start items-start w-full gap-3">
          {/* "Title" label */}
          <div className="h-8 w-20 bg-gray-200 rounded"></div>
          
          {/* Actual title (2 lines) */}
          <div className="w-full space-y-2">
            <div className="h-7 bg-gray-200 rounded w-full"></div>
            <div className="h-7 bg-gray-200 rounded w-3/4"></div>
          </div>
          
          {/* Published date */}
          <div className="h-6 w-56 bg-gray-200 rounded"></div>
        </div>
      </div>

      {/* Content section */}
      <div className="py-[24px] px-[16px] flex flex-col gap-[16px] justify-start items-start w-full bg-[#F0F1F3] rounded">
        {/* Multiple paragraph skeletons */}
        <div className="w-full space-y-4">
          {/* First paragraph */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Heading skeleton */}
          <div className="h-7 bg-gray-200 rounded w-2/3 mt-6"></div>

          {/* Second paragraph */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Heading skeleton */}
          <div className="h-7 bg-gray-200 rounded w-1/2 mt-6"></div>

          {/* Third paragraph */}
          <div className="space-y-2">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Additional content blocks */}
          <div className="space-y-2 mt-4">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBlogDetailSkeleton;