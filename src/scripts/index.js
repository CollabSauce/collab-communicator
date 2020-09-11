import '../styles/index.scss';
import { ready } from './docready';
import { getDomPath } from './getDomPath';
import { createBanner } from './createBanner';

if (process.env.NODE_ENV === 'development') {
  require('../index.html');
}

const IS_DEVELOPMENT = process.env.NODE_ENV === 'development';
const iframeSrc = IS_DEVELOPMENT ? 'http://localhost:3001' : 'https://wizardly-volhard-e87a31.netlify.app';

ready.docReady(() => {
  // load styles and scripts
  const iframe = document.createElement('iframe');
  iframe.src = iframeSrc;
  iframe.className = 'collab-sauce collab-sauce-hidden collab-sauce-frame-right collab-sauce-frame-top collab-sauce-frame-full';
  iframe.id = 'collab-sauce-iframe';
  iframe.onload = () => { resetAll(); };
  document.body.appendChild(iframe);

  if (IS_DEVELOPMENT) {
    // manually add a <script> to the header that will mimic production.
    const script = document.createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://collabsauce.com/js/kickoff.js?projectKey=UJ2UhsD9NOeOruyD45ptxLXKcSgQHObi`;
    document.head.appendChild(script);
  }

  let shadowDivHolder;
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
    if (shadowDivHolder.isEqualNode(e.target) || isParent(e.target, shadowDivHolder)) {
      return;
    }

    e.preventDefault();
    document.getElementById('collab-sauce-iframe').classList.remove('collab-sauce-hidden');
    document.body.removeChild(shadowDivHolder);
    document.body.removeEventListener('mouseover', onMouseOver);
    currentMouseOverTarget.removeEventListener('click', onClick);
    messageRouting.showFullToolbar();
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
    if (shadowDivHolder.isEqualNode(e.target) || isParent(e.target, shadowDivHolder)) {
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
    try {
      const message = JSON.parse(e.data);
      messageRouting[message.type] && messageRouting[message.type](message);
    } catch (err) {
      return;
    }
  };

  const messageRouting = {
    setStyleAttribute: (message) => {
      const styleAttrsToSet = message.styleAttrsToSet;
      Object.keys(styleAttrsToSet).forEach((styleKey) => {
        currentClickTarget.style.setProperty(styleKey, styleAttrsToSet[styleKey], 'important');
      });
    },
    hideToolbar: () => {
      document.getElementById('collab-sauce-iframe').classList.add('collab-sauce-hidden');
      document.getElementById('collab-sauce-sauceButton').classList.remove('collab-sauce-hidden');
      document.getElementById('collab-sauce-iframe').classList.remove('show-full-toolbar');
      removeElementSelections();
    },
    hideFullToolbar: () => {
      document.getElementById('collab-sauce-iframe').classList.remove('show-full-toolbar');
      removeElementSelections();
    },
    showFullToolbar: () => {
      document.getElementById('collab-sauce-iframe').classList.add('show-full-toolbar');
    },
    enterSelectionMode: () => {
      document.getElementById('collab-sauce-iframe').classList.add('collab-sauce-hidden');
      document.body.appendChild(shadowDivHolder);
      document.body.addEventListener('mouseover', onMouseOver);
      document.body.classList.add('CollabSauce__crosshair__');
    },
    newAlignment: (message) => {
      const iframe = document.getElementById('collab-sauce-iframe');
      if (message.alignmentType === 'Right') {
        iframe.classList.add('collab-sauce-frame-right');
        iframe.classList.remove('collab-sauce-frame-left');
      } else if (message.alignmentType === 'Left') {
        iframe.classList.add('collab-sauce-frame-left');
        iframe.classList.remove('collab-sauce-frame-right');
      } else if (message.alignmentType === 'Top') {
        iframe.classList.add('collab-sauce-frame-top');
        iframe.classList.remove('collab-sauce-frame-bottom');
      } else if (message.alignmentType === 'Bottom') {
        iframe.classList.add('collab-sauce-frame-bottom');
        iframe.classList.remove('collab-sauce-frame-top');
      }
    },
    newSizing: (message) => {
      const iframe = document.getElementById('collab-sauce-iframe');
      if (message.sizeType === 'Full') {
        iframe.classList.add('collab-sauce-frame-full');
        iframe.classList.remove('collab-sauce-frame-half', 'collab-sauce-frame-quarter');
      } else if (message.sizeType === 'Half') {
        iframe.classList.add('collab-sauce-frame-half');
        iframe.classList.remove('collab-sauce-frame-full', 'collab-sauce-frame-quarter');
      } else if (message.sizeType === 'Quarter') {
        iframe.classList.add('collab-sauce-frame-quarter');
        iframe.classList.remove('collab-sauce-frame-half', 'collab-sauce-frame-full');
      }
    }
  };

  const exitSelectionMode = () => {
    try {
      // putting this in try block because this will fail when ths method is called on initial load.
      document.body.removeChild(shadowDivHolder);
    } catch (e) {

    }
    document.getElementById('collab-sauce-iframe').classList.remove('collab-sauce-hidden');
    removeElementSelections();
  };

  // create the "edit" banner. Use a shadow-dom so our styles are consistent on any webpage
  shadowDivHolder = createBanner(exitSelectionMode);

  const removeElementSelections = () => {
    document.body.removeEventListener('mouseover', onMouseOver);
    document.body.classList.remove('CollabSauce__crosshair__');
    if (currentMouseOverTarget) {
      currentMouseOverTarget.classList.remove('CollabSauce__outline__');
      currentMouseOverTarget.removeEventListener('click', onClick);
    }
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

  const resetAll = () => {
    // called when the iframe loads (also in development when it refreshes)
    exitSelectionMode();
    messageRouting.hideToolbar();

    // tell the iframe to set the parent origin
    const setParentMessage = { type: 'setParentOrigin' };
    document.getElementById('collab-sauce-iframe').contentWindow.postMessage(JSON.stringify(setParentMessage), iframeSrc);

    // tell the iframe the current projectKey
    const collabScriptSrc = 'https://collabsauce.com/js/kickoff.js';
    const sources = [];
    document.getElementsByTagName('script').forEach(script => sources.push(script.src));
    const kickOffSrc = sources.find(src => src.indexOf(collabScriptSrc) >= 0);
    const projectKey = kickOffSrc.slice(kickOffSrc.search('projectKey=') + 'projectKey='.length);
    const projectKeyMessage = { type: 'projectKey', projectKey };
    document.getElementById('collab-sauce-iframe').contentWindow.postMessage(JSON.stringify(projectKeyMessage), iframeSrc);
  };

  // listen on all messages from iframe
  window.addEventListener('message', receiveMessage);

  // create the sauceButton
  const sauceButton = document.createElement('div');
  sauceButton.id = 'collab-sauce-sauceButton';
  sauceButton.className = 'collab-sauce-sauceButton';
  document.body.appendChild(sauceButton);

  // listen on click of the button
  sauceButton.addEventListener('click', () => {
    sauceButton.classList.add('collab-sauce-hidden');
    iframe.classList.remove('collab-sauce-hidden');
  });
});
