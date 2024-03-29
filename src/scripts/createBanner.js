import config from './config';

export const createBanner = (onExit) => {
  const shadowDivHolder = document.createElement('div');
  shadowDivHolder.style.position = 'fixed';
  shadowDivHolder.style.top = '0px';
  shadowDivHolder.style.left = '0px';
  shadowDivHolder.style.right = '0px';
  shadowDivHolder.style.zIndex = 2147483600;

  // create the shadow dom within the shadowDivHolder
  const shadowDomBannerContainer = shadowDivHolder.attachShadow({mode: 'open'});

  // create the banner that will inside the shadowDom
  const bannerDiv = document.createElement('div');
  bannerDiv.style.display = 'flex';
  bannerDiv.style.justifyContent = 'space-between';
  bannerDiv.style.alignItems = 'center';
  bannerDiv.style.height = '100%';
  bannerDiv.style.backgroundColor = '#00D27B';
  bannerDiv.style.color = 'white';
  bannerDiv.style.textAlign = 'center';
  bannerDiv.style.paddingTop = '3px';
  bannerDiv.style.paddingRight = '5px';
  bannerDiv.style.paddingBottom = '3px';
  bannerDiv.style.paddingLeft = '5px';
  bannerDiv.style.cursor = 'initial';

  // append the banner to the shadowDom
  shadowDomBannerContainer.appendChild(bannerDiv);

  // Create the elements that will live inside the shadowDom
  const downArrow = document.createElement('img');
  downArrow.src = `${config.currentHost}/public/assets/window-arrow.svg`;
  downArrow.height = 15;
  downArrow.style.cursor = 'pointer';
  downArrow.onclick = () => {
    downArrow.style.display = 'none';
    upArrow.style.display = 'block';
    shadowDivHolder.style.top = 'unset';
    shadowDivHolder.style.bottom = '0px';
  };

  const upArrow = document.createElement('img');
  upArrow.src = `${config.currentHost}/public/assets/window-arrow.svg`;
  upArrow.height = 15;
  upArrow.style.cursor = 'pointer';
  upArrow.style.display = 'none';
  upArrow.style.transform = 'rotate(180deg)';
  upArrow.onclick = () => {
    downArrow.style.display = 'block';
    upArrow.style.display = 'none';
    shadowDivHolder.style.top = '0px';
    shadowDivHolder.style.bottom = 'unset';
  };

  const text = document.createElement('div');
  text.innerHTML = 'Click anywhere to leave a comment or edit design';

  const cancel = document.createElement('img');
  cancel.src = `${config.currentHost}/public/assets/cancel.svg`;
  cancel.height = 12;
  cancel.style.cursor = 'pointer';
  cancel.onclick = onExit;

  bannerDiv.appendChild(downArrow);
  bannerDiv.appendChild(upArrow);
  bannerDiv.appendChild(text);
  bannerDiv.appendChild(cancel);

  return shadowDivHolder;
};
