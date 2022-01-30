import React, {useEffect, useState} from 'react';
import FingerprintScanner, { FingerprintScannerError } from 'react-native-fingerprint-scanner';
import { useSelector } from 'react-redux';
import { ITranslateState, IGlobalState as ITranslateGlobalState } from '../../../redux/action_types/translate_action_types';

interface IProps {
  start: boolean;
  returnStatus: (status: boolean, available?: boolean | undefined) => void;
  onSucces?: () => void;
  onlyStatusCheck?: boolean;
}

const BiometricAuthScreen: React.FC<IProps> = props => {
  const [biometryType, setBiometryType] = useState<unknown>(null);
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  
  useEffect(() => {
    FingerprintScanner.isSensorAvailable()
      .then(biometryType => {
        setBiometryType(biometryType);
      })
      .catch(error => {
        props.returnStatus(error, false);
      });
  }, []);

  useEffect(() => {
    if (props.start) {
      if (biometryType !== null && biometryType !== undefined) {
        FingerprintScanner.authenticate({
          description: getMessage(),
          cancelButton: translate.t('common.cancel'),
          onAttempt: handleAuthenticationAttempted
        })
          .then(() => {
              props.onSucces && props.onSucces();
          })
          .catch(error => {
            props.returnStatus(false);
          });
      } else {
        props.returnStatus(false);
      }
    }

    return () => FingerprintScanner.release();
  }, [props.start]);
  const getMessage = () => {
    if (biometryType == 'Face ID') {
      return 'Scan your Face on the device to continue';
    } else {
      return translate.t('settings.easyLogin');
    }
  };

  const handleAuthenticationAttempted = (error: FingerprintScannerError) => {
    props.returnStatus(false);
  }

  return null;
};

export default BiometricAuthScreen;
