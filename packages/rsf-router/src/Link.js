// Link.js 是基于 react-router Link 改造的
import React from 'react';
import RouterContext from './RouterContext';
import { createLocation } from 'history';
import PropTypes from 'prop-types';

function isModifiedEvent(event) {
  return !!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey);
}

class Link extends React.Component {
  static displayName = 'Link';
  handleClick(event, history) {
    const { onClick, replace, target } = this.props;
    if (onClick) onClick(event);

    if (
      !event.defaultPrevented && // onClick prevented default
      event.button === 0 && // ignore everything but left clicks
      (!target || target === '_self') && // let browser handle "target=_blank" etc.
      !isModifiedEvent(event) // ignore clicks with modifier keys
    ) {
      event.preventDefault();

      const method = replace ? history.replace : history.push;

      method(this.props.to);
    }
  }

  render() {
    const { children, innerRef, replace, to, ...rest } = this.props;
    return (
      <RouterContext>
        {context => {
          this.routerContext = context;
          if (!context.history) {
            return false;
          }
          const { history } = context;
          const location =
            typeof to === 'string'
              ? createLocation(to, null, null, history.location)
              : to;
          const href = location ? history.createHref(location) : '';

          return (
            <a
              {...rest}
              onClick={event => this.handleClick(event, context.history)}
              href={href}
              ref={innerRef}
            >
              {children}
            </a>
          );
        }}
      </RouterContext>
    );
  }
}

// eslint-disable-next-line
if (__DEV__) {
  Link.propTypes = {
    innerRef: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
    onClick: PropTypes.func,
    replace: PropTypes.bool,
    target: PropTypes.string,
    to: PropTypes.oneOfType([PropTypes.string, PropTypes.object]).isRequired,
  };

  Link.prototype.throwsIfRouterContextNotDefined = function() {
    // componentDidUpdate 中报错不会打断渲染
    if (!this.routerContext.history) {
      throw new Error('You should not use <Link> outside a <Router>');
    }
  };

  Link.prototype.componentDidUpdate = function() {
    // componentDidUpdate 中报错不会打断渲染
    this.throwsIfRouterContextNotDefined();
  };

  Link.prototype.componentDidMount = function() {
    // componentDidMount 中报错不会打断渲染
    this.throwsIfRouterContextNotDefined();
  };
}

export default Link;
