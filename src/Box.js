import React, { Component, PropTypes } from 'react';
import Styling, { mergeStyles, applyStyle } from './Styling';
import SegmentedControl from './SegmentedControl';

var styles = {
  osx_10_11: {
    WebkitUserSelect: 'none',
    cursor: 'default',
    backgroundColor: 'rgba(0, 0, 0, .04)',
    borderWidth: '1px',
    borderStyle: 'solid',
    borderTopColor: 'rgba(0, 0, 0, .07)',
    borderLeftColor: 'rgba(0, 0, 0, .037)',
    borderRightColor: 'rgba(0, 0, 0, .037)',
    borderBottomColor: 'rgba(0, 0, 0, .026)',
    borderRadius: '4px',

    segmentedControls: {
      position: 'relative',
      paddingTop: '10px'
    }
  }
};

class Box extends Component {
  static propTypes = {
    children: PropTypes.oneOfType([React.PropTypes.string, React.PropTypes.element, React.PropTypes.array]),
    style: PropTypes.object
  };

  get styles() {
    return mergeStyles(styles.osx_10_11, this.props.style);
  }

  render() {
    const hasSegmentedControls = typeof this.props.children === 'object' && this.props.children.type === SegmentedControl;

    let styles = this.styles;
    if (hasSegmentedControls) {
      styles = mergeStyles(styles, this.styles.segmentedControls);
    }

    return (
      <div style={applyStyle(styles)}>
        {this.props.children}
      </div>
    );
  }
}

export default Box;