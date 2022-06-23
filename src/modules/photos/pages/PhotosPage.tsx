import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IPhotoState, setPhotos } from '../redux/photosReducer';
import { AppState } from '../../../redux/reducer';
import PhotoItem from '../components/PhotoItem';
import PhotoItemSkeleton from '../components/PhotoItemSkeleton';

interface Props {}

const PhotoPage = (props: Props) => {
  const photos: IPhotoState[] = useSelector((state: AppState) => state.photos);
  const dispatch = useDispatch();
  const [localPhotos, setLocalPhotos] = useState([...photos]);
  const [isButtonsDisable, setIsButtonsDisable] = useState({
    update: true,
    reset: true,
  });
  const [loading, setLoading] = useState(false);
  const loadingRef = useRef(loading);
  loadingRef.current = loading;
  const nextFetchRef = useRef({
    start: 1,
    step: 10,
  });

  useEffect(() => {
    setLocalPhotos([...photos]);
  }, [photos]);

  const getPhotos = useCallback(
    async (start: number, end: number) => {
      setLoading(true);
      const data = await (
        await fetch(`https://jsonplaceholder.typicode.com/photos?&_start=${start}&_end=${end}`)
      ).json();

      dispatch(setPhotos([...photos, ...data]));

      setLoading(false);
    },
    [dispatch, photos],
  );

  useEffect(() => {
    //Check if photos are loaded from redux-persist
    if (photos.length === 0) {
      getPhotos(nextFetchRef.current.start, (nextFetchRef.current.start += nextFetchRef.current.step));
    } else {
      nextFetchRef.current.start = photos.length + 1;
    }
  }, []);

  useEffect(() => {
    const fetchOnScroll = async () => {
      const scrollTop = window.scrollY;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      if (scrollTop + clientHeight >= scrollHeight) {
        if (!loadingRef.current) {
          getPhotos(nextFetchRef.current.start, (nextFetchRef.current.start += nextFetchRef.current.step));
        }
      }
    };

    window.addEventListener('scroll', fetchOnScroll);

    return () => {
      window.removeEventListener('scroll', fetchOnScroll);
    };
  }, [getPhotos]);

  const updatePhotos = () => {
    dispatch(setPhotos([...localPhotos]));
    setIsButtonsDisable({
      reset: true,
      update: true,
    });
  };

  const resetPhotos = () => {
    setLocalPhotos([...photos]);
    setIsButtonsDisable({
      reset: true,
      update: true,
    });
  };

  useEffect(() => {
    const enableButtonsIfPhotoUpdated = () => {
      if (JSON.stringify(photos) !== JSON.stringify(localPhotos)) {
        setIsButtonsDisable({
          reset: false,
          update: false,
        });
      } else {
        setIsButtonsDisable({
          reset: true,
          update: true,
        });
      }
    };
    enableButtonsIfPhotoUpdated();
  }, [localPhotos, photos]);

  const updatePhotoTitle = useCallback((id: number, title: string) => {
    setLocalPhotos((prevLocalPhotos) =>
      prevLocalPhotos.map((photo) => {
        if (photo.id === id) {
          return {
            ...photo,
            title,
          };
        }
        return photo;
      }),
    );
  }, []);

  return (
    <div className="page__container">
      <div className="buttons">
        <button type="button" className="btn btn-success" disabled={isButtonsDisable.update} onClick={updatePhotos}>
          Update
        </button>
        <button type="button" className="btn btn-danger" disabled={isButtonsDisable.reset} onClick={resetPhotos}>
          Reset
        </button>
      </div>
      <div className="photos">
        {localPhotos.length > 0 &&
          localPhotos.map((photo) => (
            <PhotoItem
              key={`${photo.id}_${photo.title}`}
              id={photo.id}
              albumId={photo.albumId}
              thumbnailUrl={photo.thumbnailUrl}
              title={photo.title}
              url={photo.url}
              updatePhotoTitle={updatePhotoTitle}
            />
          ))}
        {loading && (
          <>
            <div className="spinner-border mx-auto my-2" role="status"></div>
            <PhotoItemSkeleton />
          </>
        )}
      </div>
    </div>
  );
};

export default PhotoPage;
