import scroll from 'scroll';
import scrollDoc from '../vendors/scroll-doc';

export const scrollTop = (y, isAnimated = false) => {
  if (isAnimated) {
    scroll.top(scrollDoc(), y, { duration: isAnimated ? 350 : 1 });

    return;
  }

  window.scroll(0, y);
};
