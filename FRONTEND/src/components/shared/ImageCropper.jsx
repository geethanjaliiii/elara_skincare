

import React, { useRef, useState } from 'react';
import Cropper from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import imageCompression from 'browser-image-compression';
import { Button } from '../ui/button';

const ImageCropper = ({ imageSrc, onImageCropped }) => {
  const cropperRef = useRef(null);
 const[isCropped,setIsCropped]=useState(true)
  const handleCrop = () => {
    
    if (cropperRef.current) {
      cropperRef.current.cropper.getCroppedCanvas().toBlob(async (blob) => {
        try {
          // Compress the cropped image
          const compressedImage = await imageCompression(blob, {
            maxSizeMB: 1,
            maxWidthOrHeight: 500
          });
          // Create a preview URL for the compressed image
          const imageUrl = URL.createObjectURL(compressedImage);
          
          // Call callback function to pass cropped and compressed image
          onImageCropped(imageUrl, compressedImage);

          
        } catch (error) {
          console.error('Error compressing image:', error);
        }
      }, 'image/jpeg');
    }
  };

  return (
    
    <div style={{ marginBottom: '10px' }}>
      {/* Cropper Component */}
      {isCropped && (<>
        <Cropper
        src={imageSrc}
        style={{ height: 400, width: '100%' }}
        aspectRatio={1} // Example aspect ratio (1:1 square)
        guides={false}
        ref={cropperRef}
        viewMode={2}
        dragMode="move"
        autoCropArea={1}
        scalable={true}
        cropBoxResizable={true}
        cropBoxMovable={true}
      />
<br></br>
      {/* Button to trigger cropping */}
      <Button onClick={handleCrop}>Crop & Compress</Button>
      
      </>)}
      
    </div>
  );
};

export default ImageCropper;
