import React, { Component, PropTypes, Children, cloneElement } from 'react';
import DesktopComponent  from '../DesktopComponent';
import Pane from './Pane/Pane.windows';
import Item from './Item/Item.windows';
import Content from './Content/Content.windows';

const styles = {
  display: 'flex',
  flexWrap: 'nowrap',
  position: 'relative',
  flex: '1'
};

@DesktopComponent
class SplitView extends Component {
  static Pane = Pane;
  static Content = Content;
  static Item = Item;

  static propTypes = {
    id: PropTypes.string,
    compactLength: PropTypes.number,
    openLength: PropTypes.number,
    placement: PropTypes.string,
    isOpen: PropTypes.bool,
    persistIsOpen: PropTypes.bool,
    persistSelectedItem: PropTypes.bool,
    push: PropTypes.bool,
    onPaneToggle: PropTypes.func
  };

  static childContextTypes = {
    id: PropTypes.string,
    compactLength: PropTypes.number,
    openLength: PropTypes.number,
    placement: PropTypes.string,
    isOpen: PropTypes.bool,
    persistIsOpen: PropTypes.bool,
    persistSelectedItem: PropTypes.bool,
    push: PropTypes.bool
  };

  constructor(props, context, updater) {
    let { id, ...properties } = props;
    super(properties, context, updater);
    this.id = id || 'splitview';
  }

  set currentTitle(value) {
    this._currentTitle = value;
  }

  get currentTitle() {
    return this._currentTitle || '';
  }

  getChildContext() {
    return {
      id: this.id,
      compactLength: this.props.compactLength,
      openLength: this.props.openLength,
      placement: this.props.placement,
      isOpen: this.props.isOpen,
      persistIsOpen: this.props.persistIsOpen,
      persistSelectedItem: this.props.persistSelectedItem,
      push: this.props.push
    };
  }

  componentDidUpdate() {
    for (var prop in this.refs) {
      if (this.refs.hasOwnProperty(prop)) {
        this.refs[prop].setState({parentRequestedTheme: this.state.requestedTheme});
      }
    }
  }

  selectItem(item) {
    if (this.refs && this.context.storage && this.props.persistSelectedItem) {
      for (var prop in this.refs) {
        if (this.refs.hasOwnProperty(prop)) {
          if (this.refs[prop].props.storageKey === item.props.storageKey) {
            this.context.storage[this.getItemStorageKey(this.refs[prop].props.storageKey)] = true;
            this.refs[prop].setState({selected: true});
          } else {
            this.context.storage[this.getItemStorageKey(this.refs[prop].props.storageKey)] = false;
            this.refs[prop].setState({selected: false});
          }
        }
      }
    }
  }

  getItemStorageKey(key) {
    return `.${this.id}.$/.${key}`;
  }

  getPersistedSelectedItem(key) {
    if (typeof this.context.storage[this.getItemStorageKey(key)] !== 'undefined') {
      return this.context.storage[this.getItemStorageKey(key)] === 'true';
    }
    return null;
  }

  render() {
    const { children, style, ...props } = this.props;

    let hasSelectedItem = false;
    Children.map(children, function (child) {
      if (child.props.selected) {
        hasSelectedItem = true;
      }
    });

    let content = Children.map(children, (child, key) => {
      let props = {ref: key, storageKey: key};
      if (!hasSelectedItem && key === 0) {
        props.selected = true;
      }
      if (this.props.persistSelectedItem && this.context.storage) {
        if (this.getPersistedSelectedItem(key) !== null) {
          props.selected = this.getPersistedSelectedItem(key);
        }
      }
      return cloneElement(child, props);
    });

    return (
      <div
        style={{...styles, ...style}}
        {...props}
      >
        <Pane onPaneToggle={this.props.onPaneToggle}>
          {content}
        </Pane>
        {content}
      </div>
    );
  }
}

export default SplitView;
