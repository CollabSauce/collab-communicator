import { SvgDrawing } from '@svg-drawing/core';

import { Toolbar } from './Toolbar';

let setupWebPaintComplete = false;

let webPaintContainer = null;
let webPaintToolbar = null;
let webPaintCursorColor = 'black';
let webPaintCursorSize = 7;

let draw = null;

export const WebPaint = (showWebPaint) => {
  if (!setupWebPaintComplete) {
    webPaintContainer = setupWebPaint();
    webPaintToolbar = Toolbar({ setDrawColor, setDrawSize, undoDrawAction });
    draw = new SvgDrawing(webPaintContainer);
    setupWebPaintComplete = true;

    // set defaults
    draw.penColor = webPaintCursorColor;
    draw.penWidth = webPaintCursorSize;
  }

  if (showWebPaint) {
    draw.on();
    document.body.appendChild(webPaintContainer);
    document.body.appendChild(webPaintToolbar);
  } else {
    draw.clear();
    draw.off();
    webPaintContainer.remove();
    webPaintToolbar.remove();
  }

};

const setupWebPaint = () => {
  const ID = 'CollabSauce-WebPaint';
  const main = document.createElement('div');
  main.setAttribute('id', ID);
  main.className = 'collabsauce-web-paint';
  main.classList.add('cursor-black'); // black cursor by default
  main.classList.add('cursor-15'); // 15px X 15px cursor by default

  return main;
};


const setDrawColor = (color) => {
  webPaintContainer.classList.remove(`cursor-${webPaintCursorColor}`);

  draw.penColor = color;
  webPaintCursorColor = color;
  webPaintContainer.classList.add(`cursor-${color}`);
};

const setDrawSize = (size) => {
  webPaintContainer.classList.remove(`cursor-${webPaintCursorSize}`);

  draw.penWidth = cursorSizeMap[size];
  webPaintCursorSize = size;
  webPaintContainer.classList.add(`cursor-${size}`);
};

const undoDrawAction = () => {
  draw.undo();
};

const cursorSizeMap = {
  '15': 7,
  '20': 9,
  '25': 11,
  '30': 13,
  '35': 15
};
