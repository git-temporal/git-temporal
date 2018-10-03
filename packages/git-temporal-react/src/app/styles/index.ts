let globalStyles = {
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
  flexColumns: {
    display: 'flex',
    flexDirection: 'columns',
  },
  flexRows: {
    display: 'flex',
    flexDirection: 'rows',
  },
};

export function replaceGlobalStyles(newGlobalStyles) {
  globalStyles = newGlobalStyles;
}

export function style(...styles) {
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
      let extendedStyles = styleObject[propertyName];
      if (!Array.isArray(extendedStyles)) {
        extendedStyles = [extendedStyles];
      }
      for (const extendedStyle of extendedStyles) {
        Object.assign(styleOut, style(extendedStyle));
      }
    } else {
      styleOut[propertyName] = styleObject[propertyName];
    }
  }
  return styleOut;
}
