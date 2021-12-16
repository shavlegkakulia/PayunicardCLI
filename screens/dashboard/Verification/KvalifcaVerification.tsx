import {
  KvalifikaSDK,
  KvalifikaSDKLocale,
} from '@kvalifika/react-native-sdk';
import React, {useEffect, useState} from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import colors from '../../../constants/colors';
import { ka_ge } from '../../../lang';
import Routes from '../../../navigation/routes';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from '../../../redux/action_types/translate_action_types';
import { SET_VER_USERKYCDATA } from '../../../redux/action_types/verification_action_types';
import KvalificaServices, { getKycFullYear, IKCData } from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import { getString } from '../../../utils/Converter';

const kIds = {
  prod: 'lUJvOmqrZC2dLYz5hjJ',
  dev: '912189fb-92c4-4f59-8fcb-204237e010f7'
}

const KvalifcaVerification: React.FC = () => {
  const [sesId, setSesId] = useState<string | undefined>();
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const dispatch = useDispatch();

  const closeKvalificaVerification = () => {
    NavigationService.navigate(Routes.VerificationStep6, {
      verificationStep: 6
    })
  };

  const setUserKYCData = (c: IKCData | undefined) => {
    dispatch({type: SET_VER_USERKYCDATA, userKYCData: c});
  };
  
  const parseAndSetKCdata = (data: IKCData | undefined) => {
    const {
      birthDate,
      countryID,
      documentBackSide,
      documentFrontSide,
      documentNumber,
      documetType,
      firstName,
      lastName,
      personalNumber,
      selfImages,
      sex,
    } = data || {};

    setUserKYCData({
      customerSelfContent: 'Selfie',
      customerSelfName: selfImages?.[0].split('/')[4],
      customerSelf: selfImages?.[0],
      documetType: documetType,
      documentBackSideContent: 'Back',
      documentBackSide: documentBackSide,
      documentBackSideName: documentBackSide?.split('/')[4],
      documentFrontSideContent: 'Front',
      documentFrontSide: documentFrontSide,
      documentFrontSideName: documentFrontSide?.split('/')[4],
      firstName,
      lastName,
      birthCityId: 0,
      countryID,
      sex: sex,
      birthDate: getKycFullYear(getString(birthDate)),
      personalNumber,
      documentNumber,
    });
  };
  
  const closeKycSession = (sessionId: string | undefined, complated: boolean) => {
    if (!sessionId) {
      closeKvalificaVerification();
      return;
    }
    KvalificaServices.CloseKycSession(sessionId).subscribe({
      next: Response => {
        parseAndSetKCdata(Response.data?.data);
      },
      complete: () => {
        if(complated) {
          closeKvalificaVerification();
        } else {
          NavigationService.GoBack();
        }
      },
      error: () => {
        NavigationService.GoBack();
      }
    });
  };


  useEffect(() => {
    KvalifikaSDK.initialize({
      appId: __DEV__ ? kIds.dev : kIds.prod,
      locale: (translate.key === ka_ge) ?  KvalifikaSDKLocale.GE: KvalifikaSDKLocale.EN,
      development: __DEV__ ? true : false
    });
  }, []);

// Now It works, sorry, It should be true, I think, can you plz try, okey sec 
  useEffect(() => {
      KvalifikaSDK.onInitialize(() => {
        console.log('Kvalifika', 'Kvalifika SDK Initialized');
        KvalifikaSDK.startSession();
      });

      KvalifikaSDK.onStart(sessionId => {
        setSesId(sessionId);
        console.log(`Started with id: ${sessionId}`);
      });

      KvalifikaSDK.onFinish(sessionId => {
        console.log('Kvalifika', `Session finished with id: ${sessionId}`);
        closeKycSession(sessionId, true);
      });

      KvalifikaSDK.onError((error, message) => {
        console.log(error, message);
        closeKycSession(sesId, false);
      });

    return () => {
      console.log('removed');
      // Remove callbacks to avoid duplicate listeners if useEffect runs multiple times or remounts
      KvalifikaSDK.removeCallbacks();
    };
  }, []);

  return <View style={styles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>;
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default KvalifcaVerification;
