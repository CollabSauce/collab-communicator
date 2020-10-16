export const getPageDimension = () => {
  const docBody = document.body;
  const docElem = document.documentElement;

  return {
    height: Math.max(docBody.scrollHeight, docElem.scrollHeight),
    width: Math.max(docBody.scrollWidth, docElem.scrollWidth)
  };
};
