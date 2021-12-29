import React, {useEffect, useState} from 'react';
import FingerprintScanner, { FingerprintScannerError } from 'react-native-fingerprint-scanner';

interface IProps {
  start: boolean;
  returnStatus: (status: boolean, available?: boolean | undefined) => void;
  onSucces?: () => void;
  onlyStatusCheck?: boolean;
}

const BiometricAuthScreen: React.FC<IProps> = props => {
  const [biometryType, setBiometryType] = useState<unknown>(null);

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
          cancelButton: 'გაუქმება',
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
      return 'მარტივი შესვლა';
    }
  };

  const handleAuthenticationAttempted = (error: FingerprintScannerError) => {
    props.returnStatus(false);
  }

  return null;
};

export default BiometricAuthScreen;
