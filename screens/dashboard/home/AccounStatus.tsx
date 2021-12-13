import React from 'react';
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from 'react-native';
import {useSelector} from 'react-redux';
import colors from '../../../constants/colors';
import userStatuses from '../../../constants/userStatuses';
import {
  ITranslateState,
  IGlobalState as ITranslateGlobalState,
} from '../../../redux/action_types/translate_action_types';
import {
  IUserState,
  IGloablState as IUserGlobalState,
} from '../../../redux/action_types/user_action_types';
import screenStyles from '../../../styles/screens';

interface IProps {
  onStartVerification: () => void;
}

const AccountStatusView: React.FC<IProps> = props => {
  const translate = useSelector<ITranslateGlobalState>(
    state => state.TranslateReduser,
  ) as ITranslateState;
  const userData = useSelector<IUserGlobalState>(
    state => state.UserReducer,
  ) as IUserState;
  const {documentVerificationStatusCode, customerVerificationStatusCode} =
    userData.userDetails || {};

  let statusView = <></>;
  if (
    documentVerificationStatusCode === userStatuses.Enum_NotVerified &&
    customerVerificationStatusCode === userStatuses.Enum_NotVerified
  ) {
    statusView = (
      <>
        <Image
          source={require('./../../../assets/images/alert_red.png')}
          style={styles.accountStatusViewSimbol}
        />
        <Text style={styles.accountStatusViewText}>
          {translate.t('dashboard.userVerifyStatus1')}
        </Text>
      </>
    );
  } else if (
    documentVerificationStatusCode === userStatuses.Enum_Verified &&
    customerVerificationStatusCode === userStatuses.Enum_Verified
  ) {
    statusView = (
      <>
        <Image
          source={require('./../../../assets/images/round-checked-20x20.png')}
          style={styles.accountStatusViewSimbol}
        />
        <Text style={styles.accountStatusViewText}>
          {translate.t('dashboard.userVerifyStatus2')}
        </Text>
      </>
    );
  } else if (
    documentVerificationStatusCode === userStatuses.Enum_PartiallyProcessed
  ) {
    statusView = (
      <>
        <Image
          source={require('./../../../assets/images/alert_red.png')}
          style={styles.accountStatusViewSimbol}
        />
        <Text style={styles.accountStatusViewText}>
          {translate.t('dashboard.userVerifyStatus1')}
        </Text>
      </>
    );
  } else {
    statusView = (
      <>
        <Image
          source={require('./../../../assets/images/alert_orange.png')}
          style={styles.accountStatusViewSimbol}
        />
        <Text style={styles.accountStatusViewText}>
          {translate.t('dashboard.userVerifyStatus3')}
        </Text>
      </>
    );
  }

  return (
    <View style={[styles.accountStatusView, screenStyles.shadowedCardbr15]}>
      <View style={styles.accountStatusViewInner}>
        <TouchableOpacity
          onPress={props.onStartVerification}
          style={styles.accountStatusViewTouchable}>
          {userData.isUserLoading ? (
            <ActivityIndicator
              size="small"
              color={colors.primary}
              style={styles.loadingBox}
            />
          ) : (
            statusView
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  accountStatusViewSimbol: {
    width: 20,
    height: 20,
    marginRight: 30,
  },
  accountStatusViewText: {
    fontFamily: 'FiraGO-Book',
    fontSize: 15,
    lineHeight: 19,
    color: colors.black,
  },
  accountStatusView: {
    marginTop: 20,
    minHeight: 46,
    backgroundColor: colors.white,
    flex: 1,
    alignItems: 'center',
  },
  accountStatusViewInner: {
    alignItems: 'center',
    paddingHorizontal: 25,
    paddingVertical: 13,
    flex: 1,
  },
  accountStatusViewTouchable: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  loadingBox: {
    alignSelf: 'center',
    flex: 1,
    marginTop: 10,
  },
});

export default AccountStatusView;
