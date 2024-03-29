import { Data } from './Data';
import { getPageDimension } from './Utils';

export const HorizontalGrid = ({ onGridlineDragStop }) => {
  const outerDiv = document.createElement('div');
  const gridId = 'collabsauce-horizontal-grid-' + Date.now();
  outerDiv.id = gridId;
  outerDiv.className = 'collabsauce-horizontal-grid-outer';
  outerDiv.style.width = `${getPageDimension().width}px`;

  const innerDiv = document.createElement('div');
  innerDiv.className = 'collabsauce-horizontal-grid-inner';

  outerDiv.appendChild(innerDiv);

  let gridlineMouseDown = true;
  const startDragging = (e) => {
    Data.dragging.emit('change', true, 'row-resize');

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

    Data.dragging.emit('change', false, 'row-resize');
    gridlineMouseDown = false;

    // notify parent
    onGridlineDragStop(innerDiv);
  };

  const moveTo = (e) => {
    if (!gridlineMouseDown) { return; }
    outerDiv.style.top = `${e.pageY}px`;
  };

  outerDiv.addEventListener('mousedown', startDragging);
  startDragging();

  outerDiv.style.top = '0px';

  return outerDiv;
};

