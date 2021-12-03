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
import {FetchUserDetail} from '../../../redux/actions/user_actions';
import ActionSheetCustom from './../../../components/actionSheet';
import AppButton from '../../../components/UI/AppButton';

const Settings: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [getPhoto, setGetPhoto] = useState<boolean>(false);
  const [isPassCodeEnabled, setIsPassCodeEnabled] = useState<boolean>(false);
  const [isFaceIdEnabled, setIsFaceIdEnabled] = useState<boolean>(false);
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
          setIsPassCodeEnabled(false);
        } else {
          await storage.setItem('PassCodeEnbled', '1');
          setIsPassCodeEnabled(true);
        }
      }
    });
  };

  const GoToPassCode = () => NavigationService.navigate(Routes.setPassCode);

  const toggleFaceIdSwitch = () =>
    setIsFaceIdEnabled(previousState => !previousState);

  const updateUserProfileImage = (url: string) => {
    if (!url || isLoading) return;
    setIsLoading(true);
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
      error: () => {
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
      const {base64} = result.assets[0];
      updateUserProfileImage(getString(base64).replace(/'/g, "'"));
    }
  };

  const ctakePhoto = async () => {
    const result = await launchCamera({
      mediaType: 'photo',
      includeBase64: true,
      quality: 0.2,
      maxWidth: 300,
      maxHeight: 300,
    });
    if (result.assets) {
      const {base64} = result.assets[0];
      console.log(base64)
      updateUserProfileImage(getString(base64).replace(/'/g, "'"));
    }
  }

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
    },
    [ka, en],
  );

  const goPwdChange = () => {
    NavigationService.navigate(Routes.ResetPasswordOtp, {
      email: userState.userDetails?.email || userState.userDetails?.username,
      phone: userState.userDetails?.phone,
      personalNumber: userState.userDetails?.personalId,
      backRoute: Routes.Settings,
      minimizedContent: true,
    });
  };

  const goToEditUser = () => {
    NavigationService.navigate(Routes.EditUserInfo);
  };

  const init = async () => {
    const PassCodeExists = await storage.getItem('PassCode');
    const PassCodeEnbledExists = await storage.getItem('PassCodeEnbled');

    if (PassCodeExists !== null && PassCodeEnbledExists !== null) {
      setIsPassCodeEnabled(true);
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

  const actionSheetHeight = 300;

  return (
    <DashboardLayout>
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
                <Text style={styles.navItemTitle}>პერსონალური ინფორმაცია</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={goPwdChange}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-change-pwd-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>პაროლის შეცვლა</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={GoToPassCode}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-pass-code-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>პას კოდი</Text>
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
            <TouchableOpacity style={styles.navItem}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-face-id-primary-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>სახის ამოცნობით შესვლა</Text>
              </View>
              <Switch
                style={styles.check}
                trackColor={{
                  false: colors.inputBackGround,
                  true: colors.primary,
                }}
                thumbColor={isFaceIdEnabled ? colors.white : colors.white}
                ios_backgroundColor={colors.inputBackGround}
                onValueChange={toggleFaceIdSwitch}
                value={isFaceIdEnabled}
              />
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem} onPress={openChoosePhotos}>
              <View style={styles.navItemDetail}>
                <Cover
                  localImage={require('./../../../assets/images/icon-photo-take-40x40.png')}
                  isLoading={isLoading}
                  style={styles.cover}
                />
                <Text style={styles.navItemTitle}>ფოტო სურათის შეცვლა</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={styles.navItem}>
              <View style={styles.navItemDetail}>
                <Image
                  source={require('./../../../assets/images/icon-verification-40x40.png')}
                  style={styles.navItemIcon}
                />
                <Text style={styles.navItemTitle}>ვერიფიკაცია</Text>
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
            <AppButton style={styles.action} title="სურათის გადაღება" onPress={ctakePhoto} />
            <AppButton style={styles.action} title="ტელეფონის გალერეა" onPress={choosePhoto} />
            <AppButton style={styles.action} title="გაუქმება" onPress={closeChoosePhotos} color={colors.black} backgroundColor={colors.inputBackGround} />
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
    paddingHorizontal: 30
  },
  action: {
    marginBottom: 20
  }
});

export default Settings;
