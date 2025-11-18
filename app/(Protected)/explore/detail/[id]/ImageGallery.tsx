import React, { useState } from "react";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function ImageGallery() {
  const [open, setOpen] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);

  // Define your images array
  const images = [
    { src: "/userDashboard/img20.png", alt: "Image 1" },
    { src: "/userDashboard/img21.png", alt: "Image 2" },
    { src: "/userDashboard/img22.png", alt: "Image 3" },
    { src: "/userDashboard/img23.png", alt: "Image 4" },
  ];

  const handleImageClick = (index: any) => {
    setPhotoIndex(index);
    setOpen(true);
  };

  return (
    <div className="w-full">
      <div className="w-full grid grid-cols-10 h-fit lg:h-[360px] gap-2 lg:gap-3.5">
        {/* First Image */}
        <div
          className="col-span-5 lg:col-span-4 rounded-[14px] overflow-hidden h-[200px] lg:h-full cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleImageClick(0)}
        >
          <img
            src={images[0].src}
            alt={images[0].alt}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Second Image */}
        <div
          className="col-span-5 lg:col-span-2 rounded-[14px] overflow-hidden h-[200px] lg:h-full cursor-pointer hover:opacity-90 transition-opacity"
          onClick={() => handleImageClick(1)}
        >
          <img
            src={images[1].src}
            alt={images[1].alt}
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Third and Fourth Images Container */}
        <div className="col-span-10 lg:col-span-4 grid lg:grid-cols-none grid-cols-2 grid-rows-none lg:grid-rows-2 rounded-[14px] overflow-hidden h-[200px] lg:h-full gap-x-2 lg:gap-x-0 gap-y-0 lg:gap-y-3.5">
          <div
            className="row-span-2 lg:row-span-1 rounded-[14px] overflow-hidden h-[200px] lg:h-full col-span-1 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(2)}
          >
            <img
              src={images[2].src}
              alt={images[2].alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
          <div
            className="row-span-2 lg:row-span-1 rounded-[14px] overflow-hidden h-[200px] lg:h-full col-span-1 cursor-pointer hover:opacity-90 transition-opacity"
            onClick={() => handleImageClick(3)}
          >
            <img
              src={images[3].src}
              alt={images[3].alt}
              className="w-full h-full object-cover object-center"
            />
          </div>
        </div>
      </div>

      {/* Lightbox Component */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        index={photoIndex}
        slides={images}
        // Optional: Add plugins
        // plugins={[Zoom]}
        // Optional: Customize styling
        styles={{
          container: { backgroundColor: "rgba(0, 0, 0, .9)" },
        }}
        // Optional: Add animation settings
        animation={{ fade: 250 }}
        controller={{ closeOnBackdropClick: true }}
      />
    </div>
  );
}
