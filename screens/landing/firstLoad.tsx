import React, {useState, useCallback, useEffect} from 'react';
import {View, Image, Text, StyleSheet, NativeScrollEvent, Platform, TouchableOpacity} from 'react-native';
import AppButton from './../../components/UI/AppButton';
import PaginationDots from './../../components/PaginationDots';
import Colors from './../../constants/colors';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from './../../redux/action_types/translate_action_types';
import {useDispatch, useSelector} from 'react-redux';
import {useDimension} from '../../hooks/useDimension';
import {ScrollView} from 'react-native-gesture-handler';
import {createRef} from 'react';
import { use } from '../../redux/actions/translate_actions';
import colors from './../../constants/colors';
import analytics from '@react-native-firebase/analytics';
import Routes from '../../navigation/routes';

interface IPageProps {
  Complate: () => void;
}

const FirstLoad: React.FC<IPageProps> = props => {
  const [step, setStep] = useState<number>(0);
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const carouselRef = createRef<ScrollView>();
  const dimension = useDimension();
  const dispatch = useDispatch();

  useEffect(() => {
    (async() => {
      await analytics().logScreenView({
        screen_name: Routes.FirstLoad,
        screen_class: Routes.FirstLoad,
      });
    })();
  }, []);

  const onChange = (nativeEvent: NativeScrollEvent) => {
    if (nativeEvent) {
      const slide = Math.ceil(
        nativeEvent.contentOffset.x / nativeEvent.layoutMeasurement.width,
      );
      if (slide != step) {
        //if(slide === 3) return;
        setStep(slide);
      }
    }
  };

  const fragments = [
    {
      desc: translate.t('onboard.firstScreenDesc'),
      imgUrl: require('../../assets/images/load_screen_1.png'),
    },
    {
      desc: translate.t('onboard.secondScreenDesc'),
      imgUrl: require('../../assets/images/load_screen_2.png'),
    },
    {
      desc: translate.t('onboard.thirdScreenDesc'),
      imgUrl: require('../../assets/images/load_screen_3.png'),
    },
    {
      desc: translate.t('onboard.fourthScreenDesc'),
      imgUrl: require('../../assets/images/load_screen_4.png'),
    },
  ];
  const nextStep = () => {
    setStep(s => {
      if (s >= 3) {
        props.Complate();
        return s;
      }
      moveNext(s + 1);
      return s + 1;
    });
  };

  const moveNext = (index: number) => {
    carouselRef.current?.scrollTo({
      x: index * dimension.width,
      animated: true,
    });
  };

  const fragmentStyle = {
    width: dimension.width,
  };
  return (
    <View style={styles.screenContainer}>
      <View style={styles.carouselContainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.authorizeText}>
          {' '}
        </Text>
        <TouchableOpacity
          onPress={async () => {
            dispatch(use(translate.next()));
          }}>
          <Text style={styles.langSwitchText}>{`Switch to ${
            translate.key === 'en' ? 'GE' : 'EN'
          }`}</Text>
        </TouchableOpacity>
      </View>
        <ScrollView
          ref={carouselRef}
          onScroll={({nativeEvent}) => onChange(nativeEvent)}
          showsHorizontalScrollIndicator={false}
          pagingEnabled={true}
          horizontal>
          {fragments.map((fragment, index) => (
            <View key={index} style={fragmentStyle}>
              <View style={styles.imageContainer}>
                <Image
                  style={styles.image}
                  source={fragment.imgUrl}
                  resizeMode={'contain'}
                />
              </View>
              <Text style={styles.desc}>{fragment.desc}</Text>
            </View>
          ))}
        </ScrollView>
        <View style={styles.dotsContainer}>
          <PaginationDots length={4} step={step} />
        </View>
        <View style={styles.nextButtonView}>
          <AppButton title={translate.t('common.next')} onPress={nextStep} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    paddingVertical: 16,
    justifyContent: 'flex-end',
    width: '100%',
    alignSelf: 'center',
  },
  image: {
    width: 230,
    //height: 200
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  desc: {
    fontSize: 23,
    color: Colors.black,
    alignSelf: 'center',
    fontFamily: 'FiraGO-Bold',
    paddingBottom: 36,
    textAlign: 'center',
    maxWidth: 327,
  },
  carouselContainer: {
    flex: 1,
  },
  dotsContainer: {
    padding: 28,
    width: '100%',
    alignSelf: 'center',
  },
  nextButtonView: {
    width: '100%',
    maxWidth: 327,
    paddingBottom: 54,
    alignSelf: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 25,
    width: '100%',
    marginTop: Platform.OS === 'ios' ? 40 : 0,
    paddingHorizontal: 30
  },
  authorizeText: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
  },
  langSwitchText: {
    fontFamily: 'FiraGO-Regular',
    fontSize: 14,
    lineHeight: 16,
    color: colors.black,
  },
});

export default FirstLoad;
