import { Data } from './Data';
import { getPageDimension } from './Utils';

export const VerticalGrid = ({ onGridlineDragStop }) => {
  const outerDiv = document.createElement('div');
  const gridId = 'collabsauce-vertical-grid-' + Date.now();
  outerDiv.id = gridId;
  outerDiv.className = 'collabsauce-vertical-grid-outer';
  outerDiv.style.height = `${getPageDimension().height}px`;

  const innerDiv = document.createElement('div');
  innerDiv.className = 'collabsauce-vertical-grid-inner';

  outerDiv.appendChild(innerDiv);

  let gridlineMouseDown = true;
  const startDragging = (e) => {
    Data.dragging.emit('change', true, 'col-resize');

    if (e) { e.preventDefault(); }

    gridlineMouseDown = true;
    const docElem = document.documentElement;
    docElem.addEventListener('mousemove', moveTo);
    docElem.addEventListener('mouseup', stopDragging);
  };

  const stopDragging = () => {
    const docElem = document.documentElement;
    docElem.removeEventListener('mousemove', moveTo);
    docElem.removeEventListener('mouseup', stopDragging);

    Data.dragging.emit('change', false, 'col-resize');
    gridlineMouseDown = false;

    // notify parent
    onGridlineDragStop(innerDiv);
  };

  const moveTo = (e) => {
    if (!gridlineMouseDown) { return; }
    outerDiv.style.left = `${e.pageX}px`;
  };

  outerDiv.addEventListener('mousedown', startDragging);
  startDragging();

  outerDiv.style.left = '0px';

  return outerDiv;
};

