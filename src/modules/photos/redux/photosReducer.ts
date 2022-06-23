import { ActionType, createCustomAction, getType } from 'typesafe-actions';

export interface IPhotoState {
  albumId: number;
  id: number;
  title: string;
  url: string;
  thumbnailUrl: string;
}

export const setPhotos = createCustomAction('setPhotos', (data: IPhotoState[]) => ({
  data
}));

export const actions = { setPhotos };

type Action = ActionType<typeof actions>;

export default function reducer(state: IPhotoState[] = [], action: Action) {
  switch (action.type) {
    case getType(setPhotos):
      return action.data;
    default:
      return state;
  }
}
