import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import colors from '../../../constants/colors';

interface IStepsProps {
  currentStep: number;
  stepArray: Array<number>;
}

const StepsContent: React.FC<IStepsProps> = props => {
  return (
    <View style={styles.stepContainer}>
      {props.stepArray.map((_, index) => (
        <View
          key={index}
          style={[
            styles.step,
            index <= props.currentStep - 1 && styles.activeStep,
          ]}>
          <Text
            style={[
              styles.stepText,
              index <= props.currentStep - 1 && styles.activeStepText,
            ]}>
            {index + 1}
          </Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  stepContainer: {
    marginTop: 17,
    flexDirection: 'row',
    justifyContent: 'space-between',
    maxWidth: 327,
    width: '100%',
    alignSelf: 'center',
  },
  step: {
    width: 18,
    height: 18,
    borderColor: colors.inputBackGround,
    borderRadius: 9,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepText: {
    fontFamily: 'FiraGO-Medium',
    color: colors.placeholderColor,
    fontSize: 12,
    lineHeight: 14,
  },
  activeStep: {
    backgroundColor: colors.primary,
    borderWidth: 0,
  },
  activeStepText: {
    color: colors.white,
  },
});

export default StepsContent;
