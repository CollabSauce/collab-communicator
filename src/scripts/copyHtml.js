import $ from 'jquery';

export const copyHtml = () => {
  let docType = '';
  let node = document.doctype;
  try {
    setCustomStyles();
    setCustomImgs();
  } catch (err) {
    // do nothing
  }
  if (node) {
    docType = `<!DOCTYPE ${node.name}>`;
  }
  $('body *').each(function() {
    const element = $(this);
    const tagName = element.prop('tagName').toLowerCase();
    const scrollLeft = element.scrollLeft();
    const scrollTop = element.scrollTop();
    if (scrollLeft > 0) {
      element.attr('data-collab-left', scrollLeft);
    }
    if (scrollTop > 0) {
      element.attr('data-collab-top', scrollTop);
    }
    const inputTypes = ['input', 'select', 'textarea'];
    if (inputTypes.indexOf(tagName) > -1) {
      element.attr('data-collab-value', element.val());
      if ((element.prop('type') === 'checkbox' || element.prop('type') === 'radio') && element.prop('checked') === true) {
        element.attr('data-collab-checked', 'true');
      }
    }
    const heightElements = ['video', 'picture', 'select', 'svg'];
    if (heightElements.indexOf(tagName) > -1) {
      if (element.css('box-sizing') === 'border-box') {
        element.attr('data-collab-manual-height', element.outerHeight());
      } else {
        element.attr("data-collab-manual-height", element.height());
      }
    } else if (tagName === 'base') {
      element.attr('href', element.get(0).href);
    }
    // TODO: Handle Iframe??/
  });
  if ($(document).scrollTop() > 0) {
    $('body').attr('data-collab-top', $(document).scrollTop());
  }
  if ($(document).scrollLeft() > 0) {
    $('body').attr('data-collab-left', $(document).scrollLeft());
  }
  let docHtml = `${docType}\r\n ${document.documentElement.outerHTML}`;
  $('[data-collab-left]').removeAttr('data-collab-left');
  $('[data-collab-top]').removeAttr('data-collab-top');
  $('[data-collab-manual-height]').removeAttr('data-collab-manual-height');
  $('[data-collab-checked]').removeAttr('data-collab-checked');
  $('[data-collab-value]').removeAttr('data-collab-value');
  $('style.collab-special-styles').remove();
  const canvasData = createCanvasElements();
  const videoData = createVideoElements();
  docHtml = docHtml.replace(/<\/body><\/html>$/i, `${canvasData}${videoData}</body></html>`);
  return docHtml;
};

const setCustomStyles = () => {
  if (!document.styleSheets || !document.styleSheets.length) { return; }
  document.styleSheets.forEach((stylesheet) => {
    if (!stylesheet.ownerNode) { return; }
    const tagName = stylesheet.ownerNode.tagName.toLowerCase();
    let addCustomStyles = false;
    if (tagName === 'link' && stylesheet.ownerNode.getAttribute('href')) {
      if (stylesheet.ownerNode.getAttribute('href').substr(0, 5) === 'blob:') {
        addCustomStyles = true;
      }
      if (stylesheet.href) {
        stylesheet.ownerNode.setAttribute('collabsauce-href', stylesheet.href);
      }
    } else if (tagName === 'link' && stylesheet.ownerNode.integrity) {
      addCustomStyles = true;
    } else if (tagName === 'style' && stylesheet.ownerNode.innerText.trim() === '') {
      addCustomStyles = true;
    }
    if (!addCustomStyles || !stylesheet.cssRules) { return; }
    let customStyles = '';
    stylesheet.cssRules.forEach((rule) => {
      customStyles += rule.cssText;
    });
    if (customStyles) {
      $('<style class="collab-special-styles">').html(customStyles).insertAfter(stylesheet.ownerNode);
    }
  });
};

const setCustomImgs = () => {
  document.querySelectorAll('img').forEach((img) => {
    if (img.getAttribute('src') !== img.currentSrc) {
      // accounts for relative paths, and different sources
      img.setAttribute('collabsauce-src', img.currentSrc);
    }
  });
};

const createCanvasElements = () => {
  let canvasData = '';
  document.getElementsByTagName('canvas').forEach((canvas, idxx) => {
    let canvasDataUrl = '';
    try {
      canvasDataUrl = canvas.toDataURL('image/png', 1);
    } catch (err) {
      // womp womp ??
    }
    canvasData += `<div style="display:none;" class="collabCanvas${idx}">${canvasDataUrl}</div>`;
  });
  return canvasData;
};

const createVideoElements = () => {
  let videoData = '';
  document.getElementsByTagName('video').forEach((video, idx) => {
    const poster = video.getAttribute('poster') || '';
    videoData += `<div style="display:none;" class="collabVideo${idx}">${poster}</div>`;
  });
  return videoData;
};
