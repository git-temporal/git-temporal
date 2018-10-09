import React from 'react';
import md5 from 'md5';
import { AuthorPlaceholderImage } from 'app/components/AuthorPlaceholderImage';
import { style } from 'app/styles';

export interface AuthorGravatarImageProps {
  width?: number;
  height?: number;
  emails?: string[];
  style?: object | string;
}

const initialState = {
  emailsIndex: 0,
};
type AuthorGravatarImageState = Readonly<typeof initialState>;

export class AuthorGravatarImage extends React.Component<
  AuthorGravatarImageProps,
  AuthorGravatarImageState
> {
  readonly state: AuthorGravatarImageState = initialState;
  readonly defaultOuterStyle = { overflow: 'hidden' };

  constructor(props) {
    super(props);

    this.onImageNotFound = this.onImageNotFound.bind(this);
  }

  render() {
    const { width = 70, height = 70, emails } = this.props;
    const { emailsIndex } = this.state;
    const notFound = emailsIndex >= emails.length;
    const outerStyle = style(this.defaultOuterStyle, this.props.style, {
      width,
      height,
    });
    const gravatarEmail = (emails[emailsIndex] || '')
      .toLocaleLowerCase()
      .replace(/\s/g, '');
    const gravatarUrl = `https://www.gravatar.com/avatar/${md5(
      gravatarEmail
    )}?d=404`;

    const imageStyle = style({ width, maxHeight: height });
    return (
      <div style={outerStyle}>
        {notFound ? (
          <AuthorPlaceholderImage holderForEmails={emails} />
        ) : (
          <img
            data-for={emails[emailsIndex]}
            style={imageStyle}
            src={gravatarUrl}
            onError={this.onImageNotFound}
          />
        )}
      </div>
    );
  }

  onImageNotFound() {
    this.setState({ emailsIndex: this.state.emailsIndex + 1 });
  }
}
