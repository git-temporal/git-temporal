import React from 'react';
import { style } from 'app/styles';

export interface TransitionVisibleProps {
  isVisible: boolean;
  children: string | JSX.Element | JSX.Element[];
  style?: object | string;
}

const outerStyle = {
  display: 'inline-block',
};

const visibleStyle = {
  visibility: 'visible',
  opacity: 1,
  transition: 'all 2s linear',
};

const hiddenStyle = {
  visibility: 'hidden',
  opacity: 0,
  transition: 'all .5s ease',
};

export class TransitionVisible extends React.Component<TransitionVisibleProps> {
  render() {
    const addStyle = this.props.isVisible ? visibleStyle : hiddenStyle;
    return (
      <div style={style(outerStyle, this.props.style, addStyle)}>
        {this.props.children}
      </div>
    );
  }
}
