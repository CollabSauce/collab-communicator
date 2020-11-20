import { SvgDrawing } from '@svg-drawing/core';

import { Toolbar } from './Toolbar';

let setupWebPaintComplete = false;

let webPaintContainer = null;
let webPaintToolbar = null;
let webPaintCursorColor = 'black';
let webPaintCursorSize = 7;

let draw = null;
let intervalId = null;

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
    intervalId = turnOnDynamicWidthAndHeightOverlayerListener(webPaintContainer);
    document.body.appendChild(webPaintContainer);
    document.body.appendChild(webPaintToolbar);
  } else {
    draw.clear();
    draw.off();
    webPaintContainer.remove();
    webPaintToolbar.remove();
    turnOffWidthAndHeightOverlayerListener(intervalId);
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

const turnOnDynamicWidthAndHeightOverlayerListener = (webPaintContainer) => {
  const setWidthAndHeight = () => {
    webPaintContainer.style.height = `${getWebPageHeight()}px`;
    webPaintContainer.style.width = `${getWebPageWidth()}px`;
  };

  // kind of hacky .... periodically check the width/height of the page and update
  // the WebPaintContainer.
  setWidthAndHeight();
  return setInterval(setWidthAndHeight, 2000);
};

const turnOffWidthAndHeightOverlayerListener = (intervalId) => {
  clearInterval(intervalId);
};

// https://javascript.info/size-and-scroll-window#width-height-of-the-document
const getWebPageHeight = () => {
  return Math.max(
    document.body.scrollHeight, document.documentElement.scrollHeight,
    document.body.offsetHeight, document.documentElement.offsetHeight,
    document.body.clientHeight, document.documentElement.clientHeight
  );
};

const getWebPageWidth = () => {
  return Math.max(
    document.body.scrollWidth, document.documentElement.scrollWidth,
    document.body.offsetWidth, document.documentElement.offsetWidth,
    document.body.clientWidth, document.documentElement.clientWidth
  );
};
