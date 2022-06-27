import React from 'react';
import { Modal, SafeAreaView, StyleProp, StyleSheet, ViewStyle } from 'react-native';
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
  disableSwipe?: boolean;
}

const SwipableModal: React.FC<IPageProps> = ({
  closeAction,
  visible,
  transparent,
  gestureConfig,
  gestureStyle,
  modalStyle,
  disableSwipe,
  children,
}) => {
  let gConfig = config;
  if (gestureConfig !== undefined) {
    gConfig = { ...gConfig, ...gestureConfig };
  }
  return (

    <GestureRecognizer
      onSwipeRight={() => !disableSwipe && closeAction()}
      style={[styles.gestureView, gestureStyle]}
      config={gConfig}>
      <Modal
        transparent={transparent}
        visible={visible}
        onRequestClose={closeAction}
        style={[styles.modalView, modalStyle]}>
        <SafeAreaView style={styles.safeArea}>
          {children}
        </SafeAreaView>
      </Modal>
    </GestureRecognizer>

  );
};

export default React.memo(SwipableModal);

const styles = StyleSheet.create({
  safeArea: {
    flex: 1
  },
  gestureView: { flex: 1 },
  modalView: {
    flex: 1,
    backgroundColor: colors.white
  },
});
