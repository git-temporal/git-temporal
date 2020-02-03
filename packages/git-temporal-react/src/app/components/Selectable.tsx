import React from 'react';
import { style } from 'app/styles';
import { TestProps } from 'app/interfaces';

export interface MenuItemProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  onClick: (evt, value?) => void;
  onDoubleClick?: (evt, value?) => void;
  value?: any;
  style?: string | object;
  disabled?: boolean;
  selected?: boolean;
  testId?: string;
}
const initialState = {
  isHovering: false,
};
type MenuItemState = Readonly<typeof initialState>;

const containerStyle = {
  _extends: ['normalText'],
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

const DOUBLE_CLICK_DELAY_MS = 500;

export class Selectable extends React.Component<
  MenuItemProps & TestProps,
  MenuItemState
> {
  readonly state: MenuItemState = initialState;
  private lastClick: number;

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
        data-testid={this.props.testId}
      >
        {this.props.children}
      </div>
    );
  }

  private onClick = evt => {
    const now = Date.now();
    if (this.lastClick && now - this.lastClick <= DOUBLE_CLICK_DELAY_MS) {
      this.props.onDoubleClick(evt, this.props.value);
    } else {
      this.props.onClick(evt, this.props.value);
    }
    this.lastClick = now;
  };

  private onMouseOver = () => {
    this.setState({ isHovering: true });
  };

  private onMouseLeave = () => {
    this.setState({ isHovering: false });
  };
}
