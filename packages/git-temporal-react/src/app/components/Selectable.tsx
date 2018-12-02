import React from 'react';
import { style } from 'app/styles';
import { TestProps } from 'app/interfaces';

export interface MenuItemProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  onClick: (evt, value?) => void;
  value?: any;
  style?: string | object;
  disabled?: boolean;
  selected?: boolean;
}
const initialState = {
  isHovering: false,
};
type MenuItemState = Readonly<typeof initialState>;

const containerStyle = {
  _extends: ['block', 'normalText'],
  padding: 5,
  // this keeps the card from moving on hover, but
  // won't show a border regardless of background color
  // when not hovering
  border: '1px solid transparent',
};
const hoverContainerStyle = {
  _extends: [containerStyle, 'selectable'],
};
const disabledContainerStyle = {
  _extends: [containerStyle, 'disabledText'],
};
const selectedContainerStyle = {
  _extends: [containerStyle, 'selected'],
};

export class Selectable extends React.Component<
  MenuItemProps & TestProps,
  MenuItemState
> {
  readonly state: MenuItemState = initialState;

  render() {
    const outerStyle = this.props.disabled
      ? disabledContainerStyle
      : this.props.selected
        ? selectedContainerStyle
        : this.state.isHovering
          ? hoverContainerStyle
          : containerStyle;
    return (
      <div
        style={style(outerStyle, this.props.style)}
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}
      >
        {this.props.children}
      </div>
    );
  }

  private onClick = evt => {
    this.props.onClick(evt, this.props.value);
  };

  private onMouseOver = () => {
    this.setState({ isHovering: true });
  };

  private onMouseLeave = () => {
    this.setState({ isHovering: false });
  };
}
