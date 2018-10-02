const globalStyles = {
  page: {
    margin: 20,
  },
  panel: {
    backgroundColor: 'white',
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
  },
  altPanel: {
    _extends: 'panel',
    backgroundColor: 'whitesmoke',
  },
};

export default function style(...styles) {
  const styleOut = {};
  for (const specifiedStyle of styles) {
    if (specifiedStyle !== null && typeof specifiedStyle === 'object') {
      Object.assign(styleOut, processExtends(specifiedStyle));
    } else {
      if (!globalStyles.hasOwnProperty(specifiedStyle)) {
        console.warn(`git-temporal: unknown style requested ${specifiedStyle}`);
      } else {
        Object.assign(styleOut, processExtends(globalStyles[specifiedStyle]));
      }
    }
  }
  return styleOut;
}

function processExtends(styleObject) {
  const styleOut = {};
  for (const propertyName in styleObject) {
    if (propertyName === '_extends') {
      for (const extendedStyle of [styleObject[propertyName]]) {
        Object.assign(styleOut, style(extendedStyle));
      }
    } else {
      styleOut[propertyName] = styleObject[propertyName];
    }
  }
  return styleOut;
}
