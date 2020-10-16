import { HorizontalRuler } from './HorizontalRuler';
import { VerticalRuler } from './VerticalRuler';
import { TopCorner } from './TopCorner';
import { Overlay } from './Overlay';

export const GridRuler = () => {
  const ID = 'CollabSauce-GridRuler';
  const main = document.createElement('div');
  main.setAttribute('id', ID);

  const makeGridlineVisible = (gridlineElement) => {
    main.appendChild(gridlineElement);
  };

  const horizontalRuler = HorizontalRuler({ makeGridlineVisible });
  const verticalRuler = VerticalRuler({ makeGridlineVisible });
  const topCorner = TopCorner();
  const overlay = Overlay();

  main.appendChild(horizontalRuler);
  main.appendChild(verticalRuler);
  main.appendChild(topCorner);
  main.appendChild(overlay);

  document.body.appendChild(main);
};
