import { EventEmitter } from 'events';

import { Data } from './Data';
import { HorizontalRulerTick } from './HorizontalRulerTick';
import { HorizontalGrid } from './HorizontalGrid';

export const HorizontalRuler = ({ makeGridlineVisible }) => {
  let rulerMouseDown = false, rulerMouseEntered = false;

  // create the tick-marks
  const ticks = generateHorizontalRulerTicks(1000);

  // create the div that holds the tick-marks (aka the Horizontal Ruler)
  const div = document.createElement('div');
  div.className = 'collabsauce-tick-ruler collabsauce-horizontal-tick-ruler';

  // if the user dragged the gridline to the top of the page, remove the gridline
  const onGridlineDragStop = (draggingElement) => {
    if (!rulerMouseEntered) { return; }
    draggingElement.remove();
  };

  // add event-listeners to Horizontal Ruler
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
      const horizontalGrid = HorizontalGrid({ onGridlineDragStop });
      makeGridlineVisible(horizontalGrid);
    }
    rulerMouseEntered = false;
    rulerMouseDown = false;
  });

  // Append all the tick-marks to the Horizontal Ruler.
  for (let tick of ticks) {
    div.appendChild(tick);
  }

  return div;
};

const generateHorizontalRulerTicks = (max) => {
  // return a array of max-number HorizontalRulerTick

  const ticks = [];
  const rulerThickness = 15; // THIS SHOULD MATCH WHAT IS IN gridRuler.scss `$ruler-thickness` variable.

  for (let i = 0; i < max; i++) {
    const left = i * 10;
    let top;
    if (i % 10 === 0) {
      top = 0; // if 10th tick
    } else if (i % 10 === 5) {
      top = Math.round(rulerThickness / 2); // if 5th tick
    } else {
      top = Math.round(rulerThickness * 3 / 4); // if normal tick
    }

    ticks.push(
      HorizontalRulerTick({ left, top })
    );
  }

  return ticks;
};
