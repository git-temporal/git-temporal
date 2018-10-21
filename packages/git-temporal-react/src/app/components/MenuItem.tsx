import React from 'react';
import { style } from 'app/styles';
import { TestProps } from 'app/interfaces';

export interface MenuItemProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  onClick: (evt) => void;
  style?: string | object;
  disabled?: boolean;
}
const initialState = {
  isHovering: false,
};
type MenuItemState = Readonly<typeof initialState>;

const containerStyle = {
  _extends: ['block', 'normalText'],
  padding: 5,
  border: '1px solid white',
};
const hoverContainerStyle = {
  _extends: [containerStyle, 'selectable'],
};
const disabledContainerStyle = {
  _extends: [containerStyle, 'disabledText'],
};

export class MenuItem extends React.Component<
  MenuItemProps & TestProps,
  MenuItemState
> {
  readonly state: MenuItemState = initialState;

  render() {
    const outerStyle = this.props.disabled
      ? disabledContainerStyle
      : this.state.isHovering
        ? hoverContainerStyle
        : containerStyle;
    return (
      <div
        style={style(outerStyle, this.props.style)}
        onClick={this.props.onClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        {this.props.children}
      </div>
    );
  }

  onMouseOver = () => {
    this.setState({ isHovering: true });
  };

  onMouseLeave = () => {
    this.setState({ isHovering: false });
  };
}
