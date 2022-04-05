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
import AppButton from '../components/UI/AppButton';
import colors from '../constants/colors';
import {Logout} from '../redux/actions/auth_actions';
import {t} from '../redux/actions/translate_actions';

interface IProps {
  timeForInactivity: number;
  checkInterval: number;
  logout?: Function;
  t?: Function;
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
      this.props.timeForInactivity - 30000, //30 second
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
      <>
        <View
          style={style}
          collapsable={false}
          {...this.panResponder?.panHandlers}>
          {children}
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false});
          }}>
          <View style={styles.modal}>
            <View style={styles.modalContent}>
              <View style={styles.modalBody}>
                <Text style={styles.modalText}>
                  {this.props.t && this.props.t('common.sessionExpiredTitle')}
                  {'\n\n'}
                  <Text style={styles.modalText2}>
                    {this.props.t && this.props.t('common.sessionExpiredText')}
                  </Text>
                </Text>
              </View>
              <View style={styles.modalFooter}>
                <AppButton
                  style={[styles.modalButton, styles.buttonOne]}
                  backgroundColor={colors.inputBackGround}
                  color={colors.black}
                  TextStyle={styles.buttonText}
                  title={this.props.t && this.props.t('common.logout')}
                  onPress={() => this.props.logout && this.props.logout()}
                />
                <AppButton
                  style={[styles.modalButton, styles.buttonTwo]}
                  TextStyle={styles.buttonText}
                  title={this.props.t && this.props.t('common.continue')}
                  onPress={() => {
                    this.setState({modalVisible: false}, () => {
                      this.handleInactivity();
                    });
                  }}
                />
              </View>
            </View>
          </View>
        </Modal>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch: any) => {
  return {
    logout: () => dispatch(Logout()),
    t: (key: string) => dispatch(t(key)),
  };
};

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: '#00000080',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: colors.white,
    borderRadius: 10,
    width: Dimensions.get('window').width - 70,
  },
  modalBody: {
    padding: 17,
  },
  modalTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
    textTransform: 'uppercase',
  },
  modalText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 16,
    lineHeight: 19,
    color: colors.labelColor,
    textTransform: 'capitalize',
    textAlign: 'center',
  },
  modalText2: {
    fontSize: 11,
    lineHeight: 14,
  },
  modalFooter: {
    padding: 17,
    flexDirection: 'row',
  },
  modalButton: {
    flex: 5,
    paddingVertical: 7,
    maxHeight: 38,
  },
  buttonOne: {
    marginRight: 10,
  },
  buttonTwo: {
    marginLeft: 10,
  },
  buttonText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 19,
  },
});

export default connect(null, mapDispatchToProps)(UserInactivity);
