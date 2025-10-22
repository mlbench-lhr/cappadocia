import React from "react";

export default function BlogDetailSkeleton() {
  return (
    <div className="w-full mx-auto space-y-8 animate-pulse">
      {/* Back button skeleton */}
      <div className="w-full flex justify-start items-center gap-2 pt-8">
        <div className="w-8 h-8 bg-gray-200 rounded"></div>
        <div className="h-7 w-32 bg-gray-200 rounded"></div>
      </div>

      <div className="w-full max-w-[800px] mx-auto pb-4">
        {/* Header section skeleton */}
        <section className="w-full mt-[30px] lg:mt-[50px] h-fit space-y-4">
          <div className="w-full h-fit flex flex-col justify-start items-start gap-2 md:gap-[24px]">
            {/* Title skeleton */}
            <div className="w-full space-y-3">
              <div className="h-8 md:h-10 bg-gray-200 rounded w-full"></div>
              <div className="h-8 md:h-10 bg-gray-200 rounded w-3/4"></div>
            </div>

            {/* Date skeleton */}
            <div className="h-4 md:h-5 bg-gray-200 rounded w-48"></div>
          </div>

          {/* Cover image skeleton */}
          <div className="w-full h-[250px] md:h-[465px] bg-gray-200 rounded-[12px]"></div>
        </section>

        {/* Content skeleton */}
        <div className="w-full py-6 md:py-[32px] flex flex-col justify-start items-start gap-6 md:gap-8">
          {/* Paragraph skeleton */}
          <div className="w-full space-y-3">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
          </div>

          {/* Heading skeleton */}
          <div className="h-7 bg-gray-200 rounded w-2/3"></div>

          {/* Paragraph skeleton */}
          <div className="w-full space-y-3">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-3/4"></div>
          </div>

          {/* Heading skeleton */}
          <div className="h-7 bg-gray-200 rounded w-1/2"></div>

          {/* Paragraph skeleton */}
          <div className="w-full space-y-3">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-5/6"></div>
          </div>

          {/* Quote box skeleton */}
          <div className="w-full p-8 bg-gray-100 rounded-[12px] border-l-[4px] border-gray-200">
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-4/5"></div>
            </div>
          </div>

          {/* Image skeleton */}
          <div className="w-full h-[250px] md:h-[465px] bg-gray-200 rounded-[12px]"></div>

          {/* More content skeletons */}
          <div className="h-7 bg-gray-200 rounded w-3/5"></div>

          <div className="w-full space-y-3">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3"></div>
          </div>

          <div className="h-7 bg-gray-200 rounded w-1/2"></div>

          <div className="w-full space-y-3">
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-full"></div>
            <div className="h-5 bg-gray-200 rounded w-4/5"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
