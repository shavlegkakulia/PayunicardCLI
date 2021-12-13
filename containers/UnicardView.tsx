import React, {createRef, useEffect, useState} from 'react';
import {
  Dimensions,
  Image,
  NativeScrollEvent,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import PaginationDots from '../components/PaginationDots';
import {TYPE_UNICARD} from '../constants/accountTypes';
import colors from '../constants/colors';
import {tabHeight} from '../navigation/TabNav';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../redux/action_types/user_action_types';
import CardService, {IGetBarcodeRequest} from '../services/CardService';
import {IAccountBallance} from '../services/UserService';
import {getString} from '../utils/Converter';

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
    <View style={styles.screenContainer}>
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={carouselRef}
          onScroll={({nativeEvent}) => onChange(nativeEvent)}
          showsVerticalScrollIndicator={false}
          pagingEnabled={true}>
          {unicards?.map((uc, index) => (
            <View
              style={{
                ...styles.unicardItem,
                ...fragmentStyle,
                paddingBottom: tabHeight,
              }}
              key={uc.accountNumber}>
              <View>
                <Text style={styles.barCodeText}>
                  {unicards[index]?.accountNumber?.replace(
                    /\b(\d{4})(\d{4})(\d{4})(\d{4})\b/,
                    '$1  $2  $3  $4',
                  )}
                </Text>

                <Image
                  source={require('./../assets/images/unicard-card.png')}
                  style={styles.unicardCard}
                  resizeMode="contain"
                />
                <Image
                  source={{
                    uri: `data:image/png;base64,${(barcodes || [])[index]}`,
                  }}
                  style={styles.barCode}
                />
              </View>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
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

const styles = StyleSheet.create({
  screenContainer: {
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'center',
  },
  unicardItem: {
    position: 'relative',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'center',
  },
  carouselContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barCodeText: {
    transform: [{rotate: '90deg'}],
    elevation: 555,
    position: 'absolute',
    top: 240,
    left: 110,
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
  dotsContainer: {
    position: 'absolute',
    right: 20,
    transform: [{rotate: '90deg'}],
  },
});

export default UnicardView;
