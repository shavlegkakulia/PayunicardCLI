import React from 'react';
import {
  Dimensions,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
} from 'react-native';

import PDFView from 'react-native-view-pdf';
import colors from '../../../constants/colors';

const AgreeTerm: React.FC = () => {
  const source = {
    uri: 'https://www.payunicard.ge/documents/en/ServiceTermsOfUse.pdf?v=001',
  };

  return (
    <ScrollView contentContainerStyle={styles.avoid}>
      <PDFView
        fadeInDuration={250.0}
        style={{flex: 1}}
        resource={source.uri}
        resourceType="url"
        onLoad={() => console.log(`PDF rendered from url`)}
        onError={error => console.log('Cannot render PDF', error)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  avoid: {
    flexGrow: 1,
    backgroundColor: colors.white,
  },
  pdf: {
    flex: 1,
  },
});

export default AgreeTerm;
