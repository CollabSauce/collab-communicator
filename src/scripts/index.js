import '../styles/index.scss';
import { ready } from './docready';
import { getDomPath } from './getDomPath';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

// const iframeSrc = true ? 'http://localhost:3000' : 'https://wizardly-volhard-e87a31.netlify.app';
const iframeSrc = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://wizardly-volhard-e87a31.netlify.app';

ready.docReady(() => {
  // load styles and scripts
  const iframe = document.createElement('iframe');
  iframe.src = iframeSrc;
  iframe.class = 'collab-sauce';
  iframe.id = 'collab-sauce-iframe';
  document.body.appendChild(iframe);

  let currentMouseOverTarget;
  let currentClickTarget;

  const isParent = (obj, parentObj) => {
    while (obj !== undefined && obj !== null && obj.tagName.toUpperCase() !== 'BODY') {
      if (obj === parentObj) return true;
      obj = obj.parentNode;
    }
    return false;
  };

  const onClick = (e) => {
    const toolbar = document.getElementById('collab-sauce-iframe');
    if (toolbar.isEqualNode(e.target) || isParent(e.target, toolbar)) {
      return;
    }

    e.preventDefault();
    currentClickTarget = e.target;

    // dispatch event to iframe
    const targetStyling = getComputedStyle(currentClickTarget);
    const updatedWidthObj = fixBorderWidth(targetStyling, currentClickTarget);
    const targetStyle = { ...targetStyling, ...updatedWidthObj };
    const targetDomPath = getDomPath(currentClickTarget);
    const targetCssText = currentClickTarget.style.cssTest;
    const targetId = currentClickTarget.id;
    const message = { type: 'newClickedTarget', targetStyle, targetDomPath, targetCssText, targetId };
    document.getElementById('collab-sauce-iframe').contentWindow.postMessage(JSON.stringify(message), iframeSrc);
  };

  const onMouseOver = (e) => {
    const toolbar = document.getElementById('collab-sauce-iframe');
    if (toolbar.isEqualNode(e.target) || isParent(e.target, toolbar)) {
      return;
    }

    if (currentMouseOverTarget) {
      currentMouseOverTarget.classList.remove('CollabSauce__outline__');
      currentMouseOverTarget.removeEventListener('click', onClick);
    }
    currentMouseOverTarget = e.target;
    currentMouseOverTarget.classList.add('CollabSauce__outline__');
    currentMouseOverTarget.addEventListener('click', onClick);
  };

  const receiveMessage = (e) => {
    let styleAttrsToSet;
    try {
      const message = JSON.parse(e.data);
      if (message.type !== 'setStyleAttribute') { return; }
      styleAttrsToSet = message.styleAttrsToSet;
    } catch (err) {
      return;
    }
    Object.keys(styleAttrsToSet).forEach((styleKey) => {
      currentClickTarget.style.setProperty(styleKey, styleAttrsToSet[styleKey], 'important');
    });
  };

  const fixBorderWidth = (targetStyle, currentClickTarget) => {
    // for some reason, if border-width has a value, but is set as `none`, it shows up as 0px in targetStyle.
    // However, currentClickTarget.style.borderWidth does have the correct value, so pull from that.
    const widthObj = {};
    if (targetStyle.borderWidth !== currentClickTarget.style.borderWidth) {
      widthObj.borderWidth = currentClickTarget.style.borderWidth;
      widthObj['border-width'] = currentClickTarget.style.borderWidth;
    }
    if (targetStyle.borderTopWidth !== currentClickTarget.style.borderTopWidth) {
      widthObj.borderTopWidth = currentClickTarget.style.borderTopWidth;
      widthObj['border-top-width'] = currentClickTarget.style.borderTopWidth;
    }
    if (targetStyle.borderRightWidth !== currentClickTarget.style.borderRightWidth) {
      widthObj.borderRightWidth = currentClickTarget.style.borderRightWidth;
      widthObj['border-right-width'] = currentClickTarget.style.borderRightWidth;
    }
    if (targetStyle.borderBottomWidth !== currentClickTarget.style.borderBottomWidth) {
      widthObj.borderBottomWidth = currentClickTarget.style.borderBottomWidth;
      widthObj['border-bottom-width'] = currentClickTarget.style.borderBottomWidth;
    }
    if (targetStyle.borderLeftWidth !== currentClickTarget.style.borderLeftWidth) {
      widthObj.borderLeftWidth = currentClickTarget.style.borderLeftWidth;
      widthObj['border-left-width'] = currentClickTarget.style.borderLeftWidth;
    }
    return widthObj;
  };

  document.body.addEventListener('mouseover', onMouseOver);
  document.body.classList.add('CollabSauce__crosshair__');

  window.addEventListener('message', receiveMessage);
});
