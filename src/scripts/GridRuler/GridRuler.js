import { HorizontalRuler } from './HorizontalRuler';
import { VerticalRuler } from './VerticalRuler';
import { TopCorner } from './TopCorner';

export const GridRuler = () => {
  const ID = 'CollabSauce-GridRuler';
  const main = document.createElement('div');
  main.setAttribute('id', ID);

  const makeGridlineVisible = (gridlineElement) => {
    main.appendChild(gridlineElement);
  }

  const horizontalRuler = HorizontalRuler({ makeGridlineVisible });
  const verticalRuler = VerticalRuler({ makeGridlineVisible });
  const topCorner = TopCorner();

  main.appendChild(horizontalRuler);
  main.appendChild(verticalRuler);
  main.appendChild(topCorner);

  document.body.appendChild(main);
};
