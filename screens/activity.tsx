import React, {PureComponent} from 'react';
import {
  View,
  PanResponder,
  PanResponderInstance,
  StyleProp,
  ViewStyle,
} from 'react-native';
import {connect} from 'react-redux';
import {Logout} from '../redux/actions/auth_actions';

interface IProps {
  timeForInactivity: number;
  checkInterval: number;
  logout?: Function;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode
}

class UserInactivity extends PureComponent<IProps, any> {
  inactivityTimer: NodeJS.Timeout | undefined;
  panResponder: PanResponderInstance | undefined;
  timeout: NodeJS.Timeout | undefined;

  constructor(props: any) {
    super(props);
  }

  static defaultProps = {
    timeForInactivity: 10000,
    checkInterval: 2000,
    style: {
      flex: 1,
    },
  };

  state = {
    active: true,
  };

  onAction = (value: boolean) => {
    console.log('***', value)
    if (!value) {
      this.props.logout && this.props.logout();
    }
  };

  componentWillMount() {
    this.panResponder = PanResponder.create({
      onMoveShouldSetPanResponderCapture:
        this.onMoveShouldSetPanResponderCapture,
      onStartShouldSetPanResponderCapture:
        this.onMoveShouldSetPanResponderCapture,
    });
    this.handleInactivity();
  }

  componentWillUnmount() {
    if (this.timeout) clearInterval(this.timeout);
  }

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.timeForInactivity` milliseconds, then
   * `this.state.inactive` turns to true.
   */

  handleInactivity = () => {
    if (this.timeout) clearTimeout(this.timeout);
    this.setState(
      {
        active: true,
      },
      () => {
        this.onAction(this.state.active); //true
      },
    );
    this.resetTimeout();
    return false;
  };

  /**
   * If more than `this.props.timeForInactivity` milliseconds have passed
   * from the latest touch event, then the current state is set to `inactive`
   * and the `this.props.onInactivity` callback is dispatched.
   */

  timeoutHandler = () => {
    this.setState(
      {
        active: false,
      },
      () => {
        this.onAction(this.state.active); // false
      },
    );
  };

  resetTimeout = () => {
    this.timeout = setTimeout(
      this.timeoutHandler,
      this.props.timeForInactivity,
    );
  };

  onMoveShouldSetPanResponderCapture = () => {
    this.handleInactivity();
    /**
     * In order not to steal any touches from the children components, this method
     * must return false.
     */
    return false;
  };

  render() {
    const {style, children} = this.props;
    return (
      <View
        style={style}
        collapsable={false}
        {...this.panResponder?.panHandlers}>
        {children}
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(Logout()),
  };
};

export default connect(null, mapDispatchToProps)(UserInactivity);
