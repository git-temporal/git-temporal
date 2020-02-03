// to use a style var, for example:
//
// import { style } from 'app/styles';
//
// const myStyle = {
//   backgroundColor: '@colors.altBackground',
// }
// return (<MyComponent style={style(myStyle)}/>);
//
// These are used to map theme colors and other style tweaks in the various
// editor plugins.
const styleVars = {
  colors: {
    added: 'green',
    altBackground: 'whitesmoke',
    altForeground: '#333333',
    background: '#FEFEFE',
    boxShadow: 'rgba(0, 0, 0, 0.2)',
    blobColor: '#696969',
    deleted: 'red',
    disabledText: '#e0e0e0',
    error: 'red',
    leftRevColor: 'red',
    linkText: 'blue',
    inputBackground: '#FEFEFE',
    inputForeground: '#333333',

    modified: 'orange',
    panelBorder: 'whitesmoke',
    rightRevColor: 'green',
    selectable: 'lightskyblue',
    selected: 'lightskyblue',
    selectedText: '#001883',
    text: '#333333',
  },
  margins: {
    small: 3,
    medium: 7,
    large: 15,
    pageTop: 20,
    pageLeft: 20,
    pageBottom: 20,
    pageRight: 20,
  },
};

// NOTE: the colors above are used below as string values preceded with '@' so they
//   can be intepolated at runtime and allow changes for theme-ing

const globalStyles = {
  background: {
    background: '@colors.background',
  },
  panel: {
    background: '@colors.background',
    borderRadius: 3,
    color: '@colors.text',
    marginRight: '@margins.medium+px',
    padding: '@margins.medium+px',
  },
  altPanel: {
    _extends: 'panel',
    background: '@colors.altBackground',
    color: '@colors.altForeground',
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
    fontSize: 12,
    lineHeight: 1.35,
    fontWeight: 'normal',
  },
  bigText: {
    _extends: 'normalText',
    fontSize: 18,
  },
  largerText: {
    _extends: 'normalText',
    fontSize: 14,
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
    fontSize: 22,
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
    color: '@colors.selectedText',
  },
  link: {
    color: '@colors.linkText',
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
        debugger;
        console.warn(`git-temporal: unknown style requested ${specifiedStyle}`);
      } else {
        Object.assign(styleOut, processExtends(globalStyles[specifiedStyle]));
      }
    }
  }
  return interpolateStyleVars(styleOut);
}

export function getStyleVar(groupName, varName) {
  // @ts-ignore
  const globalOverrides = window && window.GT_STYLE_VARS;
  const group =
    (globalOverrides && globalOverrides[groupName]) || styleVars[groupName];

  // group could be specified in globalOverrides but not include the var itself
  return group.hasOwnProperty(varName)
    ? group[varName]
    : styleVars[groupName][varName];
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
      const interpolated = getStyleVar(styleVarsGroup, styleVar);
      if (interpolated) {
        newValue = newValue.replace(regex, interpolated);
      }
    }
    styleObject[key] = newValue;
  }
  return styleObject;
}
