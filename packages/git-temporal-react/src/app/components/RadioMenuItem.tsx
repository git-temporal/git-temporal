import React from 'react';
import { style } from 'app/styles';
import { TestProps } from 'app/interfaces';
import { Selectable } from 'app/components/Selectable';
import { ToggleButton } from 'app/components/ToggleButton';

export interface RadioMenuItemProps {
  // The children are the menu content
  children: string | JSX.Element | JSX.Element[];
  isSelected: boolean;
  onClick: (evt) => void;
  style?: string | object;
  testId?: string;
  disabled?: boolean;
}

const toggleButtonStyle = {
  _extends: 'selectable',
  display: 'inline-block',
  width: 15,
  height: 15,
  borderRadius: 7,
  marginRight: 10,
};

export class RadioMenuItem extends React.Component<
  RadioMenuItemProps & TestProps
> {
  render() {
    return (
      <Selectable
        style={style(this.props.style)}
        onClick={this.props.onClick}
        disabled={this.props.disabled}
        testId={this.props.testId}
      >
        <div>
          <ToggleButton
            style={toggleButtonStyle}
            isSelected={this.props.isSelected}
            onClick={this.props.onClick}
          />
          {this.props.children}
        </div>
      </Selectable>
    );
  }
}
