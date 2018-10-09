let globalStyles = {
  page: {
    padding: 20,
    width: 'calc(100% - 40px)',
    height: 'calc(100% - 40px)',
    position: 'absolute',
  },
  panel: {
    backgroundColor: 'white',
    padding: 10,
    display: 'flex',
  },
  altPanel: {
    _extends: 'panel',
    backgroundColor: 'whitesmoke',
  },
  card: {
    _extends: 'altPanel',
    borderRadius: 7,
    marginBottom: 10,
    marginRight: 10,
  },
  borderPanel: {
    _extends: 'panel',
    border: '1px solid whitesmoke',
    borderRadius: 4,
    marginRight: 10,
    marginBottom: 10,
  },
  flexColumns: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRows: {
    display: 'flex',
    flexDirection: 'row',
  },
  normalText: {
    fontSize: 12,
    fontWeight: 'normal',
    color: '#333333',
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
  headerText: {
    _extends: 'boldText',
    marginBottom: 20,
    marginRight: 20,
  },
  h1Text: {
    _extends: 'headerText',
    fontSize: 20,
  },
  h2Text: {
    _extends: 'headerText',
    fontSize: 18,
  },
  h3Text: {
    _extends: 'headerText',
    fontSize: 14,
  },
  h4Text: {
    _extends: 'headerText',
    fontSize: 12,
  },
  linesAdded: {
    color: 'green',
  },
  linesDeleted: {
    color: 'red',
  },
};

export function replaceGlobalStyles(newGlobalStyles) {
  globalStyles = newGlobalStyles;
}

export function style(...styles) {
  const styleOut = {};
  const flattenedStyles = styles.reduce((acc, val) => acc.concat(val), []);

  for (const specifiedStyle of flattenedStyles) {
    if (!specifiedStyle) {
      continue;
    }
    if (typeof specifiedStyle === 'object') {
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
