import React, {useEffect, useRef} from 'react';
import {
  PanResponder,
  PanResponderInstance,
  View,
  StyleSheet,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {Logout} from '../redux/actions/auth_actions';
import CommonService from '../services/CommonService';

const IdleHook: React.FC = props => {
  const panResponder = useRef<PanResponderInstance>();
  const timer = useRef<NodeJS.Timeout>();
  let activeTTL = 80;
  let currentTime = 0;
  const dispatch = useDispatch();

  useEffect(() => {
    panResponder.current = PanResponder.create({
      onStartShouldSetPanResponder: () => {
        resetInactivityTimeout();
        return true;
      },
      onMoveShouldSetPanResponder: () => false,
      onStartShouldSetPanResponderCapture: () => {
        resetInactivityTimeout();
        return false;
      },
      onMoveShouldSetPanResponderCapture: () => false,
      onPanResponderTerminationRequest: () => true,
      onShouldBlockNativeResponder: () => false,
    });
    resetInactivityTimeout();

    return () => {
      currentTime = 0;
      CommonService.intervals?.forEach(() => {
        const id = CommonService.intervals?.shift();
        if (id) clearInterval(id);
      });
      if(timer.current) clearInterval(timer.current);
    }
  }, []);

  const resetInactivityTimeout = () => {
    if(timer.current) clearInterval(timer.current);
    currentTime = 0;
    CommonService.intervals?.forEach(() => {
      const id = CommonService.intervals?.shift();
      if (id) clearInterval(id);
    });

    CommonService.intervals.push(
      ...(CommonService.intervals || []),
      timer.current = setInterval(() => {
        if (currentTime >= activeTTL) {
          CommonService.intervals = [];
          if(timer.current) clearInterval(timer.current);
          dispatch(Logout());
        }

        currentTime = currentTime + 1;
      }, 1000),
    );
  };

  return (
    <View
      style={styles.content}
     {...(panResponder.current?.panHandlers &&
       panResponder.current.panHandlers)}
        >
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
  },
});

export default IdleHook;
