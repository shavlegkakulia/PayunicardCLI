import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import AppInput from '../../../components/UI/AppInput';
import Validation, {required} from '../../../components/UI/Validation';
import {IKCData} from '../../../services/KvalificaServices';

interface IProps {
  kycData: IKCData | undefined;
  onUpdateData: React.Dispatch<React.SetStateAction<IKCData | undefined>>;
  onComplate: () => void;
}

const ValidationContext = 'userVerification';

const StepSeven: React.FC<IProps> = props => {
  const nextHandler = () => {
    if (Validation.validate(ValidationContext)) {
      return;
    }

    props.onComplate();
  };

  const setPersonalNumber = (value: string) => {
    props.onUpdateData(prevData => {
      let data = {...prevData};
      data.personalNumber = value;
      return data;
    });
  };

  const setFirstName = (value: string) => {
    props.onUpdateData(prevData => {
      let data = {...prevData};
      data.firstName = value;
      return data;
    });
  };

  const setLastName = (value: string) => {
    props.onUpdateData(prevData => {
      let data = {...prevData};
      data.lastName = value;
      return data;
    });
  };

  const setCountryName = (value: string) => {
    props.onUpdateData(prevData => {
      let data = {...prevData};
      data.countryName = value;
      return data;
    });
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <AppInput
          placeholder="პირადი ნომერი"
          onChange={personalNumber => setPersonalNumber(personalNumber)}
          value={props.kycData?.personalNumber}
          customKey="personalNumber"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />

        <AppInput
          placeholder="სახელი"
          onChange={firstName => setFirstName(firstName)}
          value={props.kycData?.firstName}
          customKey="setFirstName"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />

        <AppInput
          placeholder="გვარი"
          onChange={lastName => setLastName(lastName)}
          value={props.kycData?.lastName}
          customKey="lastName"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />

        <AppInput
          placeholder="დაბადების ადგილი (ქალაქი და ქვეყანა)"
          onChange={countryName => setCountryName(countryName)}
          value={props.kycData?.countryName}
          customKey="countryName"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />
      </View>
      <AppButton
        title={'შემდეგი'}
        onPress={nextHandler}
        style={styles.button}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    maxWidth: 327,
    width: '100%',
    alignSelf: 'center',
  },
  addressContainer: {
    marginTop: 40,
  },
  input: {
    marginTop: 20,
  },
  button: {
    marginTop: 30,
  },
});

export default StepSeven;
