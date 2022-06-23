import React from 'react';
import {Modal, StyleProp, StyleSheet, ViewStyle} from 'react-native';
import GestureRecognizer from 'react-native-swipe-gestures';
import colors from '../constants/colors';

interface IGestureRecognizerConfig {
  velocityThreshold?: number;
  directionalOffsetThreshold?: number;
  gestureIsClickThreshold?: number;
}

const config: IGestureRecognizerConfig = {
  velocityThreshold: 0.1,
  directionalOffsetThreshold: 80,
};

interface IPageProps {
  gestureStyle?: StyleProp<ViewStyle>;
  modalStyle?: StyleProp<ViewStyle>;
  closeAction: () => void;
  visible: boolean;
  transparent?: boolean;
  gestureConfig?: IGestureRecognizerConfig;
  children?: React.ReactNode;
}

const SwipableModal: React.FC<IPageProps> = ({
  closeAction,
  visible,
  transparent,
  gestureConfig,
  gestureStyle,
  modalStyle,
  children,
}) => {
  let gConfig = config;
  if (gestureConfig !== undefined) {
    gConfig = {...gConfig, ...gestureConfig};
  }
  return (
    <GestureRecognizer
      onSwipeRight={closeAction}
      style={[styles.gestureView, gestureStyle]}
      config={gConfig}>
      <Modal
        transparent={transparent}
        visible={visible}
        onRequestClose={closeAction}
        style={[styles.modalView, modalStyle]}>
        {children}
      </Modal>
    </GestureRecognizer>
  );
};

export default React.memo(SwipableModal);

const styles = StyleSheet.create({
  gestureView: {flex: 1},
  modalView: {
    flex: 1,
    backgroundColor: colors.white
  },
});
