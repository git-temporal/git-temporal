// to use a style var, for example:
//
// import { style } from 'app/styles';
//
// const myStyle = {
//   backgroundColor: '@colors.altBackground',
// }
// return (<MyComponent style={style(myStyle)}/>);
//
let styleVars = {
  colors: {
    added: 'green',
    altBackground: 'whitesmoke',
    background: 'white',
    boxShadow: 'rgba(0, 0, 0, 0.2)',
    deleted: 'red',
    disabledText: '#e0e0e0',
    error: 'red',
    modified: 'orange',
    panelBorder: 'whitesmoke',
    leftRevColor: 'red',
    rightRevColor: 'green',
    selectable: 'lightskyblue',
    selected: 'lightskyblue',
    text: '#333333',
  },
  margins: {
    small: 5,
    medium: 10,
    large: 20,
  },
};

// NOTE: the colors above are used below as string values preceded with '@' so they
//   can be intepolated at runtime and allow changes for theme-ing

let globalStyles = {
  background: {
    background: '@colors.background',
  },
  page: {
    padding: '@margins.large+px',
    width: 'calc(100% - 40px)',
    height: 'calc(100% - 40px)',
    position: 'absolute',
    backgroundColor: '@colors.background',
  },
  panel: {
    background: '@colors.background',
    padding: '@margins.medium+px',
    borderRadius: 3,
    marginRight: '@margins.medium+px',
  },
  altPanel: {
    _extends: 'panel',
    background: '@colors.altBackground',
  },
  borderedPanel: {
    _extends: 'panel',
    border: '1px solid @colors.panelBorder',
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
    marginBottom: '@margins.medium+px',
  },
  inline: {
    display: 'inline-block',
  },
  inlineBlock: {
    display: 'inline-block',
    marginRight: '@margins.medium+px',
  },
  card: {
    _extends: 'panel',
    borderRadius: 7,
    marginBottom: '@margins.medium+px',
    marginRight: '@margins.medium+px',
  },
  flexColumn: {
    display: 'flex',
    flexDirection: 'column',
  },
  flexRow: {
    display: 'flex',
    flexDirection: 'row',
  },
  flexGrow: {
    display: 'flex',
    flexGrow: 1,
  },
  normalText: {
    fontSize: 13,
    lineHeight: 1.35,
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
    marginBottom: '@margins.large+px',
    marginRight: '@margins.large+px',
  },
  h1Text: {
    _extends: 'headerText',
    fontSize: 28,
    marginRight: '@margins.large+px',
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
    marginBottom: '@margins.medium+px',
    marginRight: '@margins.medium+px',
  },
  h5Text: {
    _extends: 'headerText',
    fontSize: 14,
    fontWeight: 'normal',
    marginBottom: '@margins.medium+px',
    marginRight: '@margins.medium+px',
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
    marginBottom: '@margins.medium+px',
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
    // @ts-ignore
    delete styleOut._extends;
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
    const regex = /\@([^\s\.]*)\.([^\s\+]*)\+?/;
    let newValue = value;
    for (const match of matches) {
      const [_matchedValue, styleVarsGroup, styleVar] = match.match(regex);
      const interpolated = styleVars[styleVarsGroup][styleVar];
      if (interpolated) {
        newValue = newValue.replace(regex, interpolated);
      }
    }
    styleObject[key] = newValue;
  }
  return styleObject;
}
