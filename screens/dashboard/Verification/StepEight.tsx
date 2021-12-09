import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import AppButton from '../../../components/UI/AppButton';
import AppCheckbox from '../../../components/UI/AppCheckbox';
import AppInput from '../../../components/UI/AppInput';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import Validation, {required} from '../../../components/UI/Validation';
import colors from '../../../constants/colors';
import {IKCData} from '../../../services/KvalificaServices';
import {ICitizenshipCountry} from '../../../services/PresentationServive';

interface IProps {
  selectedCountry: ICitizenshipCountry | undefined;
  selectedCountry2: ICitizenshipCountry | undefined;
  countryes: ICitizenshipCountry[] | undefined;
  onSetCountry: (country: ICitizenshipCountry) => void;
  onSetCountry2: (country: ICitizenshipCountry | undefined) => void;
  kycData: IKCData | undefined;
  onUpdateData: (c: IKCData | undefined) => void;
  onComplate: () => void;
}

const ValidationContext = 'userVerification';

const StepEight: React.FC<IProps> = props => {
  const [countryErrorStyle, setCountryErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [countryErrorStyle2, setCountryErrorStyle2] = useState<
    StyleProp<ViewStyle>
  >({});
  const [countryVisible, setCountryVisible] = useState(false);
  const [countryVisible2, setCountryVisible2] = useState(false);
  const [hasDualSitizenship, setHasDualSitizenship] = useState(false);

  const nextHandler = () => {
    if (!props.selectedCountry) {
      setCountryErrorStyle({borderColor: colors.danger, borderWidth: 1});
      return;
    } else {
      setCountryErrorStyle({});
    }

    if (hasDualSitizenship && !props.selectedCountry2) {
      setCountryErrorStyle2({borderColor: colors.danger, borderWidth: 1});
      return;
    } else {
      setCountryErrorStyle2({});
    }

    if (Validation.validate(ValidationContext)) {
      return;
    }

    props.onComplate();
  };

  const setBirthDate = (value: string) => {
    let data = {...props.kycData};
    data.birthDate = value;
    props.onUpdateData(data);
  };

  const setSex = (value: string) => {
    let data = {...props.kycData};
    data.sex = value;
    props.onUpdateData(data);
  };

  useEffect(() => {
    if (!hasDualSitizenship) props.onSetCountry2(undefined);
  }, [hasDualSitizenship]);

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <AppInput
          placeholder="დაბადების წელი"
          onChange={birthDate => setBirthDate(birthDate)}
          value={props.kycData?.birthDate}
          customKey="birthDate"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />

        <AppInput
          placeholder="სქესი"
          onChange={sex => setSex(sex)}
          value={props.kycData?.sex}
          customKey="sex"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />

        <View style={[styles.countryBox, countryErrorStyle]}>
          {props.selectedCountry ? (
            <SelectItem
              itemKey="countryName"
              defaultTitle="აირჩიეთ ქვეყანა"
              item={props.selectedCountry}
              onItemSelect={() => setCountryVisible(true)}
              style={styles.countryItem}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setCountryVisible(true)}
              style={[styles.countrySelectHandler]}>
              <Text style={styles.countryPlaceholder}>აირჩიეთ ქვეყანა</Text>
              <Image
                style={styles.dropImg}
                source={require('./../../../assets/images/down-arrow.png')}
              />
            </TouchableOpacity>
          )}

          <AppSelect
            itemKey="countryName"
            elements={props.countryes}
            selectedItem={props.selectedCountry}
            itemVisible={countryVisible}
            onSelect={item => {
              props.onSetCountry(item);
              setCountryVisible(false);
            }}
            onToggle={() => setCountryVisible(!countryVisible)}
          />
        </View>

        <AppCheckbox
          style={styles.checkbox}
          activeColor={colors.primary}
          label="ორმაგი მოქალაქეობა"
          clicked={() => setHasDualSitizenship(!hasDualSitizenship)}
          value={hasDualSitizenship}
          key={'hasDualSitizenship'}
          customKey="hasDualSitizenship"
          context={ValidationContext}
        />

        {hasDualSitizenship && (
          <View style={[styles.countryBox, countryErrorStyle2]}>
            {props.selectedCountry2 ? (
              <SelectItem
                itemKey="countryName"
                defaultTitle="აირჩიეთ ქვეყანა"
                item={props.selectedCountry2}
                onItemSelect={() => setCountryVisible2(true)}
                style={styles.countryItem}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setCountryVisible2(true)}
                style={[styles.countrySelectHandler]}>
                <Text style={styles.countryPlaceholder}>აირჩიეთ ქვეყანა</Text>
                <Image
                  style={styles.dropImg}
                  source={require('./../../../assets/images/down-arrow.png')}
                />
              </TouchableOpacity>
            )}

            <AppSelect
              itemKey="countryName"
              elements={props.countryes}
              selectedItem={props.selectedCountry2}
              itemVisible={countryVisible2}
              onSelect={item => {
                props.onSetCountry2(item);
                setCountryVisible2(false);
              }}
              onToggle={() => setCountryVisible2(!countryVisible2)}
            />
          </View>
        )}
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
  countryBox: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
    marginTop: 20,
  },
  countryItem: {
    backgroundColor: colors.inputBackGround,
    borderRadius: 7,
  },
  dropImg: {
    marginRight: 12,
  },
  countrySelectHandler: {
    height: 54,
    backgroundColor: colors.inputBackGround,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  countryPlaceholder: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
    marginLeft: 13,
  },
  checkbox: {
    marginTop: 20,
    alignSelf: 'flex-start',
  },
});

export default StepEight;
