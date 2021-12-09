import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  StyleSheet,
  Text,
  Image,
} from 'react-native';
import { useSelector } from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoading';
import AppInput from '../../../components/UI/AppInput';
import colors from '../../../constants/colors';
import {tabHeight} from '../../../navigation/TabNav';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import PresentationServive, {
  ICitizenshipCountry,
} from '../../../services/PresentationServive';
import UserService, {
  IGetUserProfileDataResponse,
} from '../../../services/UserService';
import {getString} from '../../../utils/Converter';

const USERCONTEXT = 'USERCONTEXT';

const EditUserInfo: React.FC = () => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [profileData, setProfileData] = useState<
    IGetUserProfileDataResponse | undefined
  >();
  const [profileDataEdited, setProfileDataEdited] = useState<
    IGetUserProfileDataResponse | undefined
  >();
  const [isLoading, setIsLoading] = useState(false);
  const [countryes, setCountries] = useState<
    ICitizenshipCountry[] | undefined
  >();

  const getCitizenshipCountries = () => {
    if (isLoading) return;

    setIsLoading(true);
    PresentationServive.GetCitizenshipCountries().subscribe({
      next: Response => {
        setCountries(Response.data.data?.countries);
      },
      complete: () => {
        setIsLoading(false);
      },
      error: () => {
        setIsLoading(false);
      },
    });
  };

  useEffect(() => {
    if (!profileData && !isLoading) {
      setIsLoading(true);
      UserService.getUserProfileData().subscribe({
        next: Response => {
          if (Response.data.ok) {
            console.log(Response.data.data);
            setProfileData(Response.data.data);
            setProfileDataEdited(Response.data.data);
          }
        },
        complete: () => {
          setIsLoading(false);
        },
        error: () => {
          setIsLoading(false);
        },
      });
    }
  }, [profileData]);

  useEffect(() => {
    getCitizenshipCountries();
  }, []);

  if (isLoading) {
    return <FullScreenLoader />;
  }

  const country = countryes?.filter(
    c => c.countryID === profileDataEdited?.factCountryID,
  );

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <KeyboardAvoidingView
        behavior="padding"
        keyboardVerticalOffset={0}
        style={styles.avoid}>
        <View style={styles.container}>
          {profileDataEdited?.phone !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>მობილურის ნომერი</Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.phone}
                onChange={phone => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.phone = phone;
                    return user;
                  });
                }}
                placeholder="მობილურის ნომერი"
                customKey="mobile"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.name !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>სახელი</Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.name}
                onChange={name => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.name = name;
                    return user;
                  });
                }}
                placeholder="სახელი"
                customKey="name"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.surname !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>გვარი</Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.surname}
                onChange={surname => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.surname = surname;
                    return user;
                  });
                }}
                placeholder="გვარი"
                customKey="lname"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.birthDate !== undefined &&
            profileDataEdited?.birthDate !== null && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>დაბადების თარიღი</Text>
                <AppInput
                  editable={false}
                  value={profileDataEdited?.birthDate}
                  onChange={() => {}}
                  placeholder="00/00/00"
                  customKey="date"
                  context={USERCONTEXT}
                />
              </View>
            )}
          {profileDataEdited?.personalID !== undefined &&
            profileDataEdited?.personalID !== null && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>პირადი ნომერი</Text>
                <AppInput
                  value={profileDataEdited?.personalID}
                  onChange={() => {}}
                  placeholder="პირადი ნომერი"
                  customKey="pn"
                  context={USERCONTEXT}
                />
              </View>
            )}
          {profileDataEdited?.email !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ელფოსტა</Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.email}
                onChange={email => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.email = email;
                    return user;
                  });
                }}
                placeholder="ელფოსტა"
                customKey="email"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.factAddress !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{translate.t('verification.address')}</Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.factAddress}
                onChange={factAddress => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.factAddress = factAddress;
                    return user;
                  });
                }}
                placeholder={translate.t('verification.address')}
                customKey="address"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.legalAddress !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>{translate.t('verification.address')}</Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.legalAddress}
                customKey='legalAddress'
                onChange={legalAddress => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.legalAddress = legalAddress;
                    return user;
                  });
                }}
                placeholder={translate.t('verification.address')}
                context={USERCONTEXT}
              />
            </View>
          )}
          {country !== undefined && country?.length && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ქვეყანა</Text>
              <AppInput
                editable={false}
                value={country[0].countryName}
                onChange={() => {}}
                placeholder="ქვეყანა"
                customKey="mobile"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.factCity !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>ქალაქი/მუნიციპალიტეტი </Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.factCity}
                onChange={factCity => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.factCity = factCity;
                    return user;
                  });
                }}
                placeholder="ქალაქი/მუნიციპალიტეტი "
                customKey="city"
                context={USERCONTEXT}
              />
            </View>
          )}
          {profileDataEdited?.factPostalCode !== undefined && (
            <View style={styles.inputContainer}>
              <Text style={styles.label}>საფოსტო ინდექსი </Text>
              <AppInput
                editable={false}
                value={profileDataEdited?.factPostalCode}
                onChange={factPostalCode => {
                  setProfileDataEdited(prev => {
                    const user = {...prev};
                    user.factPostalCode = factPostalCode;
                    return user;
                  });
                }}
                placeholder="საფოსტო ინდექსი"
                customKey="postal"
                context={USERCONTEXT}
              />
            </View>
          )}

          <View>
            <ScrollView horizontal={true}>
              {profileDataEdited?.idPhotos?.documentBackSide !== undefined && (
                <Image
                  source={{uri: profileDataEdited?.idPhotos?.documentBackSide}}
                  resizeMode="contain"
                  style={styles.docImages}
                />
              )}
              {profileDataEdited?.idPhotos?.documentFrontSide !== undefined && (
                <Image
                  source={{uri: profileDataEdited?.idPhotos?.documentFrontSide}}
                  resizeMode="contain"
                  style={styles.docImages}
                />
              )}
            </ScrollView>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    paddingBottom: tabHeight,
    paddingTop: 20,
  },
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontFamily: 'FiraGO-Book',
    fontSize: 10,
    lineHeight: 12,
    color: colors.labelColor,
    marginLeft: 20,
    marginBottom: 6,
  },
  docImages: {
    width: 100,
    height: 100,
    borderRadius: 10,
  },
});

export default EditUserInfo;
