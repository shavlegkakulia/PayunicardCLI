import React, {createRef, useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import {FetchUserDetail} from './../redux/actions/user_actions';
import colors from '../constants/colors';
import {useDispatch, useSelector} from 'react-redux';
import {
  IAuthState,
  IGlobalState,
} from '../redux/action_types/auth_action_types';
import NetworkService from '../services/NetworkService';
import NavigationService from '../services/NavigationService';
import {tabHeight} from '../navigation/TabNav';
import CardService, {IGetBarcodeRequest} from '../services/CardService';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../redux/action_types/user_action_types';
import {TYPE_UNICARD} from '../constants/accountTypes';
import {getString} from '../utils/Converter';
import {IAccountBallance} from '../services/UserService';
import PaginationDots from '../components/PaginationDots';
import {DrawerLayout} from 'react-native-gesture-handler';

const UnicardView = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [unicards, setUnicards] = useState<IAccountBallance[] | undefined>();
  const [barcodes, setBarcodes] = useState<string[]>();
  const [step, setStep] = useState<number>(0);
  const userState = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const carouselRef = createRef<ScrollView>();

  const GenerateBarcode = (accountNumber: string) => {
    setIsLoading(true);
    const data: IGetBarcodeRequest = {
      input: accountNumber,
    };
    CardService.GenerateBarcode(data).subscribe({
      next: Response => {
        setBarcodes(prevState => [
          ...(prevState || []),
          getString(Response.data.data?.barcode),
        ]);
      },
      complete: () => setIsLoading(false),
      error: () => {
        setIsLoading(false);
      },
    });
  };

  const onChange = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.y / nativeEvent.layoutMeasurement.height,
      );
      if (slide != step) {
        setStep(slide);
      }
    }
  };

  useEffect(() => {
    if (unicards?.length) {
      unicards.map(u => GenerateBarcode(getString(u?.accountNumber)));
    }
  }, [unicards]);

  const fragmentStyle = {
    height: Dimensions.get('window').height - tabHeight,
  };

  useEffect(() => {
    setUnicards(userState.userAccounts?.filter(ua => ua.type === TYPE_UNICARD));
  }, [userState.userAccounts]);

  return (
    <View style={style.screenContainer}>
      <View style={style.carouselContainer}>
        <ScrollView
          ref={carouselRef}
          onScroll={({nativeEvent}) => onChange(nativeEvent)}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}>
          {unicards?.map((uc, index) => (
            <View
              style={{
                ...style.unicardItem,
                ...fragmentStyle,
                paddingBottom: tabHeight,
              }}
              key={uc.accountNumber}>
              <View>
                <Text style={style.barCodeText}>
                  {unicards[index]?.accountNumber?.replace(
                    /\b(\d{4})(\d{4})(\d{4})(\d{4})\b/,
                    '$1  $2  $3  $4',
                  )}
                </Text>

                <Image
                  source={require('./../assets/images/unicard-card.png')}
                  style={style.unicardCard}
                  resizeMode="contain"
                />
                <Image
                  source={{
                    uri: `data:image/png;base64,${(barcodes || [])[index]}`,
                  }}
                  style={style.barCode}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={style.dotsContainer}>
          {unicards && (
            <PaginationDots
              length={unicards?.length}
              step={step}
              unactiveDotColor={colors.black}
              activeDotColor={colors.primary}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const DashboardLayoutRightDarwer: React.FC = props => {
  const sideDraver = useRef<DrawerLayout | null>();
  const screenWidth = Dimensions.get('window').width;
  return (
    <DrawerLayout
      drawerWidth={screenWidth}
      drawerLockMode={'unlocked'}
      drawerPosition="right"
      keyboardDismissMode="on-drag"
      drawerBackgroundColor={colors.white}
      ref={drawer => {
        sideDraver.current = drawer;
        NavigationService.setDrawerClose(sideDraver.current?.closeDrawer, 1);
        NavigationService.setDrawerOpen(sideDraver.current?.openDrawer, 1);
      }}
      renderNavigationView={() => <UnicardView />}>
      <View style={style.container}>{props.children}</View>
    </DrawerLayout>
  );
};

const DashboardLayout: React.FC = props => {
  const dispatch = useDispatch();
  const state = useSelector<IGlobalState>(
    state => state.AuthReducer,
  ) as IAuthState;

  useEffect(() => {
    NetworkService.CheckConnection(() => {
      dispatch(FetchUserDetail(state.remember));
    });
  }, []);

  return <DashboardLayoutRightDarwer children={props.children} />;
};

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
    paddingBottom: tabHeight,
  },
  botomTab: {
    flexDirection: 'row',
    height: 50,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  tabIcon: {
    width: 40,
    height: 40,
  },
  drawerWidth: {
    width: '100%',
  },
  unicardItem: {
    position: 'relative',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  unicardCard: {
    maxHeight: 500,
  },
  barCode: {
    height: 65,
    width: 460,
    transform: [{rotate: '90deg'}],
    position: 'absolute',
    top: 215,
    left: -117,
  },
  barCodeText: {
    transform: [{rotate: '90deg'}],
    elevation: 555,
    position: 'absolute',
    top: 240,
    left: 110,
  },
  screenContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dotsContainer: {
    position: 'absolute',
    right: 20,
    transform: [{rotate: '90deg'}],
  },
});

export default DashboardLayout;
