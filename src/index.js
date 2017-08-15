import View from './view';

export const HYDRATE_DUMMY = 'HYDRATE_DUMMY';

const hydrateDummy = store => next => {
  let hydrated = false;

  const hydrate = () => {
    hydrated = true;
    store.dispatch({ type: HYDRATE_DUMMY });
  };

  return (action) => !hydrated ? hydrate() : next(action);
};

export const HydrateDummyView = View;
export const buildHydrateEvent = (dummyData) => (state) => ({ ...state, ...dummyData });

export default hydrateDummy;
