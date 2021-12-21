import {RouteProp, useRoute} from '@react-navigation/native';
import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import colors from '../constants/colors';
import {tabHeight} from '../navigation/TabNav';
import PresentationServive, {
  IOffersDetailResponse,
} from '../services/PresentationServive';
import screenStyles from '../styles/screens';

type RouteParamList = {
  params: {
    offerId: number;
  };
};

const OfferDetails: React.FC = () => {
  const route = useRoute<RouteProp<RouteParamList, 'params'>>();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [offer, setOffer] = useState<IOffersDetailResponse | undefined>();
  const {offerId} = route.params;

  const get_GetOffer = () => {
    setIsLoading(true);
    PresentationServive.get_GetOfferDetail(offerId).subscribe({
      next: Response => {
        setOffer(Response.data.data?.offer);
      },
      complete: () => setIsLoading(false)
    });
  };

  useEffect(() => {
    get_GetOffer();
  }, []);

  return (
    <ScrollView contentContainerStyle={[screenStyles.wraper, styles.avoid]}>
      {isLoading ? (
        <ActivityIndicator
          size="small"
          color={colors.primary}
          style={styles.loadingBox}
        />
      ) : (
        <>
          <Text style={styles.title} numberOfLines={2}>
            {offer?.title}
          </Text>
          <Image
            source={{uri: offer?.imageUrl}}
            style={styles.img}
            resizeMode="cover"
          />
          <Text style={styles.text}>{offer?.description}</Text>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  title: {
    fontFamily: 'FiraGO-Bold',
    lineHeight: 19,
    fontSize: 16,
    textAlign: 'center',
    marginTop: 15,
    flexWrap: 'wrap',
  },
  img: {
    width: '100%',
    minHeight: 150,
    marginTop: 10,
  },
  text: {
    fontFamily: 'FiraGO-Book',
    lineHeight: 17,
    fontSize: 14,
    textAlign: 'left',
    marginTop: 25,
    marginBottom: tabHeight + 40,
  },
  loadingBox: {
    alignSelf: 'center',
    flex: 1,
  },
});

export default OfferDetails;
