export const HorizontalRulerTick = ({ left, top }) => {
  const div = document.createElement('div');
  div.className = 'collabsauce-ruler-tick-mark collabsauce-horizontal-tick-mark';
  div.style.left = `${left}px`;
  div.style.top = `${top}px`;
  return div;
};
