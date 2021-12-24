import React, {useCallback, useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-navigation';
import {useDispatch, useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import SUBSCRIBTION_KEYS from '../../../constants/subscribtionKeys';
import {en_us, ka_ge} from '../../../lang';
import Routes from '../../../navigation/routes';
import {use} from '../../../redux/actions/translate_actions';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {
  IGloablState,
  IUserState,
} from '../../../redux/action_types/user_action_types';
import NavigationService from '../../../services/NavigationService';
import {subscriptionService} from '../../../services/subscriptionService';
import screenStyles from '../../../styles/screens';
import DashboardLayout from '../../DashboardLayout';
import storage from './../../../services/StorageService';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import UserService, {
  IUpdateUserProfileImageRequest,
} from '../../../services/UserService';
import {getString} from '../../../utils/Converter';
import Cover from '../../../components/Cover';
import {FetchUserAccounts, FetchUserAccountStatements, FetchUserDetail, FetchUserProducts, FetchUserTotalBalance} from '../../../redux/actions/user_actions';
import ActionSheetCustom from './../../../components/actionSheet';
import AppButton from '../../../components/UI/AppButton';
import BiometricAuthScreen from './biometric';
import FilesService, {
  ImageType,
  IUploadFileRequest,
} from '../../../services/FilesService';
import FingerprintScanner from 'react-native-fingerprint-scanner';
import { debounce } from '../../../utils/utils';

const Settings: React.FC = () => {
 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getPhoto, setGetPhoto] = useState<boolean>(false);
  const [isPassCodeEnabled, setIsPassCodeEnabled] = useState<boolean>(false);
  const [biometricAvailable, setBiometricAvailable] = useState<boolean>(true);
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState<boolean>(false);
  const [startBiometric, setStartBiometric] = useState<boolean>(false);
  const [isSensorAvailable, setIsSensorAvailable] = useState<
    boolean | undefined
  >(undefined);
  const [{ka, en}, setLangActive] = useState({ka: false, en: false});
  const userState = useSelector<IGloablState>(
    state => state.UserReducer,
  ) as IUserState;
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const dispatch = useDispatch();

  const togglePassCodeSwitch = () => {
    storage.getItem('PassCode').then(async data => {
      if (data === null || !data) {
        NavigationService.navigate(Routes.setPassCode);
      } else {
        const isEnabled = await storage.getItem('PassCodeEnbled');
        if (isEnabled !== null) {
          await storage.removeItem('PassCodeEnbled');
          await storage.removeItem('Biometric');
          setIsPassCodeEnabled(false);
        } else {
          await storage.setItem('PassCodeEnbled', '1');
          setIsPassCodeEnabled(true);
        }
      }
    });
  };

  const GoToPassCode = () => NavigationService.navigate(Routes.setPassCode);

  const GoToBiometric = () => {
    setStartBiometric(true);
  };

  const toggleFaceIdSwitch = () => {
    storage.getItem('Biometric').then(async isEnabled => {
      if (isEnabled !== null) {
        await storage.removeItem('Biometric');
        setIsFaceIdEnabled(false);
      } else {
        await storage.setItem('Biometric', '*');
        setIsFaceIdEnabled(true);
      }
    });
  };

  const uploadImage = (name: string, img: string) => {
    if (!name || !img || isLoading) return;
    setIsLoading(true);

    const data: IUploadFileRequest = {
      fileName: name,
      getColor: false,
      type: ImageType.UserProfileImage,
      image: img,
    };
    FilesService.uploadImage(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          updateUserProfileImage(getString(Response.data.data?.imageUrl));
        }
      },
      error: () => setIsLoading(false),
    });
  };

  const updateUserProfileImage = (url: string) => {
    const data: IUpdateUserProfileImageRequest | undefined = {
      imageUrl: url,
    };
    UserService.updateUserProfileImage(data).subscribe({
      next: Response => {
        if (Response.data.ok) {
          dispatch(FetchUserDetail(false, true));
        }
      },
      complete: () => {
        setIsLoading(false);
        closeChoosePhotos();
      },
      error: err => {
        console.log(err);
        setIsLoading(false);
        closeChoosePhotos();
      },
    });
  };

  const choosePhoto = async () => {
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: 1,
      includeBase64: true,
      quality: 0.2,
      maxWidth: 300,
      maxHeight: 300,
    });
    if (result.assets) {
      const {base64, fileName} = result.assets[0];
      //console.log(base64)
      uploadImage(getString(fileName), getString(base64));
      // updateUserProfileImage(getString(base64).replace(/'/g, "'"));
    }
  };

  const ctakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.2,
      maxWidth: 300,
      maxHeight: 300,
    }, (r) => {
      console.log(r)
    });
    if (result.assets) {
      const {base64, fileName} = result.assets[0];
      uploadImage(getString(fileName), getString(base64));
      //updateUserProfileImage(getString(base64).replace(/'/g, "'"));
    }
  };

  const refetchDelay = debounce((e: Function) => e(), 1000);

  const changeActiveLang = useCallback(
    (key: string) => {
      if (key === ka_ge) {
        setLangActive({
          ka: true,
          en: false,
        });
      } else {
        setLangActive({
          ka: false,
          en: true,
        });
      }

      dispatch(use(key));

      refetchDelay(() => {
        dispatch(FetchUserProducts());
        dispatch(FetchUserAccounts());
        dispatch(FetchUserTotalBalance());
        dispatch(FetchUserAccountStatements({}));
      });
    },
    [ka, en],
  );

  const goPwdChange = () => {
    NavigationService.navigate(Routes.PasswordChangeStepFour, {
      email: userState.userDetails?.email || userState.userDetails?.username,
      backRoute: Routes.Settings,
      minimizedContent: true,
    });
  };

  const goToEditUser = () => {
    NavigationService.navigate(Routes.EditUserInfo);
  };

  const goToVerification = () => {
    NavigationService.navigate(Routes.VerificationStep4, {verificationStep: 4, retry: true});
  }

  const init = async () => {
    const PassCodeExists = await storage.getItem('PassCode');
    const PassCodeEnbledExists = await storage.getItem('PassCodeEnbled');
    const BiometricExists = await storage.getItem('Biometric');

    if (PassCodeExists !== null && PassCodeEnbledExists !== null) {
      setIsPassCodeEnabled(true);

      if (BiometricExists !== null) {
        setIsFaceIdEnabled(true);
      }
    }
  };

  const openChoosePhotos = () => {
    setGetPhoto(true);
  };

  const closeChoosePhotos = () => {
    setGetPhoto(false);
  };

  useEffect(() => {
    init().then();
  }, []);

  useEffect(() => {
    subscriptionService.getData().subscribe(data => {
      if (data?.key === SUBSCRIBTION_KEYS.PWDCODE_UPDATED) {
        init().then();
      }
    });

    return () => subscriptionService.clearData();
  }, []);

  useEffect(() => {
    setLangActive({
      ka: translate.key === ka_ge,
      en: translate.key === en_us,
    });
  }, []);

  const onBiometric = () => {
    if (biometricAvailable) {
      if (!isPassCodeEnabled) {
        togglePassCodeSwitch();
        return;
      }

      toggleFaceIdSwitch();
    }
  };

  const getStatus = (status: boolean, available?: boolean | undefined) => {
    if (available === false) setBiometricAvailable(false);
    if (!status) setStartBiometric(false);
  };

  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then(() => {
        setIsSensorAvailable(true);
      })
      .catch(() => setIsSensorAvailable(false));
  }, []);

  const actionSheetHeight = 300;

  return (
    <DashboardLayout>
      <BiometricAuthScreen start={startBiometric} returnStatus={getStatus} />
      <SafeAreaView style={styles.content}>
        <ScrollView style={screenStyles.screenContainer}>
          <View>
            <View style={styles.profile}>
              <View style={styles.coverBox}>
                <Image
                  source={{uri: userState.userDetails?.imageUrl}}
                  style={styles.userImg}
                />
              </View>
              <Text style={styles.userName}>
                {userState.userDetails?.username}
              </Text>
            </View>
          </View>
          <View>
            <TouchableOpacity style={styles.navItem} onPress={goToEditUser}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-man-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>{translate.t('settings.personalInfo')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={goPwdChange}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-change-pwd-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>{translate.t('settings.changePassword')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={GoToPassCode}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-pass-code-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>{translate.t('settings.passCode')}</Text>
              </View>
              <Switch
                style={styles.check}
                trackColor={{
                  false: colors.inputBackGround,
                  true: colors.primary,
                }}
                thumbColor={isPassCodeEnabled ? colors.white : colors.white}
                ios_backgroundColor={colors.inputBackGround}
                onValueChange={togglePassCodeSwitch}
                value={isPassCodeEnabled}
              />
            </TouchableOpacity>
            {isSensorAvailable !== undefined && isSensorAvailable !== false && (
              <TouchableOpacity style={styles.navItem} onPress={GoToBiometric}>
                <View style={styles.navItemDetail}>
                  <Image
                    source={require('./../../../assets/images/icon-finger-primary-40x40.png')}
                    style={styles.navItemIcon}
                  />
                  <Text style={styles.navItemTitle}>
                  {translate.t('settings.fingerPrint')}
                  </Text>
                </View>
                <Switch
                  style={styles.check}
                  trackColor={{
                    false: colors.inputBackGround,
                    true: colors.primary,
                  }}
                  thumbColor={isFaceIdEnabled ? colors.white : colors.white}
                  ios_backgroundColor={colors.inputBackGround}
                  onValueChange={onBiometric}
                  value={isFaceIdEnabled}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity style={styles.navItem} onPress={openChoosePhotos}>
              <View style={styles.navItemDetail}>
                <Cover
                  localImage={require('./../../../assets/images/icon-photo-take-40x40.png')}
                  isLoading={isLoading}
                  style={styles.cover}
                />
                <Text style={styles.navItemTitle}>{translate.t('settings.changePhoto')}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={goToVerification} activeOpacity={1} >
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-verification-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>{translate.t('verification.verification')}</Text>
              </View>
            </TouchableOpacity>
          </View>
          <View style={styles.langSwither}>
            <TouchableOpacity
              style={styles.langItem}
              onPress={changeActiveLang.bind(this, ka_ge)}>
              <Text style={[styles.langTitle, ka && styles.activeLang]}>
                ქართული
              </Text>
              {ka && (
                <Image
                  source={require('./../../../assets/images/icon-check-primary-10x7.png')}
                />
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.langItem}
              onPress={changeActiveLang.bind(this, en_us)}>
              <Text style={[styles.langTitle, en && styles.activeLang]}>
                English
              </Text>
              {en && (
                <Image
                  source={require('./../../../assets/images/icon-check-primary-10x7.png')}
                />
              )}
            </TouchableOpacity>
          </View>
        </ScrollView>
        <ActionSheetCustom
          scrollable={true}
          hasDraggableIcon={true}
          visible={getPhoto}
          hasScroll={false}
          height={actionSheetHeight}
          onPress={closeChoosePhotos}>
          <View style={styles.actionContainer}>
            <AppButton
              style={styles.action}
              title={translate.t('settings.takePhoto')}
              onPress={ctakePhoto}
            />
            <AppButton
              style={styles.action}
              title={translate.t('settings.galery')}
              onPress={choosePhoto}
            />
            <AppButton
              style={styles.action}
              title={translate.t('common.cancel')}
              onPress={closeChoosePhotos}
              color={colors.black}
              backgroundColor={colors.inputBackGround}
            />
          </View>
        </ActionSheetCustom>
      </SafeAreaView>
    </DashboardLayout>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  coverBox: {
    width: 40,
    height: 40,
    borderColor: '#94DD34',
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profile: {
    height: 73,
    marginHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#F1F1F1',
    borderBottomWidth: 1,
    marginBottom: 16,
  },
  userImg: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  userName: {
    marginLeft: 10,
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 18.8,
  },
  check: {
    alignSelf: 'flex-start',
  },
  navItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    marginHorizontal: 20,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navItemDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navItemIcon: {
    width: 40,
    height: 40,
    marginRight: 13,
  },
  navItemTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  langSwither: {
    borderTopColor: '#F1F1F1',
    borderTopWidth: 1,
    marginTop: 16,
    marginHorizontal: 20,
  },
  langItem: {
    flexDirection: 'row',
    paddingVertical: 16,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  langTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 14,
    lineHeight: 17,
    color: colors.labelColor,
  },
  activeLang: {
    fontFamily: 'FiraGO-Medium',
    color: colors.labelColor,
  },
  cover: {
    backgroundColor: colors.none,
    marginRight: 13,
  },
  actionContainer: {
    paddingVertical: 20,
    paddingHorizontal: 30,
  },
  action: {
    marginBottom: 20,
  },
});

export default Settings;
