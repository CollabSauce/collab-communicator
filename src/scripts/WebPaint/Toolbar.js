import config from '../config';

const ToolbarWidth = 300; // THIS NEEDS TO MATCH WHAT'S IN webPaint.scss
const IFrameWidth = 340; // THIS NEEDS TO MATCH WHAT'S IN index.scss

export const Toolbar = ({ setDrawColor, setDrawSize, undoDrawAction }) => {
  const toolbarDiv = document.createElement('div');
  toolbarDiv.className = 'collabsauce-web-paint-toolbar';
  toolbarDiv.style.left = `${((window.innerWidth - IFrameWidth) / 2) - (ToolbarWidth / 2)}px`;

  // remove clear button. TODO: add in later?
  // <img src="${config.currentHost}/public/assets/clear.png" class="collabsauce-web-paint-clear" />

  toolbarDiv.innerHTML = `
    <div class="collabsauce-web-paint-toolbar-icons-container">
      <div class="collabsauce-web-paint-toolbar-mover-container">
        ${moverSvg}
      </div>
      <div class="collabsauce-web-paint-toolbar-undo-clear-container">
        <img src="${config.currentHost}/public/assets/undo.png" class="collabsauce-web-paint-undo" />
      </div>
    </div>
    <div class="collabsauce-web-paint-toolbar-buttons-container">
      <div style="background-color: black;" class="collabsauce-webpaint-button-color selected"></div>
      <div style="background-color: white;" class="collabsauce-webpaint-button-color"></div>
      <div style="background-color: red;" class="collabsauce-webpaint-button-color"></div>
      <div style="background-color: green;" class="collabsauce-webpaint-button-color"></div>
      <div style="background-color: blue;" class="collabsauce-webpaint-button-color"></div>
    </div>
    <div class="collabsauce-web-paint-toolbar-buttons-container collabsauce-web-paint-size-container">
      <div class="collabsauce-web-paint-button-size-container">
        <div style="background-color: black; width: 15px; height: 15px;" class="collabsauce-webpaint-button-size selected"></div>
      </div>
      <div class="collabsauce-web-paint-button-size-container">
        <div style="background-color: black; width: 20px; height: 20px;" class="collabsauce-webpaint-button-size"></div>
      </div>
      <div class="collabsauce-web-paint-button-size-container">
        <div style="background-color: black; width: 25px; height: 25px;" class="collabsauce-webpaint-button-size"></div>
      </div>
      <div class="collabsauce-web-paint-button-size-container">
        <div style="background-color: black; width: 30px; height: 30px;" class="collabsauce-webpaint-button-size"></div>
      </div>
      <div class="collabsauce-web-paint-button-size-container">
        <div style="background-color: black; width: 35px; height: 35px;" class="collabsauce-webpaint-button-size"></div>
      </div>
    </div>
  `;

  // On click of color button, change the paint and cursor color
  toolbarDiv.querySelector('.collabsauce-web-paint-toolbar-buttons-container').addEventListener('click', (ev) => {
    if (ev.target.className === 'collabsauce-webpaint-button-color') {
      const newColor = ev.target.style.backgroundColor;
      setDrawColor(newColor);
      const currentSelected = document.querySelector('.collabsauce-webpaint-button-color.selected');
      if (currentSelected && currentSelected !== ev.target) {
        currentSelected.classList.remove('selected');
      }
      ev.target.classList.add('selected');

      // now in the toolbar, change the color of the webpaint-button-size buttons
      document.querySelectorAll('.collabsauce-webpaint-button-size').forEach(el => {
        el.style.backgroundColor = newColor;
      });
    }
  });

  // On click of size button, change the paint and cursor size
  toolbarDiv.querySelector('.collabsauce-web-paint-size-container').addEventListener('click', (ev) => {
    if (ev.target.className === 'collabsauce-webpaint-button-size') {
      const newSize = ev.target.style.width.slice(0,-2); // remove the `px` at the end
      setDrawSize(newSize);
      const currentSelected = document.querySelector('.collabsauce-webpaint-button-size.selected');
      if (currentSelected && currentSelected !== ev.target) {
        currentSelected.classList.remove('selected');
      }
      ev.target.classList.add('selected');
    }
  });

  // On click of undo, undo the draw
  toolbarDiv.querySelector('.collabsauce-web-paint-undo').addEventListener('click', (ev) => {
    undoDrawAction();
  });

  // Make the DIV element draggable:
  const moverElement = toolbarDiv.querySelector('.collabsauce-web-paint-toolbar-mover-container');
  makeItDraggable(toolbarDiv, moverElement);

  return toolbarDiv;
};


// https://www.w3schools.com/howto/howto_js_draggable.asp
function makeItDraggable(toolbarDiv, moverElement) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  moverElement.onmousedown = dragMouseDown;

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    toolbarDiv.style.left = (toolbarDiv.offsetLeft - pos1) + 'px';
    const currentBottom = window.innerHeight - (toolbarDiv.offsetTop + toolbarDiv.offsetHeight);
    toolbarDiv.style.bottom = (currentBottom + pos2) + 'px';
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

const moverSvg = `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 87 58">
    <g transform="translate(7376 3804)">
      <circle cx="12" cy="12" r="12" transform="translate(-7376 -3804)"></circle>
      <ellipse cx="11.5" cy="12" rx="11.5" ry="12" transform="translate(-7312 -3804)"></ellipse>
      <circle cx="12" cy="12" r="12" transform="translate(-7344 -3804)"></circle>
      <circle cx="12" cy="12" r="12" transform="translate(-7376 -3770)"></circle>
      <ellipse cx="11.5" cy="12" rx="11.5" ry="12" transform="translate(-7312 -3770)"></ellipse>
      <circle cx="12" cy="12" r="12" transform="translate(-7344 -3770)"></circle>
    </g>
  </svg>
`;
