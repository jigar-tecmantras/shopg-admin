/**
 * Changes the body attribute
 */
const changeHTMLAttribute = (attribute: any, value: string): boolean => {
  if (
    document.documentElement !== null &&
    document.documentElement !== undefined
  ) {
    document.documentElement.setAttribute(attribute, value);
  }
  return true;
};

export {changeHTMLAttribute};
