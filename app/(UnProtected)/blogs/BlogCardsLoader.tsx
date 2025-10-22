import React from 'react';

const BlogCardSkeleton = () => {
  return (
    <div className="col-span-1 relative bg-white p-4 rounded-[12px] flex flex-col justify-start items-start gap-5 border-2 border-[#E8E8EA] animate-pulse">
      {/* Image skeleton */}
      <div className="w-full h-[240px] rounded-[16px] bg-gray-200"></div>
      
      {/* Title skeleton */}
      <div className="w-full space-y-2">
        <div className="h-7 bg-gray-200 rounded w-full"></div>
        <div className="h-7 bg-gray-200 rounded w-2/3"></div>
      </div>
      
      {/* Footer section skeleton */}
      <div className="w-full flex justify-between flex-wrap gap-[12px] items-center">
        {/* Avatar and name skeleton */}
        <div className="w-fit rounded-[8px] flex justify-center items-center gap-3">
          <div className="w-[36px] h-[36px] rounded-full bg-gray-200"></div>
          <div className="h-5 w-24 bg-gray-200 rounded"></div>
        </div>
        
        {/* Date skeleton */}
        <div className="h-5 w-40 bg-gray-200 rounded"></div>
      </div>
    </div>
  );
};

// Grid of skeleton cards for loading state
export const BlogCardsGridSkeleton = ({ count = 6 }: { count?: number }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <BlogCardSkeleton key={index} />
      ))}
    </>
  );
};

export default BlogCardSkeleton;