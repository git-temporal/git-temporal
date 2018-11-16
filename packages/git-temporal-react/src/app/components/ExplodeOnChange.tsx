import React from 'react';
import { style } from 'app/styles';

export interface ExplodeOnChangeProps {
  value: any;
  children: string | JSX.Element | JSX.Element[];
  scale?: number;
  style?: object | string;
}

interface ExplodeOnChangeState {
  isExploding: boolean;
}

const outerStyle = {
  display: 'inline-block',
  transition: 'all 1s ease',
};

export class ExplodeOnChange extends React.Component<
  ExplodeOnChangeProps,
  ExplodeOnChangeState
> {
  readonly state: ExplodeOnChangeState = {
    isExploding: false,
  };

  componentDidUpdate(newProps) {
    if (newProps.value !== this.props.value) {
      this.setState({ isExploding: true });
      setTimeout(() => {
        this.setState({ isExploding: false });
      }, 1300);
    }
  }

  render() {
    const { scale = 2.5 } = this.props;
    const addStyle = this.state.isExploding
      ? { transform: `scale(${scale}, ${scale})` }
      : null;
    return (
      <div style={style(outerStyle, this.props.style, addStyle)}>
        {this.props.children}
      </div>
    );
  }
}
