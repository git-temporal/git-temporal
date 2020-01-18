import React from 'react';
import { style } from 'app/styles';

export interface ExplodeOnChangeProps {
  value: any;
  children: string | JSX.Element | JSX.Element[];
  initialExplosion?: boolean;
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

// note 2.5 = way too in your face
const DEFAULT_SCALE = 1.8;
const HANG_TIME = 900;

export class ExplodeOnChange extends React.Component<
  ExplodeOnChangeProps,
  ExplodeOnChangeState
> {
  readonly state: ExplodeOnChangeState = {
    isExploding: false,
  };

  componentDidMount() {
    // let rendering settle or it looks glitchy
    if (this.props.initialExplosion) {
      setTimeout(() => {
        this.explode();
      }, 100);
    }
  }

  componentDidUpdate(newProps) {
    if (newProps.value !== this.props.value) {
      this.explode();
    }
  }

  render() {
    const { scale = DEFAULT_SCALE } = this.props;
    const addStyle = this.state.isExploding
      ? { transform: `scale(${scale}, ${scale})` }
      : null;
    return (
      <div style={style(outerStyle, this.props.style, addStyle)}>
        {this.props.children}
      </div>
    );
  }

  private explode() {
    this.setState({ isExploding: true });
    setTimeout(() => {
      this.setState({ isExploding: false });
    }, HANG_TIME);
  }
}
