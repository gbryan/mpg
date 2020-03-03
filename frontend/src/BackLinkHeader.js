import React, {PureComponent} from 'react';
import styles from './BackLinkHeader.module.css';
import PropTypes from 'prop-types';

class BackLinkHeader extends PureComponent {
  getReturnUrl() {
    const params = new URLSearchParams(this.props.queryString);
    return params.get('returnUrl');
  }

  getReturnDomain() {
    const returnUrl = this.getReturnUrl();

    if (!returnUrl) {
      return null;
    }

    const matches = returnUrl.match(/^https?:\/\/([^/?#]+)(?:[/?#]|$)/i);
    return matches && matches[1];
  }

  shouldShow() {
    const domain = this.getReturnDomain();
    return ['greendreamboard.com', 'www.greendreamboard.com'].includes(domain);
  }

  render() {
    if (!this.shouldShow()) {
      return null;
    }

    return (
      <div className={styles.backlinkHeader}>
        <a href={this.getReturnUrl()}>
          <i className="fas fa-arrow-left"></i>Return to Green Dream Board.
        </a>
      </div>
    );
  }
}

BackLinkHeader.propTypes = {
  queryString: PropTypes.string.isRequired,
};

export default BackLinkHeader;
