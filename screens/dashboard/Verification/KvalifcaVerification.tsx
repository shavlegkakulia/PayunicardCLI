import {
  KvalifikaSDK,
  KvalifikaSDKLocale,
} from '@kvalifika/react-native-sdk';
import React, {useEffect} from 'react';
import { Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoading';
import Routes from '../../../navigation/routes';
import { SET_VER_USERKYCDATA } from '../../../redux/action_types/verification_action_types';
import KvalificaServices, { getKycFullYear, IKCData } from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import { getString } from '../../../utils/Converter';

const kIds = {
  prod: 'lUJvOmqrZC2dLYz5hjJ',
  dev: '912189fb-92c4-4f59-8fcb-204237e010f7'
}

const KvalifcaVerification: React.FC = () => {
  const dispatch = useDispatch();

  const closeKvalificaVerification = () => {
    Alert.alert('yes')
    NavigationService.navigate(Routes.VerificationStep7, {
      verificationStep: 7
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
  
  const closeKycSession = (sessionId: string | undefined) => {
    if (!sessionId) {
      closeKvalificaVerification();
      return;
    }
    KvalificaServices.CloseKycSession(sessionId).subscribe({
      next: Response => {
        parseAndSetKCdata(Response.data?.data);
      },
      complete: () => {
        closeKvalificaVerification();
      },
      error: () => {
        NavigationService.GoBack();
      }
    });
  };


  useEffect(() => {
    KvalifikaSDK.initialize({
      appId: 'lUJvOmqrZC2dLYz5hjJ',//__DEV__ ? kIds.dev : kIds.prod,
      locale: KvalifikaSDKLocale.EN,
      //development: true,//__DEV__ ? true : false
    });
  }, []);

// Now It works, sorry, It should be true, I think, can you plz try, okey sec 
  useEffect(() => {
      KvalifikaSDK.onInitialize(() => {
        console.log('Kvalifika', 'Kvalifika SDK Initialized');
        KvalifikaSDK.startSession();
      });

      KvalifikaSDK.onStart(sessionId => {
        console.log(`Started with id: ${sessionId}`);
      });

      KvalifikaSDK.onFinish(sessionId => {
        console.log('Kvalifika', `Session finished with id: ${sessionId}`);
        closeKycSession(sessionId);
      });

      KvalifikaSDK.onError((error, message) => {
        console.log(error, message);
        NavigationService.GoBack();
      });

    return () => {
      console.log('removed');
      // Remove callbacks to avoid duplicate listeners if useEffect runs multiple times or remounts
      KvalifikaSDK.removeCallbacks();
    };
  }, []);

  return <FullScreenLoader />;
};

export default KvalifcaVerification;
