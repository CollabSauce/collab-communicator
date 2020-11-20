import config from './config';

export const createIframePlaceholder = (placeholderDivId) => {
  // create a placeholder loading div until the iframe has fully loaded
  const placeholderDiv = document.createElement('div');
  placeholderDiv.id = placeholderDivId;
  placeholderDiv.className = 'collab-sauce-frame-right collab-sauce-frame-top collab-sauce-frame-full';
  placeholderDiv.innerHTML = '<div class="collab-sauce-lds-hourglass"></div>';
  document.body.appendChild(placeholderDiv);
};
