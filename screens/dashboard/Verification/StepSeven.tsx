import React from 'react';
import {
  View,
  StyleSheet
} from 'react-native';
import { useSelector } from 'react-redux';
import AppButton from '../../../components/UI/AppButton';
import AppInput from '../../../components/UI/AppInput';
import Validation, {required} from '../../../components/UI/Validation';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from '../../../redux/action_types/translate_action_types';
import {IKCData} from '../../../services/KvalificaServices';

interface IProps {
  kycData: IKCData | undefined;
  notEditable: boolean | undefined;
  onUpdateData: (c: IKCData | undefined) => void;
  onComplate: () => void;
}

const ValidationContext = 'userVerification7';

const StepSeven: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const nextHandler = () => {
    if (Validation.validate(ValidationContext)) {
      return;
    }

    props.onComplate();
  };

  const setPersonalNumber = (value: string) => {
    let data = {...props.kycData};
    data.personalNumber = value;
    props.onUpdateData(data);
  };

  const setFirstName = (value: string) => {
    let data = {...props.kycData};
    data.firstName = value;
    props.onUpdateData(data);
  };

  const setLastName = (value: string) => {
    let data = {...props.kycData};
    data.lastName = value;
    props.onUpdateData(data);
  };

  const setCountryName = (value: string) => {
    let data = {...props.kycData};
    data.countryName = value;
    props.onUpdateData(data);
  };

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <AppInput
          placeholder="პირადი ნომერი"
          onChange={personalNumber => !props.notEditable && setPersonalNumber(personalNumber)}
          value={props.kycData?.personalNumber}
          customKey="personalNumber"
          requireds={[required]}
          style={styles.input}
          editable={!props.notEditable}
          context={ValidationContext}
        />

        <AppInput
          placeholder="სახელი"
          onChange={firstName => !props.notEditable && setFirstName(firstName)}
          value={props.kycData?.firstName}
          customKey="setFirstName"
          requireds={[required]}
          style={styles.input}
          editable={!props.notEditable}
          context={ValidationContext}
        />

        <AppInput
          placeholder="გვარი"
          onChange={lastName => !props.notEditable && setLastName(lastName)}
          value={props.kycData?.lastName}
          customKey="lastName"
          requireds={[required]}
          style={styles.input}
          editable={!props.notEditable}
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
        title={translate.t('common.next')}
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
