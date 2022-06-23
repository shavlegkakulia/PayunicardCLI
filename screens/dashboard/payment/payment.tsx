import React, {useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import CategoryContainer, {
  gridStyle,
} from '../../../components/Payments/CategoryContainer';
import colors from '../../../constants/colors';
import {
  ITranslateState,
  IGlobalState as Itranslate,
} from '../../../redux/action_types/translate_action_types';
import screenStyles from '../../../styles/screens';
import DashboardLayout from '../../DashboardLayout';

const Payment: React.FC = () => {
  const translate = useSelector<Itranslate>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const [refreshing, setRefreshing] = useState(false);

  const onScreenRefresh = (value: boolean) => {
    setRefreshing(value);
  };

  return (
    <DashboardLayout>
      <ScrollView
        style={screenStyles.screenContainer}
        refreshControl={
          <RefreshControl
            progressBackgroundColor={colors.white}
            refreshing={refreshing}
            onRefresh={onScreenRefresh.bind(this, true)}
          />
        }>
        <View style={styles.container}>
        <View style={[screenStyles.wraper, screenStyles.shadowedCardbr15, styles.categories]}>
          <CategoryContainer
            title={translate.t('tabNavigation.payments')}
            gridVariant={gridStyle.twoColumn}
            refresh={refreshing}
            onCategoriesDidLoad={() => {
              onScreenRefresh(false);
            }}
          />
        </View>
        </View>
      </ScrollView>
    </DashboardLayout>
  );
};

export default Payment;

const styles = StyleSheet.create({
  container: {
    padding: 17
  },
  categories: {
    marginTop: 30,
    backgroundColor: colors.white,
    paddingVertical: 17
  }
});
