import React, {PureComponent} from 'react';
import {
  View,
  PanResponder,
  PanResponderInstance,
  StyleProp,
  ViewStyle,
  Alert,
  Modal,
  StyleSheet,
  Dimensions,
  Text,
} from 'react-native';
import {connect} from 'react-redux';
import colors from '../constants/colors';
import {Logout} from '../redux/actions/auth_actions';

interface IProps {
  timeForInactivity: number;
  checkInterval: number;
  logout?: Function;
  style?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
}

class UserInactivity extends PureComponent<IProps, any> {
  inactivityTimer: NodeJS.Timeout | undefined;
  panResponder: PanResponderInstance | undefined;
  timeout: NodeJS.Timeout | undefined;
  popupTimeout: NodeJS.Timeout | undefined;

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
    modalVisible: false,
  };

  onAction = (value: boolean) => {
    console.log('***', value);
    if (!value) {
      // this.props.logout && this.props.logout();
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
    if (this.timeout) clearTimeout(this.timeout);
    if (this.popupTimeout) clearTimeout(this.popupTimeout);
  }

  /**
   * This method is called whenever a touch is detected. If no touch is
   * detected after `this.props.timeForInactivity` milliseconds, then
   * `this.state.inactive` turns to true.
   */

  handleInactivity = () => {
    if (this.timeout) clearTimeout(this.timeout);
    if (this.popupTimeout) clearTimeout(this.popupTimeout);
    this.setState(
      {
        active: true,
      },
      () => {
        this.onAction(this.state.active); //true
      },
    );
    this.resetTimeout();
    this.initPopap();
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

  initPopap = () => {
    this.popupTimeout = setTimeout(
      () => this.setState({modalVisible: true}),
      this.props.timeForInactivity - 60000,
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
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  გაფრთხილება
                </Text>
              </View>
              <View style={styles.modalBody}>
              <Text style={styles.modalText}>
                  do you want to continue 
                  <Text style={styles.modalText2}>your session has expired</Text>
                </Text>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(Logout()),
  };
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#00000050',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: Dimensions.get('window').width - 70,
  },
  modalHeader: {
    padding: 17,
    borderBottomColor: colors.inputBackGround,
    borderBottomWidth: 1
  },
  modalBody: {
    padding: 17,
  },
  modalTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    textTransform: 'uppercase'
  },
  modalText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    textTransform: 'uppercase'
  },
  modalText2: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    textTransform: 'uppercase'
  }
});

export default connect(null, mapDispatchToProps)(UserInactivity);
