import { HorizontalRuler } from './HorizontalRuler';
import { VerticalRuler } from './VerticalRuler';
import { TopCorner } from './TopCorner';
import { Overlay } from './Overlay';

let setupGridlinesComplete = false;
let mainGridlineContainer = null;

export const GridRuler = (showGridlines) => {
  if (!setupGridlinesComplete) {
    mainGridlineContainer = setupGridlines();
    setupGridlinesComplete = true;
  }

  if (showGridlines) {
    document.body.appendChild(mainGridlineContainer);
  } else {
    mainGridlineContainer.remove();
  }

};

const setupGridlines = () => {
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

  return main;
};
