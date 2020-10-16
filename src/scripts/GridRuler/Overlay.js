import { Data } from './Data';

export const Overlay = () => {
  const div = document.createElement('div');
  div.className = 'collabsauce-gridruler-overlay';
  div.style.display = 'none';

  const onDragging = (isDragging, cursorType) => {
    div.style.display = isDragging ? '' : 'none';
    div.style.cursor = cursorType;
  };

  Data.dragging.on('change', onDragging);

  return div;
};
