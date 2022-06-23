import React, { useEffect, useRef, useState } from 'react';
import { IPhotoState } from '../redux/photosReducer';

interface Props extends IPhotoState {
  updatePhotoTitle: any;
}

const PhotoItem = ({ albumId, id, thumbnailUrl, title, url, updatePhotoTitle }: Props) => {
  const [focus, setFocus] = useState(false);
  const [newTitle, setNewTitle] = useState(title);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [focus]);

  return (
    <div className={`photo ${id % 2 == 0 ? 'photo--grey' : 'photo--white'}`}>
      <img src={thumbnailUrl} />
      <div className="photo__details">
        {focus ? (
          <input
            type="text"
            value={newTitle}
            className="photo__input"
            onChange={(e) => setNewTitle(e.target.value)}
            ref={inputRef}
            onBlur={() => {
              setFocus(false);
              updatePhotoTitle(id, newTitle);
            }}
          />
        ) : (
          <label onClick={() => setFocus(true)}>{newTitle}</label>
        )}

        <div>{Date.now()}</div>
      </div>
    </div>
  );
};

export default React.memo(PhotoItem);
