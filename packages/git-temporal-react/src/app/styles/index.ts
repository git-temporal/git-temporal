let styleVars = {
  colors: {
    background: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.2)',
    altBackground: 'whitesmoke',
    text: '#333333',
    disabledText: '#e0e0e0',
    selectable: 'lightskyblue',
    selected: 'lightskyblue',
    leftRevColor: 'red',
    rightRevColor: 'green',
    error: 'red',
  },
};

// NOTE: the colors above are used below as string values preceded with '@' so they
//   can be intepolated at runtime and allow changes for theme-ing

let globalStyles = {
  background: {
    background: '@colors.background',
  },
  page: {
    padding: 20,
    width: 'calc(100% - 40px)',
    height: 'calc(100% - 40px)',
    position: 'absolute',
  },
  panel: {
    background: '@colors.background',
    padding: 10,
    borderRadius: 3,
    marginRight: 10,
  },
  altPanel: {
    _extends: 'panel',
    background: '@colors.altBackground',
  },
  borderedPanel: {
    _extends: 'panel',
    border: `1px solid @colors.altBackground`,
  },
  fill: {
    position: 'relative',
    height: '100%',
    width: '100%',
  },
  popup: {
    _extends: 'panel',
    position: 'absolute',
    zIndex: 1,
    boxShadow: '0 4px 8px 0 @colors.boxShadow, 0 6px 20px 0 @colors.boxShadow',
  },
  block: {
    display: 'block',
    marginBottom: 10,
  },
  inline: {
    display: 'inline-block',
  },
  inlineBlock: {
    display: 'inline-block',
    marginRight: 10,
  },
  card: {
    _extends: 'panel',
    borderRadius: 7,
    marginBottom: 10,
    marginRight: 10,
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
    fontSize: 13,
    fontWeight: 'normal',
    color: '@colors.text',
  },
  largerText: {
    _extends: 'normalText',
    fontSize: 16,
  },
  smallerText: {
    _extends: 'normalText',
    fontSize: 11,
  },
  boldText: {
    fontWeight: 'bold',
  },
  disabledText: {
    color: '@colors.disabledText',
  },
  headerText: {
    _extends: ['normalText', 'boldText'],
    marginBottom: 20,
    marginRight: 20,
  },
  h1Text: {
    _extends: 'headerText',
    fontSize: 28,
    marginRight: 20,
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
    marginBottom: 10,
    marginRight: 10,
  },
  h5Text: {
    _extends: 'headerText',
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: 10,
    marginRight: 10,
  },
  errorText: {
    _extends: 'largerText',
    color: '@colors.error',
  },
  linesAdded: {
    color: 'green',
  },
  linesDeleted: {
    color: 'red',
  },
  selectable: {
    border: `1px solid @colors.selectable`,
    borderRadius: 3,
    cursor: 'pointer',
    userSelect: 'none',
  },
  selected: {
    _extends: 'selectable',
    background: '@colors.selected',
  },
  link: {
    color: 'blue',
    cursor: 'pointer',
    textDecoration: 'underline',
  },
  linkHover: {
    _extends: 'link',
    textDecoration: 'underline',
  },
  menuDivider: {
    borderBottom: `2px solid @colors.altBackground`,
    marginBottom: 10,
  },
};

export function extendStyleVars(newStyleVars) {
  styleVars = Object.assign(styleVars, newStyleVars);
}

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
  return interpolateStyleVars(styleOut);
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

function interpolateStyleVars(styleObject) {
  for (const key in styleObject) {
    const value = styleObject[key];
    if (!(typeof value === 'string' || value instanceof String)) {
      continue;
    }
    const matches = value.match(/\@[^\s\.]*\.[^\s]*/g);
    if (!matches || matches.length <= 0) {
      continue;
    }
    let newValue = value;
    for (const match of matches) {
      const [matchedValue, styleVarsGroup, styleVar] = match.match(
        /\@([^\s\.]*)\.([^\s]*)/
      );
      const interpolated = styleVars[styleVarsGroup][styleVar];
      if (interpolated) {
        newValue = newValue.replace(matchedValue, interpolated);
      }
    }
    styleObject[key] = newValue;
  }
  return styleObject;
}
