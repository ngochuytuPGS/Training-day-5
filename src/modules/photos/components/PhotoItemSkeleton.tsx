import React from 'react';

interface Props {}

const PhotoItemSkeleton = (props: Props) => {
  return (
    <div className="photo-skeleton">
      <div className="photo-skeleton__image"></div>
      <div className="photo-skeleton__details">
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default PhotoItemSkeleton;
