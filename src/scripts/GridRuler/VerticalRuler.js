import { VerticalRulerTick } from './VerticalRulerTick';

export const VerticalRuler = () => {
  const ticks = generateVerticalRulerTicks(1000);

  const div = document.createElement('div');
  div.className = 'collabsauce-tick-ruler collabsauce-vertical-tick-ruler';

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
