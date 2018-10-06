import React from 'react';
import md5 from 'md5';
import { AuthorPlaceholderImage } from 'app/components/AuthorPlaceholderImage';
import { style } from 'app/styles';

export interface AuthorGravatarImageProps {
  width?: number;
  height?: number;
  email?: string;
  style?: object | string;
}

const initialState = {
  notFound: false,
};
type AuthorGravatarImageState = Readonly<typeof initialState>;

export class AuthorGravatarImage extends React.Component<
  AuthorGravatarImageProps,
  AuthorGravatarImageState
> {
  readonly state: AuthorGravatarImageState = initialState;
  readonly defaultOuterStyle = { overflow: 'hidden' };

  render() {
    const { width = 70, height = 70, email } = this.props;
    const { notFound } = this.state;
    const outerStyle = style(this.defaultOuterStyle, this.props.style, {
      width,
      height,
    });
    const gravatarEmail = (email || '').toLocaleLowerCase().replace(/\s/g, '');
    const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
      gravatarEmail
    )}?d=404`;

    const imageStyle = style({ width, maxHeight: height });
    return (
      <div style={outerStyle}>
        {notFound || gravatarEmail.length === 0 ? (
          <AuthorPlaceholderImage />
        ) : (
          <img
            style={imageStyle}
            src={gravatarUrl}
            onError={this.onImageNotFound}
          />
        )}
      </div>
    );
  }

  onImageNotFound = () => {
    this.setState({ notFound: true });
  };
}
