// XXX: should be named getDropdownStyle
// XXX: refactor without the `window` coupling to make it testable
export const getOffset = (alignRight, dropdownPosition, control, dropdown) => {
  const controlRect = control.length
    ? control[0].getBoundingClientRect()
    : control.getBoundingClientRect();

  const dropdownRect = dropdown.length
    ? dropdown[0].getBoundingClientRect()
    : dropdown.getBoundingClientRect();

  const winY = window.pageYOffset;
  const winX = window.pageXOffset;
  const winWidth = window.innerWidth;
  const winHeight = window.innerHeight;

  const alignRightOffset = controlRect.width - dropdownRect.width;
  const initTop = (controlRect.top + winY) - (dropdownRect.top + winY);
  const initLeft = (controlRect.left + winX) - (dropdownRect.left + winX);

  const isAlignRight = alignRight && (initLeft + alignRightOffset >= 0);
  const isTouchingRight = (initLeft + controlRect.width + dropdownRect.width) >= (winWidth + winX);
  const offsetX = isAlignRight || isTouchingRight ? (initLeft + alignRightOffset) : initLeft;
  const offsetY = dropdownPosition === 'top' ? (initTop - dropdownRect.height) : (initTop + controlRect.height);

  let position = 'absolute';
  let height;
  let width;
  let top = offsetY;
  let left = offsetX;

  if (dropdownRect.height > winHeight) {
    position = 'fixed';
    height = winHeight - 42;
    top = 42;
  }

  if (dropdownRect.width > winWidth) {
    left = 0;
    width = '100%';
  }

  const offset = {
    left,
    top,
    position,
    height,
    width,
  };

  return offset;
};
