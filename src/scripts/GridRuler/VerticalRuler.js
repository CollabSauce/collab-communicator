import { EventEmitter } from 'events';

import { Data } from './Data';
import { VerticalRulerTick } from './VerticalRulerTick';
import { VerticalGrid } from './VerticalGrid';

export const VerticalRuler = ({ makeGridlineVisible }) => {
  let rulerMouseDown = false, rulerMouseEntered = false;

  // create the tick-marks
  const ticks = generateVerticalRulerTicks(1000);

  // create the div that holds the tick-marks (aka the Vertical Ruler)
  const div = document.createElement('div');
  div.className = 'collabsauce-tick-ruler collabsauce-vertical-tick-ruler';

  // if the user dragged the gridline to the left of the page, remove the gridline
  const onGridlineDragStop = (draggingElement) => {
    if (!rulerMouseEntered) { return; }
    draggingElement.remove();
  };

  // add event-listeners to Vertical Ruler
  div.addEventListener('mousedown', (e) => {
    e.preventDefault();
    rulerMouseDown = true;
  });
  div.addEventListener('mouseup', () => {
    rulerMouseDown = false;
  });
  div.addEventListener('mouseenter', () => {
    rulerMouseEntered = true;
  });
  div.addEventListener('mouseleave', (e) => {
    if (rulerMouseDown) {
      const verticalGrid = VerticalGrid({ onGridlineDragStop });
      makeGridlineVisible(verticalGrid);
    }
    rulerMouseEntered = false;
    rulerMouseDown = false;
  });

  // Append all the tick-marks to the Vertical Ruler.
  for (let tick of ticks) {
    div.appendChild(tick);
  }

  return div;
};

const generateVerticalRulerTicks = (max) => {
  // return a array of max-number VerticalRulerTick

  const ticks = [];
  const rulerThickness = 15; // THIS SHOULD MATCH WHAT IS IN gridRuler.scss `$ruler-thickness` variable.

  for (let i = 0; i < max; i++) {
    const top = i * 10;
    let left;
    if (i % 10 === 0) {
      left = 0; // if 10th tick
    } else if (i % 10 === 5) {
      left = Math.round(rulerThickness / 2); // if 5th tick
    } else {
      left = Math.round(rulerThickness * 3 / 4); // if normal tick
    }

    ticks.push(
      VerticalRulerTick({ left, top })
    );
  }

  return ticks;
};
