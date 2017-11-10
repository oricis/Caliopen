export const addEventHandler = (type, eventListener, ref = window) => {
  ref.addEventListener(type, eventListener, false);

  return () => {
    ref.removeEventListener(type, eventListener);
  };
};
