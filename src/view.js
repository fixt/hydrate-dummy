import React, { Component } from 'react';
import { css, merge } from 'glamor';

import { clearCookie, getCookie, setCookie } from './cookie';
import hydrateOnIcon from './hydrate-on.png';
import hydrateOffIcon from './hydrate-off.png';
import minimizeIcon from './minimize.png';

const humanize = (feature) => (
  feature.split('_').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')
);

const features = {
  hydrateDummy: 'hydrate_dummy',
};

const featureIcons = {
  hydrateDummy: (isTurnedOn) => isTurnedOn ? hydrateOnIcon : hydrateOffIcon,
};

class View extends Component {
  constructor() {
    super();

    this.state = {
      minimized: true,
      shouldHydrate: getCookie({ name: features.hydrateDummy }, document),
    };
  }

  switchFeatureOff = (feature) => () => {
    clearCookie({ name: feature, secure: false }, document);

    location.reload();
  }

  switchFeatureOn = (feature) => () => {
    setCookie({
      name: feature,
      value: true,
    }, document);

    location.reload();
  }

  toggleMinimize = () => {
    this.setState((prevState) => ({ minimized: !prevState.minimized }));
  }

  renderFeatureButton = ({ feature, isTurnedOn }) => {
    const handleOnClick = isTurnedOn
      ? this.switchFeatureOff(feature)
      : this.switchFeatureOn(feature);

    const onClickDescription = `Turn ${humanize(feature)} ${isTurnedOn ? 'Off' : 'On'}`;

    return (
      <button
        { ...merge(styles.button, styles.featureButton) }
        onClick={ handleOnClick }
      >
        { onClickDescription }
      </button>
    );
  }

  render() {
    const { minimized, shouldHydrate } = this.state;

    if (minimized) {
      return (
        <MinimizedMenu onClick={ this.toggleMinimize }>
          <div { ...styles.statusContainer }>
            <img { ...styles.icon } src={ featureIcons.hydrateDummy(shouldHydrate) }/>
          </div>
        </MinimizedMenu>
      );
    } else {
      return (
        <div { ...styles.container }>
          <div { ...styles.topMenuBar }>
            <div { ...styles.statusContainer }>
              <img { ...styles.icon } src={ featureIcons.hydrateDummy(shouldHydrate) }/>
            </div>

            <MinimizeMenuButton onClick={ this.toggleMinimize }/>
          </div>

          {
            this.renderFeatureButton({
              feature: features.hydrateDummy,
              isTurnedOn: shouldHydrate,
            })
          }
        </div>
      );
    }
  }
}

const MinimizedMenu = ({ children, onClick }) => (
  <div { ...merge(styles.container, styles.minimized) }>
    <button { ...merge(styles.button, styles.maximizeButton) } onClick={ onClick }>
      { children }
    </button>
  </div>
);

const MinimizeMenuButton = ({ onClick }) => (
  <button { ...merge(styles.button, styles.minimizeButton) } onClick={ onClick }>
    <img { ...styles.icon } src={ minimizeIcon }/>
  </button>
);

const styles = {
  button: css({
    backgroundColor: 'transparent',
    border: '1px solid #16fd96',
    borderRadius: '3px',
    color: '#16fd96',
    cursor: 'pointer',
  }),
  container: css({
    alignItems: 'stretch',
    backgroundColor: '#353334',
    borderRadius: '3px',
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '200px',
    padding: '12px',
    position: 'absolute',
    right: 3,
    top: 3,
    zIndex: 99,
  }),
  icon: css({
    height: '18px',
    width: '18px',
  }),
  featureButton: css({
    padding: '12px',
    margin: '6px auto',
    width: '175px',
    '.shouldhover &:hover': {
      backgroundColor: '#16fd96',
      color: '#353334',
    },
  }),
  topMenuBar: css({
    alignItems: 'center',
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '12px',
  }),
  statusContainer: css({
    padding: '3px',
    '& img': {
      margin: '0 6px',
    },
  }),
  maximizeButton: css({
    border: 'none',
    padding: '6px',
  }),
  minimizeButton: css({
    border: 'none',
    padding: '6px',
  }),
  minimized: css({
    padding: '6px',
    transition: '0.5s ease',
  }),
};

export default View;
