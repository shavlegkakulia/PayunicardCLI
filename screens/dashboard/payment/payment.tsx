import React, {useState} from 'react';
import {RefreshControl, ScrollView, StyleSheet, Text} from 'react-native';
import CategoryContainer from '../../../components/Payments/CategoryContainer';
import colors from '../../../constants/colors';
import screenStyles from '../../../styles/screens';
import DashboardLayout from '../../DashboardLayout';

const Payment: React.FC = () => {
  const [refreshing, setRefreshing] = useState(false);
  const [title, setTitle] = useState<string | undefined>();

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
            {/* <Text>{title}</Text> */}
        <CategoryContainer
          refresh={refreshing}
          onCategoriesDidLoad={(title) => {
            onScreenRefresh(false);
            setTitle(title);
          }}
        />
      </ScrollView>
    </DashboardLayout>
  );
};

export default Payment;

const styles = StyleSheet.create({});
