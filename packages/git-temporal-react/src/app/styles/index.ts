let globalStyles = {
  page: {
    margin: 20,
  },
  panel: {
    backgroundColor: 'white',
    marginRight: 10,
    marginBottom: 10,
    padding: 10,
    display: 'flex',
  },
  altPanel: {
    _extends: 'panel',
    backgroundColor: 'whitesmoke',
  },
  borderPanel: {
    _extends: 'panel',
    border: '1px solid whitesmoke',
    borderRadius: 4,
  },
  flexColumns: {
    display: 'flex',
    flexDirection: 'columns',
  },
  flexRows: {
    display: 'flex',
    flexDirection: 'rows',
  },
  normalText: {
    fontSize: 12,
    fontWeight: 'normal',
  },
  largerText: {
    _extends: 'normalText',
    fontSize: 13,
  },
  smallerText: {
    _extends: 'normalText',
    fontSize: 11,
  },
  boldText: {
    _extends: 'normalText',
    fontWeight: 'bold',
  },
  h1Text: {
    _extends: 'boldText',
  },
  h2Text: {
    _extends: 'boldText',
    fontSize: 18,
  },
  h3Text: {
    _extends: 'boldText',
    fontSize: 14,
  },
  h4Text: {
    _extends: 'boldText',
    fontSize: 12,
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
