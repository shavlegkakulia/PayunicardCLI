import React, {useEffect, useState} from 'react';
import {useMemo} from 'react';
import {
  View,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TouchableOpacity,
  Text,
  Image,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import AppButton from '../../../components/UI/AppButton';
import AppCheckbox from '../../../components/UI/AppCheckbox';
import AppInput from '../../../components/UI/AppInput';
import AppSelect, {
  SelectItem,
} from '../../../components/UI/AppSelect/AppSelect';
import Validation, {required} from '../../../components/UI/Validation';
import colors from '../../../constants/colors';
import { PUSH } from '../../../redux/actions/error_action';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {IKCData} from '../../../services/KvalificaServices';
import {ICitizenshipCountry} from '../../../services/PresentationServive';

export enum ESex {
  male = 'male',
  female = 'female',
}

interface IProps {
  notEditable: boolean | undefined;
  selectedCountry: ICitizenshipCountry | undefined;
  selectedCountry2: ICitizenshipCountry | undefined;
  countryes: ICitizenshipCountry[] | undefined;
  onSetCountry: (country: ICitizenshipCountry) => void;
  onSetCountry2: (country: ICitizenshipCountry | undefined) => void;
  kycData: IKCData | undefined;
  onUpdateData: (c: IKCData | undefined) => void;
  onComplate: () => void;
}

const ValidationContext = 'userVerification8';

const StepEight: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [countryErrorStyle, setCountryErrorStyle] = useState<
    StyleProp<ViewStyle>
  >({});
  const [countryErrorStyle2, setCountryErrorStyle2] = useState<
    StyleProp<ViewStyle>
  >({});
  const [countryVisible, setCountryVisible] = useState(false);
  const [countryVisible2, setCountryVisible2] = useState(false);
  const [hasDualSitizenship, setHasDualSitizenship] = useState(false);
  const disapatch = useDispatch();

  const nextHandler = () => {
    if(!props.kycData?.sex) {
        disapatch(PUSH(translate.t('generalErrors.fillOutField')));
        return;
    }
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
    if(props.notEditable) {
      return;
    }
    let data = {...props.kycData};
    data.sex = value;
    props.onUpdateData(data);
  };

  useEffect(() => {
    if (!hasDualSitizenship) props.onSetCountry2?.(undefined);
  }, [hasDualSitizenship]);

  return (
    <View style={styles.container}>
      <View style={styles.addressContainer}>
        <AppInput
          placeholder={translate.t('verification.dateOfBirth')}
          onChange={birthDate => setBirthDate(birthDate)}
          value={props.kycData?.birthDate}
          customKey="birthDate"
          requireds={[required]}
          style={styles.input}
          context={ValidationContext}
        />

        <View style={styles.sexCont}>
          <Text style={styles.sexTitle}>{translate.t('verification.sex')}</Text>
          <AppCheckbox
          activeColor={colors.primary}
            clicked={function (value: boolean): void {
              if(value) {
                setSex(ESex.male)
              }
            }}
            label={translate.t('common.male')}
            customKey={'male'}
            context={''}
            value={props.kycData?.sex === ESex.male}
          />

          <AppCheckbox
          activeColor={colors.primary}
          style={styles.female}
            clicked={function (value: boolean): void {
              if(value) {
                setSex(ESex.female)
              }
            }}
            label={translate.t('common.female')}
            customKey={'female'}
            context={''}
            value={props.kycData?.sex === ESex.female}
          />
        </View>

        <View style={[styles.countryBox, countryErrorStyle]}>
          {props.selectedCountry ? (
            <SelectItem
              itemKey="countryName"
              defaultTitle={translate.t('verification.chooseCountry')}
              item={props.selectedCountry}
              onItemSelect={() => !props.notEditable && setCountryVisible(true)}
              style={styles.countryItem}
            />
          ) : (
            <TouchableOpacity
              onPress={() => setCountryVisible(true)}
              style={[styles.countrySelectHandler]}>
              <Text style={styles.countryPlaceholder}>
                {translate.t('verification.chooseCountry')}
              </Text>
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
              props?.onSetCountry?.(item);
              setCountryVisible(false);
            }}
            onToggle={() =>
              !props.notEditable && setCountryVisible(!countryVisible)
            }
          />
        </View>

        <AppCheckbox
          style={styles.checkbox}
          activeColor={colors.primary}
          label={translate.t('verification.dualSitizenship')}
          clicked={() =>
            !props.notEditable && setHasDualSitizenship(!hasDualSitizenship)
          }
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
                defaultTitle={translate.t('verification.chooseCountry')}
                item={props.selectedCountry2}
                onItemSelect={() => setCountryVisible2(true)}
                style={styles.countryItem}
              />
            ) : (
              <TouchableOpacity
                onPress={() => setCountryVisible2(true)}
                style={[styles.countrySelectHandler]}>
                <Text style={styles.countryPlaceholder}>
                  {translate.t('verification.chooseCountry')}
                </Text>
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
                props?.onSetCountry2?.(item);
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
  sexCont: {
    alignItems: 'flex-start', 
    marginTop: 20
  },
  sexTitle: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 17,
    color: colors.placeholderColor,
    marginBottom: 10
  },
  female: {
    marginTop: 15
  }
});

export default StepEight;
