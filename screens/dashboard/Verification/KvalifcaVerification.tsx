import {
  KvalifikaSDK,
  KvalifikaSDKLocale,
} from '@kvalifika/react-native-sdk';
import React, {useEffect} from 'react';
import FullScreenLoader from '../../../components/FullScreenLoading';

interface IProps {
  startSession?: boolean;
  onClose: (sessionId: string | undefined) => void;
}

const KvalifcaVerification: React.FC<IProps> = props => {
  const InitializeKC = () => {
    KvalifikaSDK.initialize({
      appId: 'iO9UGJdzbkQItk7kxJicWkKFWlvdqWps',
      locale: KvalifikaSDKLocale.EN,
    });
  };

  useEffect(() => {
    if (props.startSession) {
      KvalifikaSDK.onInitialize(() => {
        console.log('Kvalifika', 'Kvalifika SDK Initialized');
        KvalifikaSDK.startSession();
      });

      KvalifikaSDK.onStart(sessionId => {
        console.log(`Started with id: ${sessionId}`);
      });

      KvalifikaSDK.onFinish(sessionId => {
        console.log('Kvalifika', `Session finished with id: ${sessionId}`);
        props.onClose(sessionId);
      });

      KvalifikaSDK.onError((error, message) => {
        console.log(error, message);
        props.onClose(undefined);
      });

      InitializeKC();
    } else {
      KvalifikaSDK.removeCallbacks();
    }

    return () => {
      console.log('removed');
      // Remove callbacks to avoid duplicate listeners if useEffect runs multiple times or remounts
      KvalifikaSDK.removeCallbacks();
    };
  }, [props.startSession]);

  return props.startSession ? <FullScreenLoader /> : null;
};

export default KvalifcaVerification;
