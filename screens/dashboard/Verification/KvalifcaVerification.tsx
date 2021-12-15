import {
  KvalifikaSDK,
  KvalifikaSDKLocale,
} from '@kvalifika/react-native-sdk';
import React, {useEffect} from 'react';
import { useDispatch } from 'react-redux';
import FullScreenLoader from '../../../components/FullScreenLoading';
import Routes from '../../../navigation/routes';
import { SET_VER_USERKYCDATA } from '../../../redux/action_types/verification_action_types';
import KvalificaServices, { getKycFullYear, IKCData } from '../../../services/KvalificaServices';
import NavigationService from '../../../services/NavigationService';
import { getString } from '../../../utils/Converter';

const KvalifcaVerification: React.FC = () => {
  const dispatch = useDispatch();

  const closeKvalificaVerification = () => {
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
    });
  };


  useEffect(() => {
    KvalifikaSDK.initialize({
      appId: 'lUJvOmqrZC2dLYz5hjJ',
      locale: KvalifikaSDKLocale.EN,
      //development: __DEV__ ? true : false
    });
  }, []);

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
        NavigationService.navigate('');
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
