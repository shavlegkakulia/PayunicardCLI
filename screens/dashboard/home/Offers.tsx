import React, {useEffect, useState} from 'react';
import {
  Image,
  ScrollView,
  Text,
  View,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useSelector} from 'react-redux';
import PaginationDots from '../../../components/PaginationDots';
import colors from '../../../constants/colors';
import {useDimension} from '../../../hooks/useDimension';
import Routes from '../../../navigation/routes';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import NavigationService from '../../../services/NavigationService';
import PresentationServive, {
  IOffersResponse,
} from '../../../services/PresentationServive';
import screenStyles from '../../../styles/screens';

const OffersView: React.FC = () => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [offersStep, setOffersStep] = useState<number>(0);
  const [offers, setOffers] = useState<IOffersResponse[] | undefined>();
  const screenSize = useDimension();

  const handleOffersScroll = (
    event: NativeSyntheticEvent<NativeScrollEvent>,
  ) => {
    let overView = event.nativeEvent.contentOffset.x / (screenSize.width - 25);
    setOffersStep(Math.round(overView));
  };

  const get_GetOffers = () => {
    PresentationServive.get_GetOffers().subscribe({
      next: Response => {
        setOffers(Response.data.data?.offers);
      },
    });
  };

  useEffect(() => {
    get_GetOffers();
  }, [translate.key]);

  const viewOffer = (id: number) => {
    NavigationService.navigate(Routes.OfferDetails, {
      offerId: id,
    });
  };

  if (!offers || !offers?.length) return null;

  return (
    <View style={[styles.offersContainer, Platform.OS === 'ios' && screenStyles.shadowedCardbr15]}>
      <View style={styles.offersContainerHeader}>
        <Text style={styles.offersContainerTitle}>
          {translate.t('dashboard.myOffer')}
        </Text>
        {offers.length > 1 && <PaginationDots step={offersStep} length={offers?.length} />}
      </View>
      <ScrollView
        onScroll={handleOffersScroll}
        showsHorizontalScrollIndicator={false}
        horizontal={true}>
        {offers?.map((o, index) => (
          <TouchableOpacity
            onPress={viewOffer.bind(this, o.id)}
            style={[
              styles.offersContainerItem,
              screenStyles.shadowedCardbr15,
              {width: offers.length === 1 ? screenSize.width - 32 : screenSize.width - 92},
              index === 0 && {marginLeft: 11},
            ]}
            key={`offer${index}`}>
            <Image
              source={{uri: o.imageUrl}}
              style={styles.offersContainerItemImage}
              resizeMode="stretch"
            />
            <View style={styles.offersContainerItemDetails}>
              <Text style={styles.offersContainerItemDetailsTitle} numberOfLines={1}>
                {o.title}
              </Text>
              <Text style={styles.offersContainerItemDetailsSubTitle} numberOfLines={2}>
                {o.text}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  offersContainer: {
    height: 188,
    flex: 1,
    marginTop: 33,
  },
  offersContainerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 18,
    paddingHorizontal: 22,
    marginBottom: 20,
  },
  offersContainerTitle: {
    fontFamily: 'FiraGO-Medium',
    fontSize: 14,
    lineHeight: 17,
    color: colors.black,
  },
  offersContainerItem: {
    overflow: 'hidden',
    height: 143,
    marginHorizontal: 9,
    backgroundColor: colors.white,
  },
  offersContainerItemImage: {
    width: '100%',
    height: 82,
  },
  offersContainerItemDetails: {
    height: 61,
    backgroundColor: colors.white,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  offersContainerItemDetailsTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 10,
    lineHeight: 12,
    color: colors.black,
  },
  offersContainerItemDetailsSubTitle: {
    fontFamily: 'FiraGO-Book',
    fontSize: 9,
    lineHeight: 11,
    color: colors.labelColor,
    marginTop: 4,
  },
});

export default OffersView;
