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
   useEffect(() => {
    KvalifikaSDK.initialize({
      appId: 'iO9UGJdzbkQItk7kxJicWkKFWlvdqWps',
      locale: KvalifikaSDKLocale.EN,
      development: true
    });
  }, [])
    

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
        //props.onClose(sessionId);
      });

      KvalifikaSDK.onError((error, message) => {
        console.log(error, message);
        //props.onClose(undefined);
      });


    return () => {
      console.log('removed');
      // Remove callbacks to avoid duplicate listeners if useEffect runs multiple times or remounts
      KvalifikaSDK.removeCallbacks();
    };
  }, []);

  return props.startSession ? <FullScreenLoader /> : null;
};

export default KvalifcaVerification;
